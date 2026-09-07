import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { updateDoc, doc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { db } from '../../firebase/config';
import { UserCheck, Shield, KeyRound, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [department, setDepartment] = useState(profile?.department || '');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg(null);
    setError(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        photoURL,
        phone,
        department,
        updatedAt: new Date().toISOString(),
      });
      await refreshProfile();
      setProfileMsg('Profile details successfully updated.');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);
    setError(null);

    try {
      await updatePassword(user, newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg('Password successfully changed.');
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-4xl mx-auto space-y-8 font-sans">
          <div className="border-b border-zinc-900 pb-6">
            <h1 className="text-3xl font-extrabold text-white uppercase font-mono">MY PROFILE & SECURITY</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage personal contact details and administrator login credentials.</p>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800/60 rounded-xl p-4 flex items-center gap-2 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400" /> <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 font-bold text-2xl uppercase overflow-hidden">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                ) : (
                  profile?.displayName?.slice(0, 2).toUpperCase() || 'SA'
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{profile?.displayName || 'Studio Admin'}</h3>
                <p className="text-xs text-zinc-400 font-mono">{profile?.email}</p>
              </div>
              <div className="pt-2 border-t border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Assigned Role (Read-only)</span>
                <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs rounded-lg uppercase">
                  {profile?.role}
                </span>
                <p className="text-[10px] text-zinc-500 mt-2">
                  Role modifications must be authorized by a Super Administrator in User Management.
                </p>
              </div>
            </div>

            {/* Profile Form & Password Form */}
            <div className="md:col-span-2 space-y-8">
              {/* Profile details form */}
              <form onSubmit={handleUpdateProfile} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-500" /> PROFILE INFORMATION
                </h3>

                {profileMsg && (
                  <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-xl p-3 flex items-center gap-2 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span>{profileMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">Profile Image URL</label>
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {savingProfile ? 'Saving Profile...' : 'Save Profile Changes'}
                </button>
              </form>

              {/* Password change form */}
              <form onSubmit={handleUpdatePassword} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" /> SECURITY & PASSWORD
                </h3>

                {passwordMsg && (
                  <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-xl p-3 flex items-center gap-2 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span>{passwordMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl transition flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> {savingPassword ? 'Updating Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
