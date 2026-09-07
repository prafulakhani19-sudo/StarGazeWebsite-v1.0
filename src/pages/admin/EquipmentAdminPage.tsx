import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { INITIAL_EQUIPMENT } from '../../data/mockData';
import { Camera, Plus, Edit3, Eye } from 'lucide-react';

export const EquipmentAdminPage: React.FC = () => {
  const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT);

  return (
    <ProtectedRoute requiredPermission="equipment.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Camera className="w-4 h-4" /> HARDWARE & RENTALS
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">EQUIPMENT CATALOG CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage cameras, anamorphic lenses, DOP rigs, rates, and rental availability.</p>
            </div>

            <button className="px-4 py-2 bg-amber-500 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Equipment Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipment.map((item) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-950">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-mono text-amber-400 uppercase block">{item.category}</span>
                <h3 className="text-sm font-bold text-white">{item.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.specs}</p>
                <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-xs font-mono">
                  <span className="text-amber-400 font-bold">${item.dailyRate}/day</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800">{item.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
