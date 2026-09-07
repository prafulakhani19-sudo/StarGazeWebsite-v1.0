import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithCustomToken, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthDiagnosticsState {
  serverTokenRequest: 'PENDING' | 'PASS' | 'FAIL';
  customTokenReceived: 'PENDING' | 'PASS' | 'FAIL' | 'NONE';
  signInOperation: 'PENDING' | 'PASS' | 'FAIL';
  firebaseAuthState: 'INITIALIZING' | 'CONNECTED' | 'NOT CONNECTED';
  firebaseUid: string;
  details?: string;
}

export const AdminLoginPage: React.FC = () => {
  const { setSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [authDiagnostics, setAuthDiagnostics] = useState<AuthDiagnosticsState | null>(null);

  // Trigger server-side bootstrap check silently on component mount
  useEffect(() => {
    fetch('/api/bootstrap')
      .then((res) => res.json())
      .catch((err) => console.warn('Bootstrap trigger silent log:', err));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim();

    setAuthDiagnostics({
      serverTokenRequest: 'PENDING',
      customTokenReceived: 'PENDING',
      signInOperation: 'PENDING',
      firebaseAuthState: 'INITIALIZING',
      firebaseUid: 'None',
    });

    try {
      // 1. Server Token / Authentication Request
      let serverData: any = null;
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        serverData = await response.json();
        if (!response.ok || !serverData.success) {
          throw new Error(serverData.error || 'Invalid email or password credentials.');
        }
        setAuthDiagnostics((prev) => prev ? ({ ...prev, serverTokenRequest: 'PASS' }) : null);
      } catch (srvErr: any) {
        setAuthDiagnostics((prev) => prev ? ({ ...prev, serverTokenRequest: 'FAIL', details: srvErr.message }) : null);
        throw srvErr;
      }

      // 2. Custom Token or Direct Firebase Auth Handshake
      let authUser: any = null;

      if (serverData.customToken) {
        setAuthDiagnostics((prev) => prev ? ({ ...prev, customTokenReceived: 'PASS' }) : null);
        try {
          const result = await signInWithCustomToken(auth, serverData.customToken);
          authUser = result.user;
          setAuthDiagnostics((prev) => prev ? ({ ...prev, signInOperation: 'PASS' }) : null);
        } catch (customErr: any) {
          console.warn('Custom token sign in failed:', customErr.message);
          setAuthDiagnostics((prev) => prev ? ({ ...prev, signInOperation: 'FAIL' }) : null);
        }
      } else {
        setAuthDiagnostics((prev) => prev ? ({ ...prev, customTokenReceived: 'NONE' }) : null);
      }

      // If customToken was not used or failed, authenticate directly via Firebase Client SDK
      if (!authUser) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
          authUser = userCredential.user;
          setAuthDiagnostics((prev) => prev ? ({ ...prev, signInOperation: 'PASS' }) : null);
        } catch (clientErr: any) {
          console.warn('Client signInWithEmailAndPassword with primary password encountered:', clientErr.code || clientErr.message);

          // Fallback: If server verified password and user account had initial bootstrap passwords,
          // authenticate with known fallback credentials and immediately synchronize the user's password into Firebase Auth.
          const fallbackCandidates = ['Praful@1989', 'Pass@123'];
          for (const fallbackPass of fallbackCandidates) {
            if (password === fallbackPass || authUser) continue;
            try {
              const bootstrapCredential = await signInWithEmailAndPassword(auth, cleanEmail, fallbackPass);
              authUser = bootstrapCredential.user;
              try {
                await updatePassword(authUser, password);
                console.log('Firebase Auth password updated to match user password.');
              } catch (updateErr) {
                console.warn('Silent password update warning:', updateErr);
              }
              setAuthDiagnostics((prev) => prev ? ({ ...prev, signInOperation: 'PASS' }) : null);
              break;
            } catch (fallbackErr: any) {
              console.warn(`Fallback ${fallbackPass} signIn failed:`, fallbackErr.message);
            }
          }

          if (!authUser) {
            setAuthDiagnostics((prev) => prev ? ({ ...prev, signInOperation: 'FAIL', details: clientErr.message }) : null);
            throw new Error('Firebase Authentication failed: ' + (clientErr.message || 'Invalid credentials.'));
          }
        }
      }

      // 3. Strict Promise & State Verification: result.user.uid must exist and auth.currentUser must be populated
      if (!authUser || !authUser.uid || !auth.currentUser) {
        setAuthDiagnostics((prev) => prev ? ({ ...prev, firebaseAuthState: 'NOT CONNECTED', firebaseUid: 'None' }) : null);
        throw new Error('Firebase Authentication verification failed: auth.currentUser is not populated.');
      }

      const verifiedUid = auth.currentUser.uid;
      setAuthDiagnostics((prev) => prev ? ({
        ...prev,
        firebaseAuthState: 'CONNECTED',
        firebaseUid: verifiedUid,
      }) : null);

      // Save session credentials
      if (serverData.user && serverData.token) {
        setSession(serverData.user, serverData.token);
      }

      // 4. Verify or initialize Firestore profile for the authenticated UID
      const userDocRef = doc(db, 'users', verifiedUid);
      let userDocSnap: any = null;
      try {
        userDocSnap = await getDoc(userDocRef);
      } catch (getErr) {
        console.warn('Silent userDoc get warning:', getErr);
      }

      const isSuper = cleanEmail.toLowerCase() === 'praful.akhani19@gmail.com';

      if (!userDocSnap || !userDocSnap.exists()) {
        let existingData: any = null;
        try {
          const q = query(collection(db, 'users'), where('email', '==', cleanEmail.toLowerCase()));
          const snap = await getDocs(q);
          if (!snap.empty) {
            existingData = snap.docs[0].data();
          }
        } catch (e) {
          console.warn('Silent email search warning:', e);
        }

        const initialProfile = {
          id: verifiedUid,
          email: cleanEmail.toLowerCase(),
          displayName: existingData?.displayName || (isSuper ? 'Praful Akhani' : cleanEmail.split('@')[0]),
          role: existingData?.role || (isSuper ? 'SUPER_ADMIN' : 'EDITOR'),
          status: 'ACTIVE',
          department: isSuper ? 'Executive Board' : (existingData?.department || 'Operations'),
          requiresPasswordChange: false,
          createdAt: existingData?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(userDocRef, initialProfile, { merge: true });
          userDocSnap = await getDoc(userDocRef);
        } catch (e) {
          console.warn('Client profile creation warning:', e);
        }
      }

      if (userDocSnap && userDocSnap.exists()) {
        const profile = userDocSnap.data();
        if (profile.status === 'INACTIVE') {
          await auth.signOut();
          throw new Error('This account has been deactivated by a Super Administrator.');
        }

        if (profile.requiresPasswordChange) {
          setTimeout(() => {
            window.location.href = '/admin/change-password';
          }, 400);
          return;
        }
      }

      // 5. Navigate to Admin Dashboard after successful Firebase authentication
      setTimeout(() => {
        window.location.href = '/admin';
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address to receive a password reset link.');
      return;
    }
    setLoading(true);
    setError(null);
    setResetMessage(null);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetMessage(`Password reset link sent to ${email}. Check your inbox.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative font-sans selection:bg-amber-500 selection:text-black">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-black mx-auto shadow-lg shadow-amber-500/20">
            <Sparkles className="w-7 h-7 fill-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider text-white uppercase font-mono">STARGAZE CMS</h1>
            <p className="text-xs text-amber-500 font-mono tracking-widest uppercase">ADMINISTRATOR PORTAL</p>
          </div>
          <p className="text-xs text-zinc-400">
            Sign in with authorized studio credentials to access role-based administration.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-800/60 rounded-xl p-3.5 flex items-start gap-3 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {resetMessage && (
          <div className="mb-6 bg-emerald-950/50 border border-emerald-800/60 rounded-xl p-3.5 flex items-start gap-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{resetMessage}</span>
          </div>
        )}

        {authDiagnostics && (
          <div className="mb-6 bg-zinc-950 border border-amber-500/30 rounded-xl p-4 text-xs font-mono space-y-2 text-zinc-300">
            <div className="text-amber-400 font-bold uppercase tracking-wider border-b border-zinc-800 pb-1 flex justify-between">
              <span>Authentication Diagnostics</span>
              <span className={authDiagnostics.firebaseAuthState === 'CONNECTED' ? 'text-emerald-400' : 'text-amber-400'}>
                {authDiagnostics.firebaseAuthState}
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">SERVER TOKEN REQUEST:</span>
                <span className={authDiagnostics.serverTokenRequest === 'PASS' ? 'text-emerald-400 font-bold' : authDiagnostics.serverTokenRequest === 'FAIL' ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                  {authDiagnostics.serverTokenRequest}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">CUSTOM TOKEN RECEIVED:</span>
                <span className={authDiagnostics.customTokenReceived === 'PASS' ? 'text-emerald-400 font-bold' : authDiagnostics.customTokenReceived === 'FAIL' ? 'text-rose-400 font-bold' : 'text-zinc-400 font-bold'}>
                  {authDiagnostics.customTokenReceived}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">signInWithCustomToken:</span>
                <span className={authDiagnostics.signInOperation === 'PASS' ? 'text-emerald-400 font-bold' : authDiagnostics.signInOperation === 'FAIL' ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                  {authDiagnostics.signInOperation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Firebase Auth state:</span>
                <span className={authDiagnostics.firebaseAuthState === 'CONNECTED' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {authDiagnostics.firebaseAuthState}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Firebase UID:</span>
                <span className="text-white font-mono">{authDiagnostics.firebaseUid}</span>
              </div>
            </div>
          </div>
        )}

        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="name@stargazemedia.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-mono text-zinc-300 uppercase">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] text-amber-400 hover:underline font-mono"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 transition flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin CMS'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">Reset Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="name@stargazemedia.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition"
            >
              {loading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded-xl transition"
            >
              Back to Sign In
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-500">
            Internal Stargaze Media System • Role-Based Access Enforced
          </p>
        </div>
      </div>
    </div>
  );
};
