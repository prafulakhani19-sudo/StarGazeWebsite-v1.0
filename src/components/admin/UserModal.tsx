import React, { useState, useEffect } from 'react';
import { Role, UserProfile, UserStatus } from '../../types';
import { ROLE_SUMMARIES } from '../../permissions';
import { X, Check, ShieldAlert, Sparkles, UserPlus, Edit3, Lock } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Partial<UserProfile>) => Promise<any>;
  userToEdit?: UserProfile | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
}) => {
  const isEditing = !!userToEdit;

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('EDITOR');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<{ setupLink?: string; message?: string } | null>(null);

  useEffect(() => {
    if (userToEdit) {
      setDisplayName(userToEdit.displayName || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || 'EDITOR');
      setStatus(userToEdit.status || 'ACTIVE');
      setPhone(userToEdit.phone || '');
      setDepartment(userToEdit.department || '');
      setPhotoURL(userToEdit.photoURL || '');
      setNotes(userToEdit.notes || '');
    } else {
      setDisplayName('');
      setEmail('');
      setRole('EDITOR');
      setStatus('ACTIVE');
      setPhone('');
      setDepartment('');
      setPhotoURL('');
      setNotes('');
    }
    setError(null);
    setCreatedResult(null);
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await onSave({
        displayName,
        email,
        role,
        status,
        phone,
        department,
        photoURL,
        notes,
      });

      if (!isEditing && result?.setupLink) {
        setCreatedResult(result);
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save user account.');
    } finally {
      setLoading(false);
    }
  };

  const currentSummary = ROLE_SUMMARIES[role] || { can: [], cannot: [] };
  const canList = currentSummary.can || [];
  const cannotList = currentSummary.cannot || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            {isEditing ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase font-mono">
              {isEditing ? 'Edit User Credentials & Access' : 'Create Internal CMS Account'}
            </h2>
            <p className="text-xs text-zinc-400">
              {isEditing
                ? `Updating profile and role permissions for ${userToEdit.email}`
                : 'Provision a new internal user account with structured role-based access'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-950/50 border border-red-800/60 rounded-xl p-3 flex items-start gap-2 text-red-300 text-xs">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {createdResult ? (
          <div className="space-y-4 bg-zinc-950 border border-emerald-500/40 rounded-xl p-5">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
              <Check className="w-5 h-5" /> Account Successfully Provisioned
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              The account for <strong className="text-white">{email}</strong> was created. A password setup trigger has been initiated.
            </p>

            {createdResult.setupLink && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  Secure Password Setup Link:
                </label>
                <input
                  type="text"
                  readOnly
                  value={createdResult.setupLink}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-200 focus:outline-none select-all"
                />
                <p className="text-[10px] text-zinc-500">
                  Provide this secure one-time link to the user to establish their initial password. Plaintext passwords are never shown or emailed.
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-lg"
            >
              Done & Return to User List
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Vikram Akhani"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 ${
                    isEditing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  placeholder="user@stargazemedia.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Assigned Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full System Access)</option>
                  <option value="CONTENT_ADMIN">CONTENT_ADMIN (Homepage & Film Slate)</option>
                  <option value="EDITOR">EDITOR (Draft & Edit Projects/News)</option>
                  <option value="EQUIPMENT_MANAGER">EQUIPMENT_MANAGER (Cameras & Gear)</option>
                  <option value="EVENT_MANAGER">EVENT_MANAGER (Festivals & Premieres)</option>
                  <option value="MARKETING_MANAGER">MARKETING_MANAGER (PR & SEO)</option>
                  <option value="DISTRIBUTION_MANAGER">DISTRIBUTION_MANAGER (Licensing)</option>
                  <option value="VIEWER">VIEWER (Read-Only Summary)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Account Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="ACTIVE">ACTIVE (Full CMS Access)</option>
                  <option value="INACTIVE">INACTIVE (Access Blocked)</option>
                </select>
              </div>
            </div>

            {/* ROLE ASSIGNMENT UX SUMMARY BOX */}
            <div className="bg-zinc-950 border border-amber-900/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" /> ROLE PERMISSION PREVIEW: {role}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                    Can manage:
                  </span>
                  {canList.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {cannotList.length > 0 && (
                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-2 sm:pt-0 sm:pl-3">
                    <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">
                      Cannot manage:
                    </span>
                    {cannotList.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-zinc-400">
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Phone (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="+1 (555) 019-2831"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Department (Optional)</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  placeholder="Cinematography / Post-Prod"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Profile Image URL (Optional)</label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase mb-1.5">Internal Notes (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="Audit notes or assigned soundstage location..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
              >
                {loading ? 'Processing...' : isEditing ? 'Save Profile Changes' : 'Create User Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
