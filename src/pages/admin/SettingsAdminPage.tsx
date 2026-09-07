import React from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Sliders, Shield } from 'lucide-react';

export const SettingsAdminPage: React.FC = () => {
  return (
    <ProtectedRoute requiredPermission="settings.view">
      <AdminLayout>
        <div className="space-y-6 font-sans max-w-4xl">
          <div className="border-b border-zinc-900 pb-6">
            <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
              <Sliders className="w-4 h-4" /> SYSTEM CONFIGURATION
            </div>
            <h1 className="text-3xl font-extrabold text-white uppercase font-mono">SITE & SECURITY SETTINGS</h1>
            <p className="text-xs text-zinc-400 mt-1">Configure global studio metadata, SEO defaults, and Firebase security parameters.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" /> FIREBASE AUTHENTICATION & RULES
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Firestore Security Rules are deployed and active. Unauthenticated write operations are strictly rejected, and custom user claims enforce role hierarchy.
            </p>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono space-y-2 text-zinc-300">
              <div>Project ID: <span className="text-amber-400">gen-lang-client-0743504908</span></div>
              <div>Database ID: <span className="text-amber-400">ai-studio-stargazemedia-e17acc3d-69b6-482b-b0c3-4c2600378656</span></div>
              <div>Bootstrap Super Admin: <span className="text-amber-400">praful.akhani19@gmail.com</span></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
