import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { UserModal } from '../../components/admin/UserModal';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { useAuth } from '../../context/AuthContext';
import { Role, UserProfile, UserStatus } from '../../types';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  KeyRound,
  Edit3,
  UserX,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowUpDown,
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { getIdToken, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'displayName' | 'role' | 'lastLoginAt' | 'createdAt'>('displayName');
  const [sortAsc, setSortAsc] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    confirmText?: string;
    danger?: boolean;
    roleChange?: { currentRole: string; newRole: string };
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: async () => {},
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) throw new Error('Authentication token unavailable.');

      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch users list.');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      console.warn('API list failed, falling back to Firestore query:', err);
      try {
        const querySnap = await getDocs(collection(db, 'users'));
        const userList = querySnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as UserProfile[];
        setUsers(userList);
      } catch (fsErr: any) {
        setError(fsErr.message || 'Failed to load user accounts.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateOrEditUser = async (formData: Partial<UserProfile>) => {
    const token = await getIdToken();
    if (!token) throw new Error('Authentication token missing');

    if (userToEdit) {
      // Edit User
      const response = await fetch(`/api/admin/users/${userToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update user profile.');

      setSuccessMsg(`User profile for ${userToEdit.email} updated.`);
      await fetchUsers();
      return resData;
    } else {
      // Create User
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to create user account.');

      setSuccessMsg(`Account created for ${formData.email}.`);
      await fetchUsers();
      return resData;
    }
  };

  // Toggle Activate / Deactivate
  const handleToggleStatus = (targetUser: UserProfile) => {
    const newStatus: UserStatus = targetUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const isDeactivating = newStatus === 'INACTIVE';

    setConfirmModal({
      isOpen: true,
      title: isDeactivating ? 'Deactivate User Account' : 'Reactivate User Account',
      description: isDeactivating
        ? `This user (${targetUser.email}) will immediately lose CMS access.`
        : `Reactivate CMS access for ${targetUser.email}.`,
      confirmText: isDeactivating ? 'Confirm Deactivation' : 'Reactivate User',
      danger: isDeactivating,
      action: async () => {
        setActionLoading(true);
        try {
          const token = await getIdToken();
          const res = await fetch(`/api/admin/users/${targetUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          setSuccessMsg(`Status updated for ${targetUser.email}.`);
          await fetchUsers();
        } catch (err: any) {
          setError(err.message || 'Action failed');
        } finally {
          setActionLoading(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Trigger Reset Password Flow
  const handleResetPassword = (targetUser: UserProfile) => {
    setConfirmModal({
      isOpen: true,
      title: 'Initiate Password Reset',
      description: `Generate a secure password reset link for ${targetUser.email}. The user will be required to change their password on next login.`,
      confirmText: 'Generate Reset Link',
      action: async () => {
        setActionLoading(true);
        try {
          const token = await getIdToken();
          const res = await fetch(`/api/admin/users/${targetUser.id}/reset-password`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          setSuccessMsg(`Password reset link generated for ${targetUser.email}.`);
          await fetchUsers();
        } catch (err: any) {
          setError(err.message || 'Failed to reset password.');
        } finally {
          setActionLoading(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Filter & Sort Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Shield className="w-4 h-4" /> SUPER ADMIN CONTROL PANEL
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">
                USER MANAGEMENT SYSTEM
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage internal studio accounts, assign role permissions, handle account status, and track last login activity.
              </p>
            </div>

            <button
              onClick={() => {
                setUserToEdit(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" /> CREATE USER
            </button>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800/60 rounded-xl p-4 flex items-center justify-between text-red-300 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 font-bold">
                Dismiss
              </button>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-xl p-4 flex items-center justify-between text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 font-bold">
                Dismiss
              </button>
            </div>
          )}

          {/* Search, Filter, & Sort Controls */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, department..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-zinc-400 uppercase">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-white focus:outline-none"
                >
                  <option value="ALL">ALL ROLES</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="CONTENT_ADMIN">CONTENT_ADMIN</option>
                  <option value="EDITOR">EDITOR</option>
                  <option value="EQUIPMENT_MANAGER">EQUIPMENT_MANAGER</option>
                  <option value="EVENT_MANAGER">EVENT_MANAGER</option>
                  <option value="MARKETING_MANAGER">MARKETING_MANAGER</option>
                  <option value="DISTRIBUTION_MANAGER">DISTRIBUTION_MANAGER</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5">
                <span className="text-zinc-400 uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-white focus:outline-none"
                >
                  <option value="ALL">ALL STATUS</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-4 px-6 cursor-pointer" onClick={() => { setSortBy('displayName'); setSortAsc(!sortAsc); }}>
                      <div className="flex items-center gap-1">User Name & Info <ArrowUpDown className="w-3 h-3 text-amber-500" /></div>
                    </th>
                    <th className="py-4 px-4">Email Address</th>
                    <th className="py-4 px-4 cursor-pointer" onClick={() => { setSortBy('role'); setSortAsc(!sortAsc); }}>
                      <div className="flex items-center gap-1">Assigned Role <ArrowUpDown className="w-3 h-3 text-amber-500" /></div>
                    </th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 cursor-pointer" onClick={() => { setSortBy('lastLoginAt'); setSortAsc(!sortAsc); }}>
                      <div className="flex items-center gap-1">Last Login <ArrowUpDown className="w-3 h-3 text-amber-500" /></div>
                    </th>
                    <th className="py-4 px-4 cursor-pointer" onClick={() => { setSortBy('createdAt'); setSortAsc(!sortAsc); }}>
                      <div className="flex items-center gap-1">Created Date <ArrowUpDown className="w-3 h-3 text-amber-500" /></div>
                    </th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-sans">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-zinc-500 font-mono">
                        Loading studio user credentials...
                      </td>
                    </tr>
                  ) : sortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-zinc-500 font-mono">
                        No user accounts match search criteria.
                      </td>
                    </tr>
                  ) : (
                    sortedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-800/40 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs uppercase shrink-0 overflow-hidden">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt={u.displayName} className="w-full h-full object-cover" />
                              ) : (
                                u.displayName?.slice(0, 2).toUpperCase() || 'US'
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{u.displayName}</span>
                              {u.department && (
                                <span className="text-[10px] text-zinc-500 font-mono block">
                                  {u.department}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-zinc-300 font-mono text-xs">{u.email}</td>

                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 font-mono text-[10px] font-bold text-amber-400">
                            {u.role}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] font-bold ${
                              u.status === 'ACTIVE'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                                : 'bg-red-950/80 text-red-400 border border-red-800/50'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'
                              }`}
                            />
                            {u.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-mono text-[11px] text-zinc-400">
                          {u.lastLoginAt
                            ? new Date(u.lastLoginAt).toLocaleDateString() +
                              ' ' +
                              new Date(u.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Never'}
                        </td>

                        <td className="py-4 px-4 font-mono text-[11px] text-zinc-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Initial Bootstrap'}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setUserToEdit(u);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                              title="Edit User & Role"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleResetPassword(u)}
                              className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition"
                              title="Trigger Password Reset Link"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`p-1.5 rounded-lg transition ${
                                u.status === 'ACTIVE'
                                  ? 'text-zinc-400 hover:text-red-400 hover:bg-zinc-800'
                                  : 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800'
                              }`}
                              title={u.status === 'ACTIVE' ? 'Deactivate User Access' : 'Reactivate User Access'}
                            >
                              {u.status === 'ACTIVE' ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Components */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateOrEditUser}
          userToEdit={userToEdit}
        />

        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.action}
          title={confirmModal.title}
          description={confirmModal.description}
          confirmText={confirmModal.confirmText}
          danger={confirmModal.danger}
          loading={actionLoading}
          roleChange={confirmModal.roleChange}
        />
      </AdminLayout>
    </ProtectedRoute>
  );
};
