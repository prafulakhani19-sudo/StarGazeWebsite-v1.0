import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { INITIAL_DISTRIBUTION } from '../../data/mockData';
import { DistributionTitle } from '../../types';
import { resolveDistributionMedia } from '../../lib/mediaResolver';
import { getDistribution } from '../../lib/cmsService';
import { Globe } from 'lucide-react';
import { StargazeImage } from '../../components/common/StargazeImage';

export const DistributionPage: React.FC = () => {
  const [distribution, setDistribution] = useState<DistributionTitle[]>(INITIAL_DISTRIBUTION);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const cmsData = await getDistribution();
        const base = cmsData && cmsData.length > 0 ? cmsData : INITIAL_DISTRIBUTION;
        const resolved = await Promise.all(base.map(resolveDistributionMedia));
        if (isMounted) setDistribution(resolved);
      } catch (err) {
        console.warn('Error loading distribution, using defaults:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const publishedDistribution = distribution.filter((d) => d.status === 'PUBLISHED');

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PublicHeader />
      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-zinc-900 pb-8">
          <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-2">
            <Globe className="w-4 h-4" /> GLOBAL LICENSING & RIGHTS
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase font-mono">DISTRIBUTION CATALOG</h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
            Available film titles, series, and documentary features for international theatrical, SVOD, and broadcast acquisition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedDistribution.map((item) => (
            <div key={item.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex gap-6">
              <div className="w-32 aspect-[3/4] rounded-lg overflow-hidden shrink-0 bg-zinc-950">
                <StargazeImage src={item.posterUrl} alt={item.title} focalPoint={item.focalPoint} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 flex-1">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">{item.type}</span>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.synopsis}</p>
                <div className="space-y-1 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                  <div>Territories: <span className="text-amber-400">{item.territories.join(', ')}</span></div>
                  <div>Rights: <span className="text-zinc-300">{item.rightsAvailable.join(', ')}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
