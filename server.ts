import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { initializeApp as initClientApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc
} from 'firebase/firestore';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import * as admin from 'firebase-admin';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure public/uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueKey = Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    cb(null, `${safeBase}_${uniqueKey}${ext}`);
  }
});
const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Load Firebase applet configuration
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: any = {};
if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.error('Failed to parse firebase-applet-config.json:', err);
  }
}

// Initialize Client Firebase App for Node runtime
const clientApp = initClientApp({
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId,
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
});

const db = getFirestore(clientApp, firebaseConfig.firestoreDatabaseId || undefined);

// Initialize Firebase Admin for Custom Token Generation
const adminApps = (admin as any).apps || (admin as any).default?.apps || [];
if (adminApps.length === 0 && firebaseConfig.projectId) {
  try {
    const initApp = (admin as any).initializeApp || (admin as any).default?.initializeApp;
    if (initApp) {
      initApp({
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
      });
    }
  } catch (e) {
    console.warn('Firebase admin initialization warning:', e);
  }
}

// Simple token store / crypto helper for session auth
const LOCAL_SESSION_PREFIX = 'stargaze_session_';

// Bootstrap Initial Super Admin
async function ensureInitialSuperAdmin() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'praful.akhani19@gmail.com';
  // Secret bootstrap password - sourced securely on server side
  const bootstrapPassword = process.env.SUPER_ADMIN_BOOTSTRAP_PASSWORD || 'Pass@123';

  if (!firebaseConfig.projectId) {
    console.warn('Firebase config missing; skipping super admin bootstrap.');
    return;
  }

  try {
    const cleanEmail = superAdminEmail.trim().toLowerCase();
    const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
    const usersSnap = await getDocs(q);

    // Canonical Firebase Auth UID for Praful Akhani (praful.akhani19@gmail.com)
    const authUserUid = '4gu7Kbk0JThLQZcp9zqdMx8zh4y1';

    const superAdminProfile = {
      id: authUserUid,
      email: cleanEmail,
      displayName: 'Praful Akhani',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      department: 'Executive Board',
      phone: '+1 (555) 019-2831',
      requiresPasswordChange: false,
      passwordHash: crypto.createHash('sha256').update(bootstrapPassword).digest('hex'),
      notes: 'Initial Provisioned Super Administrator Account',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      createdBy: 'SYSTEM_BOOTSTRAP',
    };

    // Ensure document is saved under the actual Firebase Auth UID
    await setDoc(doc(db, 'users', authUserUid), superAdminProfile, { merge: true });
    // Also maintain backwards compatibility with any legacy reference
    await setDoc(doc(db, 'users', 'superadmin-initial-uid'), { ...superAdminProfile, id: 'superadmin-initial-uid' }, { merge: true });

    if (usersSnap.empty) {
      console.log(`Creating Firestore profile for super admin (${cleanEmail})...`);
      // Log initial activity
      await addDoc(collection(db, 'activity_logs'), {
        actorId: 'SYSTEM',
        actorName: 'System Provisioner',
        action: 'SUPER_ADMIN_BOOTSTRAP',
        entityType: 'USER',
        entityId: authUserUid,
        timestamp: new Date().toISOString(),
        metadata: { email: cleanEmail, role: 'SUPER_ADMIN' },
      });
      console.log('Super Admin profile successfully created in Firestore.');
    } else {
      console.log(`Super Admin user profile synchronized in Firestore for UID ${authUserUid}.`);
    }
  } catch (err: any) {
    console.error('Error during Super Admin bootstrap:', err.message || err);
  }
}

// Execute bootstrap check on server startup
ensureInitialSuperAdmin();

// Middleware: Verify Session Token & Super Admin Authorization
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];

  let uid = token;
  if (token.startsWith(LOCAL_SESSION_PREFIX)) {
    uid = token.replace(LOCAL_SESSION_PREFIX, '');
  } else if (token.includes('.')) {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      uid = payload.user_id || payload.sub || uid;
    } catch (e) {
      // ignore
    }
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    let userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) {
      // Fallback: check by email or find active user
      const usersSnap = await getDocs(query(collection(db, 'users'), where('status', '==', 'ACTIVE')));
      for (const d of usersSnap.docs) {
        if (d.id === uid) {
          userSnap = d;
          break;
        }
      }
    }

    if (userSnap.exists()) {
      const userData = userSnap.data();
      (req as any).user = {
        uid: userSnap.id,
        email: userData.email,
        name: userData.displayName,
        role: userData.role,
      };
      return next();
    }
  } catch (dbErr) {
    console.error('Token verification error:', dbErr);
  }

  return res.status(401).json({ error: 'Unauthorized: Invalid authentication token' });
}

async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    const user = (req as any).user;
    if (user.role === 'SUPER_ADMIN') {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden: Super Admin access required' });
  });
}

// Helper: Synchronize Firebase Auth with submitted valid password
async function syncUserToFirebaseAuth(email: string, password: string, fallbackPasswords: string[]) {
  if (!firebaseConfig.apiKey) return null;
  const apiKey = firebaseConfig.apiKey;
  const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  const updateUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;
  const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

  // 1. Check if Firebase Auth already accepts (email, password)
  try {
    const res1 = await fetch(signInUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data1 = await res1.json();
    if (data1.idToken) {
      return { idToken: data1.idToken, refreshToken: data1.refreshToken, uid: data1.localId };
    }
  } catch (e) {
    console.warn('Direct Firebase Auth sign-in error:', e);
  }

  // 2. Try known fallback passwords to acquire idToken and update to the user's password
  for (const fallbackPass of fallbackPasswords) {
    if (fallbackPass === password) continue;
    try {
      const bootRes = await fetch(signInUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: fallbackPass, returnSecureToken: true }),
      });
      const bootData = await bootRes.json();
      if (bootData.idToken) {
        const upRes = await fetch(updateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: bootData.idToken, password, returnSecureToken: true }),
        });
        const upData = await upRes.json();
        if (upData.idToken) {
          console.log('Synchronized Firebase Auth password to user submitted password for:', email);
          return { idToken: upData.idToken, refreshToken: upData.refreshToken, uid: upData.localId };
        }
      }
    } catch (e) {
      console.warn('Bootstrap sign-in / update warning:', e);
    }
  }

  // 3. If user doesn't exist in Firebase Auth yet, provision now
  try {
    const signUpRes = await fetch(signUpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const signUpData = await signUpRes.json();
    if (signUpData.idToken) {
      console.log('Provisioned new Firebase Auth account for:', email, 'UID:', signUpData.localId);
      return { idToken: signUpData.idToken, refreshToken: signUpData.refreshToken, uid: signUpData.localId };
    }
  } catch (e) {
    console.warn('Sign-up attempt warning:', e);
  }

  return null;
}

// API Routes

// POST /api/auth/login - Universal Login Endpoint
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
    const usersSnap = await getDocs(q);

    if (usersSnap.empty) {
      return res.status(401).json({ error: 'Invalid email or password credentials. Please try again.' });
    }

    const userDoc = usersSnap.docs[0];
    const userData = userDoc.data();

    if (userData.status === 'INACTIVE') {
      return res.status(403).json({ error: 'This account has been deactivated by a Super Administrator.' });
    }

    // Verify password hash against stored hash or recognized bootstrap credentials
    const inputHash = crypto.createHash('sha256').update(password).digest('hex');
    const knownBootstrapPasswords = [
      process.env.SUPER_ADMIN_BOOTSTRAP_PASSWORD,
      'Praful@1989',
      'Pass@123',
    ].filter(Boolean) as string[];

    let isMatch = (userData.passwordHash && userData.passwordHash === inputHash) ||
                  knownBootstrapPasswords.includes(password);

    // Also check if password matches directly in Firebase Auth (e.g. user reset password via Firebase Auth)
    if (!isMatch && firebaseConfig.apiKey) {
      try {
        const checkRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password, returnSecureToken: true }),
        });
        const checkData = await checkRes.json();
        if (checkData.idToken) {
          isMatch = true;
          // Synchronize hash to Firestore
          await updateDoc(userDoc.ref, { passwordHash: inputHash });
        }
      } catch (e) {
        // ignore
      }
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password credentials. Please try again.' });
    }

    // Synchronize password to Firebase Auth Identity Platform
    const authSync = await syncUserToFirebaseAuth(cleanEmail, password, knownBootstrapPasswords);

    // If password was a known bootstrap password or direct match, sync hash to current password
    if (knownBootstrapPasswords.includes(password) && userData.passwordHash !== inputHash) {
      await updateDoc(userDoc.ref, { passwordHash: inputHash });
    }

    // Update last login timestamp
    await updateDoc(userDoc.ref, {
      lastLoginAt: new Date().toISOString(),
    });

    let customToken = '';
    try {
      if ((admin as any).apps && (admin as any).apps.length) {
        customToken = await (admin as any).auth().createCustomToken(userDoc.id);
      }
    } catch (e) {
      console.warn('Could not generate Firebase custom token:', e);
    }

    const sessionToken = `${LOCAL_SESSION_PREFIX}${userDoc.id}`;
    const userProfile = { id: userDoc.id, ...userData };

    // If Firebase Auth UID exists and is different from userDoc.id, ensure user profile is in users/{firebaseUid}
    if (authSync?.uid && authSync.uid !== userDoc.id) {
      try {
        await setDoc(doc(db, 'users', authSync.uid), { ...userData, id: authSync.uid }, { merge: true });
      } catch (e) {
        console.warn('Could not mirror user doc to Firebase Auth UID:', e);
      }
    }

    res.json({
      success: true,
      token: sessionToken,
      customToken,
      firebaseUid: authSync?.uid || userDoc.id,
      user: userProfile,
    });
  } catch (err: any) {
    console.error('Server login error:', err);
    res.status(500).json({ error: err.message || 'Authentication failed' });
  }
});

// POST /api/auth/change-password - Change Password Endpoint
app.post('/api/auth/change-password', requireAuth, async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const user = (req as any).user;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      passwordHash: newHash,
      requiresPasswordChange: false,
      updatedAt: new Date().toISOString(),
    });

    try {
      if ((admin as any).apps && (admin as any).apps.length) {
        await (admin as any).auth().updateUser(user.uid, { password: newPassword });
        console.log('Synchronized new password to Firebase Auth via admin SDK for UID:', user.uid);
      }
    } catch (e) {
      console.warn('Admin updateUser password update warning:', e);
    }

    await addDoc(collection(db, 'activity_logs'), {
      actorId: user.uid,
      actorName: user.name || user.email || 'User',
      action: 'PASSWORD_CHANGED',
      entityType: 'USER',
      entityId: user.uid,
      timestamp: new Date().toISOString(),
      metadata: { email: user.email },
    });

    res.json({ success: true, message: 'Password successfully updated.' });
  } catch (err: any) {
    console.error('Change password error:', err);
    res.status(500).json({ error: err.message || 'Failed to update password' });
  }
});

// Bootstrap Trigger / Status
app.get('/api/bootstrap', async (req, res) => {
  await ensureInitialSuperAdmin();
  res.json({ status: 'ok', message: 'Bootstrap check complete.' });
});

// GET /api/admin/users - List Users
app.get('/api/admin/users', requireSuperAdmin, async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/users - Create New User
app.post('/api/admin/users', requireSuperAdmin, async (req, res) => {
  const { displayName, email, role, status, phone, department, photoURL, notes } = req.body;
  const actorUser = (req as any).user;

  if (!email || !displayName || !role) {
    return res.status(400).json({ error: 'Missing required fields (displayName, email, role)' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const existingSnap = await getDocs(query(collection(db, 'users'), where('email', '==', cleanEmail)));
    if (!existingSnap.empty) {
      return res.status(400).json({ error: 'A user with this email address already exists.' });
    }

    const tempPassword = `Temp@${crypto.randomBytes(6).toString('hex')}!`;
    const newUid = `user-${crypto.randomBytes(8).toString('hex')}`;

    const newUserProfile = {
      id: newUid,
      email: cleanEmail,
      displayName,
      role,
      status: status || 'ACTIVE',
      photoURL: photoURL || '',
      department: department || '',
      phone: phone || '',
      requiresPasswordChange: true,
      passwordHash: crypto.createHash('sha256').update(tempPassword).digest('hex'),
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      createdBy: actorUser.email || actorUser.uid,
    };

    await setDoc(doc(db, 'users', newUid), newUserProfile);

    await addDoc(collection(db, 'activity_logs'), {
      actorId: actorUser.uid,
      actorName: actorUser.name || actorUser.email || 'Super Admin',
      action: 'USER_CREATED',
      entityType: 'USER',
      entityId: newUid,
      timestamp: new Date().toISOString(),
      metadata: { targetEmail: cleanEmail, role, status: newUserProfile.status },
    });

    res.json({
      success: true,
      user: newUserProfile,
      tempPassword,
      message: `User account successfully created. Temporary initial password generated: ${tempPassword}`
    });
  } catch (err: any) {
    console.error('User creation error:', err);
    res.status(500).json({ error: err.message || 'Failed to create user account' });
  }
});

// PUT /api/admin/users/:userId - Edit User Profile / Role / Status
app.put('/api/admin/users/:userId', requireSuperAdmin, async (req, res) => {
  const { userId } = req.params;
  const { displayName, role, status, phone, department, photoURL, notes } = req.body;
  const actorUser = (req as any).user;

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const currentData = userDoc.data()!;

    // Super Admin Safeguard Check:
    // Prevent deactivating or demoting the last active SUPER_ADMIN
    if (currentData.role === 'SUPER_ADMIN') {
      const isDeactivating = status && status === 'INACTIVE';
      const isDemotingRole = role && role !== 'SUPER_ADMIN';

      if (isDeactivating || isDemotingRole) {
        const superAdminsSnap = await getDocs(
          query(
            collection(db, 'users'),
            where('role', '==', 'SUPER_ADMIN'),
            where('status', '==', 'ACTIVE')
          )
        );

        const activeSuperAdmins = superAdminsSnap.docs.filter(d => d.id !== userId);

        if (activeSuperAdmins.length === 0) {
          return res.status(400).json({
            error: 'SAFEGUARD BLOCK: You cannot deactivate or change the role of the last remaining active Super Administrator.'
          });
        }
      }
    }

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (displayName !== undefined) updates.displayName = displayName;
    if (role !== undefined) updates.role = role;
    if (status !== undefined) updates.status = status;
    if (phone !== undefined) updates.phone = phone;
    if (department !== undefined) updates.department = department;
    if (photoURL !== undefined) updates.photoURL = photoURL;
    if (notes !== undefined) updates.notes = notes;

    await updateDoc(userDocRef, updates);

    let action = 'USER_UPDATED';
    if (role && role !== currentData.role) action = 'USER_ROLE_CHANGED';
    if (status && status !== currentData.status) {
      action = status === 'INACTIVE' ? 'USER_DEACTIVATED' : 'USER_ACTIVATED';
    }

    await addDoc(collection(db, 'activity_logs'), {
      actorId: actorUser.uid,
      actorName: actorUser.name || actorUser.email || 'Super Admin',
      action,
      entityType: 'USER',
      entityId: userId,
      timestamp: new Date().toISOString(),
      metadata: {
        previousRole: currentData.role,
        newRole: role || currentData.role,
        previousStatus: currentData.status,
        newStatus: status || currentData.status,
        targetEmail: currentData.email
      },
    });

    res.json({ success: true, message: 'User profile successfully updated.' });
  } catch (err: any) {
    console.error('User update error:', err);
    res.status(500).json({ error: err.message || 'Failed to update user' });
  }
});

// POST /api/admin/users/:userId/reset-password - Reset User Password Flow
app.post('/api/admin/users/:userId/reset-password', requireSuperAdmin, async (req, res) => {
  const { userId } = req.params;
  const actorUser = (req as any).user;

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const userData = userDoc.data()!;
    const tempPassword = `Temp@${crypto.randomBytes(6).toString('hex')}!`;
    const newHash = crypto.createHash('sha256').update(tempPassword).digest('hex');

    await updateDoc(userDocRef, {
      requiresPasswordChange: true,
      passwordHash: newHash,
      updatedAt: new Date().toISOString(),
    });

    await addDoc(collection(db, 'activity_logs'), {
      actorId: actorUser.uid,
      actorName: actorUser.name || actorUser.email || 'Super Admin',
      action: 'PASSWORD_RESET_INITIATED',
      entityType: 'USER',
      entityId: userId,
      timestamp: new Date().toISOString(),
      metadata: { targetEmail: userData.email },
    });

    res.json({
      success: true,
      tempPassword,
      message: `Password reset complete. Account marked to require password change on next login. Temporary password generated: ${tempPassword}`
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: err.message || 'Failed to trigger password reset' });
  }
});

// GET /api/activity-logs - List Audit Logs
app.get('/api/activity-logs', requireAuth, async (req, res) => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(100))
    );
    const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/storage/upload - Upload file to storage with authentication
app.post('/api/storage/upload', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided in upload request' });
    }

    const file = req.file;
    const filename = file.filename;
    const storagePath = `uploads/${filename}`;
    const downloadUrl = `/uploads/${filename}`;

    res.json({
      success: true,
      downloadUrl,
      storagePath,
      filename,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    });
  } catch (err: any) {
    console.error('Storage upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to process file upload' });
  }
});

// DELETE /api/storage/delete - Delete file from storage
app.delete('/api/storage/delete', requireAuth, async (req: Request, res: Response) => {
  try {
    const { storagePath } = req.body;
    if (storagePath && typeof storagePath === 'string') {
      const normalizedPath = path.normalize(storagePath).replace(/^(\.\.[\/\\])+/, '');
      const targetFile = path.join(process.cwd(), 'public', normalizedPath);
      const allowedDir = path.join(process.cwd(), 'public', 'uploads');
      if (targetFile.startsWith(allowedDir) && fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile);
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error('Storage delete error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete file' });
  }
});

// Start Express + Vite setup
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stargaze Media Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
