import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Permission, Role } from '../../types';
import { hasPermission } from '../../permissions';
import { ShieldAlert, Loader2, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredRole?: Role;
  allowPasswordChangePage?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  allowPasswordChangePage = false,
}) => {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-300">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
        <p className="text-sm tracking-wider font-mono">VERIFYING STARGAZE CMS CREDENTIALS...</p>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to login
  if (!user) {
    window.location.href = '/admin/login';
    return null;
  }

  // 2. Account inactive
  if (profile && profile.status === 'INACTIVE') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-red-900/50 rounded-xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 border border-red-800/40">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account Deactivated</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Your CMS account ({profile.email}) is currently inactive. Please contact a Super Administrator to reactivate your access.
          </p>
          <button
            onClick={() => signOut().then(() => (window.location.href = '/admin/login'))}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // 3. Force Password Change check
  if (profile?.requiresPasswordChange && !allowPasswordChangePage) {
    window.location.href = '/admin/change-password';
    return null;
  }

  // 4. Role Guard
  if (requiredRole && profile?.role !== requiredRole && profile?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-amber-900/40 rounded-xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500 border border-amber-800/40">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Your role (<span className="text-amber-400 font-mono text-xs px-2 py-0.5 bg-zinc-800 rounded">{profile?.role}</span>) does not have authorization to access this specific module.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/admin"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg text-sm transition"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 5. Permission Guard
  if (requiredPermission && profile && !hasPermission(profile.role, requiredPermission)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-amber-900/40 rounded-xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500 border border-amber-800/40">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unauthorized Direct URL Access</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Permission <code className="text-amber-400 text-xs bg-zinc-800 px-1.5 py-0.5 rounded">{requiredPermission}</code> is required to view this section.
          </p>
          <a
            href="/admin"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg text-sm transition inline-block"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
