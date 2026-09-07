import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { INITIAL_NEWS } from '../../data/mockData';
import { Newspaper, Plus } from 'lucide-react';

export const NewsAdminPage: React.FC = () => {
  const [news, setNews] = useState(INITIAL_NEWS);

  return (
    <ProtectedRoute requiredPermission="news.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Newspaper className="w-4 h-4" /> PRESS OFFICE
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">NEWSROOM CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage press releases, studio announcements, and marketing articles.</p>
            </div>

            <button className="px-4 py-2 bg-amber-500 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((art) => (
              <div key={art.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950">
                  <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">{art.category} • {art.publishDate}</span>
                <h3 className="text-base font-bold text-white">{art.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{art.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
