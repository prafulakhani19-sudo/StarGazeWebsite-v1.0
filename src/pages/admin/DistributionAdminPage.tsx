import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { INITIAL_DISTRIBUTION } from '../../data/mockData';
import { Globe, Plus } from 'lucide-react';

export const DistributionAdminPage: React.FC = () => {
  const [distribution, setDistribution] = useState(INITIAL_DISTRIBUTION);

  return (
    <ProtectedRoute requiredPermission="distribution.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Globe className="w-4 h-4" /> GLOBAL LICENSING
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">DISTRIBUTION CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage film titles, territory availability, and licensing rights.</p>
            </div>

            <button className="px-4 py-2 bg-amber-500 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Title
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {distribution.map((item) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex gap-4">
                <div className="w-24 aspect-[3/4] rounded-lg overflow-hidden bg-zinc-950 shrink-0">
                  <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase">{item.type}</span>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{item.synopsis}</p>
                  <div className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-800">
                    Territories: <span className="text-amber-400">{item.territories.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
