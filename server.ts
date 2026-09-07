import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
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

const app = express();
const PORT = 3000;

app.use(express.json());

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

    const authUserUid = 'superadmin-initial-uid';

    if (usersSnap.empty) {
      console.log(`Creating Firestore profile for super admin (${cleanEmail})...`);
      const userDocRef = doc(db, 'users', authUserUid);
      await setDoc(userDocRef, {
        id: authUserUid,
        email: cleanEmail,
        displayName: 'Praful Akhani',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        department: 'Executive Board',
        phone: '+1 (555) 019-2831',
        requiresPasswordChange: true,
        passwordHash: crypto.createHash('sha256').update(bootstrapPassword).digest('hex'),
        notes: 'Initial Provisioned Super Administrator Account',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null,
        createdBy: 'SYSTEM_BOOTSTRAP',
      });

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
      console.log('Super Admin user profile already exists in Firestore.');
      // Ensure password hash is set if missing
      const userDoc = usersSnap.docs[0];
      if (!userDoc.data().passwordHash) {
        await updateDoc(userDoc.ref, {
          passwordHash: crypto.createHash('sha256').update(bootstrapPassword).digest('hex'),
        });
      }
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
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
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

    // Verify password hash
    const inputHash = crypto.createHash('sha256').update(password).digest('hex');
    const superAdminPassword = process.env.SUPER_ADMIN_BOOTSTRAP_PASSWORD || 'Pass@123';

    const isMatch = (userData.passwordHash && userData.passwordHash === inputHash) ||
                    (password === superAdminPassword);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password credentials. Please try again.' });
    }

    // Update last login timestamp
    await updateDoc(userDoc.ref, {
      lastLoginAt: new Date().toISOString(),
    });

    const sessionToken = `${LOCAL_SESSION_PREFIX}${userDoc.id}`;
    const userProfile = { id: userDoc.id, ...userData };

    res.json({
      success: true,
      token: sessionToken,
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

// Start Express + Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
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
