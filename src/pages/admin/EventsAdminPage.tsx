import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { INITIAL_EVENTS } from '../../data/mockData';
import { Calendar, Plus } from 'lucide-react';

export const EventsAdminPage: React.FC = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  return (
    <ProtectedRoute requiredPermission="events.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Calendar className="w-4 h-4" /> EXPERIENCES
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">EVENTS & PREMIERES CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage film festival showcases, red-carpet galas, and exhibitions.</p>
            </div>

            <button className="px-4 py-2 bg-amber-500 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>

          <div className="space-y-4">
            {events.map((evt) => (
              <div key={evt.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full sm:w-48 aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950 shrink-0">
                  <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase">{evt.category} • {evt.location}</span>
                  <h3 className="text-lg font-bold text-white">{evt.title}</h3>
                  <p className="text-xs text-zinc-400">{evt.description}</p>
                  <div className="text-[10px] font-mono text-zinc-500">Date: {evt.eventDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
