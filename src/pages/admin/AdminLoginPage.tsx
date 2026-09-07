import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { setSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

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

    try {
      // 1. Try Firebase Client Auth
      let user: any = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        user = userCredential.user;
      } catch (firebaseErr: any) {
        console.warn('Firebase auth attempt failed, trying server endpoint:', firebaseErr.message);
      }

      // 2. If Firebase Client Auth succeeded
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const profile = userDocSnap.data();

          if (profile.status === 'INACTIVE') {
            setError('This account has been deactivated by a Super Administrator.');
            await auth.signOut();
            setLoading(false);
            return;
          }

          if (profile.requiresPasswordChange) {
            window.location.href = '/admin/change-password';
            return;
          }
        }
        window.location.href = '/admin';
        return;
      }

      // 3. Fallback to Server Auth API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password credentials. Please try again.');
      }

      setSession(data.user, data.token);

      if (data.user.requiresPasswordChange) {
        window.location.href = '/admin/change-password';
      } else {
        window.location.href = '/admin';
      }
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
