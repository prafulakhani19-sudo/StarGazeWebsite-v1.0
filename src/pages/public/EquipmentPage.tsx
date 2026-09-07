import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { INITIAL_EQUIPMENT } from '../../data/mockData';
import { EquipmentItem } from '../../types';
import { resolveEquipmentMedia } from '../../lib/mediaResolver';
import { getEquipment } from '../../lib/cmsService';
import { Camera } from 'lucide-react';
import { StargazeImage } from '../../components/common/StargazeImage';

export const EquipmentPage: React.FC = () => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const cmsData = await getEquipment();
        const base = cmsData && cmsData.length > 0 ? cmsData : INITIAL_EQUIPMENT;
        const resolved = await Promise.all(base.map(resolveEquipmentMedia));
        if (isMounted) setEquipment(resolved);
      } catch (err) {
        console.warn('Error loading equipment, using defaults:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const publishedEquipment = equipment.filter((e) => e.status === 'PUBLISHED');

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PublicHeader />
      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-zinc-900 pb-8">
          <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-2">
            <Camera className="w-4 h-4" /> HARDWARE & PRODUCTION GEAR
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase font-mono">EQUIPMENT RENTAL CATALOG</h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
            Industry-standard camera packages, anamorphic lens sets, DOP rigs, and lighting rentals available for studio booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedEquipment.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-amber-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-zinc-950">
                  <StargazeImage src={item.imageUrl} alt={item.name} focalPoint={item.focalPoint} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-500 block mb-1">{item.category}</span>
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{item.specs}</p>
              </div>
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between font-mono text-xs">
                <span className="text-amber-400 font-bold text-sm">${item.dailyRate} / day</span>
                <a
                  href="/enquiry"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg uppercase text-[10px]"
                >
                  Book Equipment
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
