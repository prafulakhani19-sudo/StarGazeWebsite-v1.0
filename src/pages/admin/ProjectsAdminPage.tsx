import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { INITIAL_PROJECTS } from '../../data/mockData';
import { Film, Plus, Edit3, Trash2, Eye } from 'lucide-react';

export const ProjectsAdminPage: React.FC = () => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  return (
    <ProtectedRoute requiredPermission="projects.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Film className="w-4 h-4" /> CONTENT MANAGEMENT
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">FEATURE FILM SLATE</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage film projects, IMAX sci-fi features, and publishing statuses.</p>
            </div>

            <button className="px-4 py-2 bg-amber-500 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add New Film Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-5 space-y-4">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950">
                  <img src={proj.posterUrl} alt={proj.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase">{proj.genre}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800">
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{proj.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{proj.synopsis}</p>
                </div>
                <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span>Director: {proj.director}</span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:text-white"><Eye className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-white"><Edit3 className="w-4 h-4" /></button>
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
