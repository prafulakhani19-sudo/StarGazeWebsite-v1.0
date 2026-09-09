import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { INITIAL_EVENTS } from '../../data/mockData';
import { EventItem } from '../../types';
import { resolveEventMedia } from '../../lib/mediaResolver';
import { getEvents } from '../../lib/cmsService';
import { Calendar } from 'lucide-react';
import { StargazeImage } from '../../components/common/StargazeImage';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const cmsData = await getEvents();
        const base = cmsData && cmsData.length > 0 ? cmsData : INITIAL_EVENTS;
        const resolved = await Promise.all(base.map(resolveEventMedia));
        if (isMounted) setEvents(resolved);
      } catch (err) {
        console.warn('Error loading events, using defaults:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED');

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#D97706] selection:text-white">
      <PublicHeader />
      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-zinc-200 pb-8">
          <div className="inline-flex items-center gap-2 text-[#B45309] font-mono text-xs font-bold tracking-widest uppercase mb-2">
            <Calendar className="w-4 h-4 text-[#D97706]" /> EXPERIENCES & PREMIERES
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase font-serif-cinematic text-zinc-900">EVENTS & EXHIBITIONS</h1>
          <p className="text-zinc-600 text-sm mt-2 max-w-2xl">
            Red-carpet premieres, international film festival showcases, and technical masterclasses.
          </p>
        </div>

        <div className="space-y-8">
          {publishedEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#F8F9FA] border border-zinc-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center hover:border-amber-400 hover:shadow-lg transition"
            >
              <div className="w-full md:w-1/3 aspect-[16/9] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                <StargazeImage src={evt.imageUrl} alt={evt.title} focalPoint={evt.focalPoint} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 flex-1">
                <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest">{evt.category} • {evt.location}</span>
                <h3 className="text-2xl font-bold font-serif-cinematic text-zinc-900">{evt.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{evt.description}</p>
                <div className="text-xs font-mono text-zinc-500 font-medium">Date: <span className="text-zinc-800">{evt.eventDate}</span></div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
