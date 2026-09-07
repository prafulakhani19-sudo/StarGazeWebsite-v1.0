import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, ShieldAlert, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const ChangePasswordPage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error('Not authenticated');

      let firebaseAuthSuccess = false;
      try {
        if (typeof user.getIdToken === 'function') {
          await updatePassword(user, newPassword);
          firebaseAuthSuccess = true;
        }
      } catch (fbErr: any) {
        console.warn('Firebase Auth password update skipped/failed, using server endpoint:', fbErr.message);
      }

      // Always call server password update endpoint to update password hash in Firestore
      const token = localStorage.getItem('stargaze_auth_token') || (typeof user.getIdToken === 'function' ? await user.getIdToken() : '');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok && !firebaseAuthSuccess) {
        const resData = await response.json();
        throw new Error(resData.error || 'Failed to update password.');
      }

      // Update Firestore user profile directly client-side as well
      try {
        const userRef = doc(db, 'users', user.uid || profile?.id || '');
        await updateDoc(userRef, {
          requiresPasswordChange: false,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Client doc update log:', e);
      }

      await refreshProfile();
      setSuccess(true);

      setTimeout(() => {
        window.location.href = '/admin';
      }, 1500);
    } catch (err: any) {
      console.error('Password update error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Security rule: Please log out and sign in again before updating your password.');
      } else {
        setError(err.message || 'Failed to update password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-md w-full bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl p-8">
        <div className="text-center space-y-3 mb-6">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white uppercase font-mono">
            {profile?.requiresPasswordChange ? 'Mandatory Password Change' : 'Update Your Password'}
          </h1>
          <p className="text-xs text-zinc-400">
            {profile?.requiresPasswordChange
              ? 'As a security mandate for initial credentials, you must establish a new private administrator password before continuing.'
              : 'Choose a strong new password for your Stargaze CMS account.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-950/50 border border-red-800/60 rounded-xl p-3 flex items-start gap-2 text-red-300 text-xs">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-emerald-950/50 border border-emerald-800/60 rounded-xl p-3 flex items-start gap-2 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Password successfully changed! Redirecting to CMS dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="At least 6 characters..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="Re-type new password..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Updating Password...' : 'Establish New Password'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
