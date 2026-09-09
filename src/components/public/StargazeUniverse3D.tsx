import React, { useState, useEffect } from 'react';
import { 
  Film, Sliders, Camera, Globe, Sparkles, TrendingUp, 
  ArrowUpRight, Clapperboard, Award, Layers, Tv, Video 
} from 'lucide-react';
import { StargazeWorldItem, UniverseSectionConfig } from '../../types';
import { INITIAL_STARGAZE_WORLDS } from '../../data/initialCmsData';
import { getSiteContent } from '../../lib/cmsService';
import { StargazeImage } from '../common/StargazeImage';

const ICON_MAP: Record<string, React.ElementType> = {
  Film,
  Sliders,
  Camera,
  Globe,
  Sparkles,
  TrendingUp,
  Clapperboard,
  Award,
  Layers,
  Tv,
  Video,
};

interface StargazeUniverse3DProps {
  initialConfig?: UniverseSectionConfig;
}

export const StargazeUniverse3D: React.FC<StargazeUniverse3DProps> = ({ initialConfig }) => {
  const [universeConfig, setUniverseConfig] = useState<UniverseSectionConfig>(
    initialConfig || {
      eyebrow: 'SPATIAL DIRECTORY',
      heading: 'THE STARGAZE UNIVERSE',
      description: 'Six interconnected cinema domains powering entertainment from script to global screens.',
      worlds: INITIAL_STARGAZE_WORLDS,
    }
  );
  const [activeWorldId, setActiveWorldId] = useState<string>(
    universeConfig.worlds?.[0]?.id || 'film'
  );

  useEffect(() => {
    let isMounted = true;
    async function loadUniverse() {
      try {
        const siteData = await getSiteContent();
        if (isMounted && siteData?.universeSection?.worlds && siteData.universeSection.worlds.length > 0) {
          setUniverseConfig(siteData.universeSection);
          if (siteData.universeSection.worlds[0]) {
            setActiveWorldId(siteData.universeSection.worlds[0].id);
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic universe CMS data, using initial:', err);
      }
    }

    if (!initialConfig) {
      loadUniverse();
    }
    return () => {
      isMounted = false;
    };
  }, [initialConfig]);

  const worlds = universeConfig.worlds && universeConfig.worlds.length > 0 
    ? universeConfig.worlds.filter((w) => w.status !== 'DRAFT')
    : INITIAL_STARGAZE_WORLDS;

  return (
    <div className="py-24 bg-white border-t border-zinc-200/80 relative overflow-hidden">
      {/* Moving Spatial Ambient Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial from-amber-200/40 via-transparent to-transparent blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#B45309] font-mono text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
            {universeConfig.eyebrow || 'SPATIAL DIRECTORY'}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic tracking-tight uppercase text-zinc-900">
            {universeConfig.heading || 'THE STARGAZE UNIVERSE'}
          </h2>
          <p className="text-zinc-600 font-sans text-sm sm:text-base leading-relaxed">
            {universeConfig.description || 'Six interconnected cinema domains powering entertainment from script to global screens.'}
          </p>
        </div>

        {/* Spatial Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {worlds.map((world, idx) => {
            const IconComponent = (world.iconName && ICON_MAP[world.iconName]) || ICON_MAP['Sparkles'] || Film;
            const isActive = activeWorldId === world.id || (idx === 0 && !activeWorldId);

            return (
              <a
                key={world.id || idx}
                href={world.link || '#'}
                onMouseEnter={() => setActiveWorldId(world.id)}
                data-cursor="EXPLORE"
                className={`group relative rounded-2xl overflow-hidden p-6 transition-all duration-500 flex flex-col justify-between aspect-[4/5] border ${
                  isActive
                    ? 'border-[#D97706] bg-zinc-950 shadow-2xl shadow-amber-500/20 -translate-y-2'
                    : 'border-zinc-200/80 bg-zinc-950 hover:border-amber-500/50 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Background Frame Image - Vibrant with minimal bottom gradient for text contrast */}
                <div className="absolute inset-0 overflow-hidden bg-zinc-950">
                  {world.imageUrl ? (
                    <StargazeImage
                      src={world.imageUrl}
                      alt={world.name}
                      focalPoint={world.focalPoint}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isActive ? 'scale-110 opacity-90' : 'scale-100 opacity-80 group-hover:opacity-100'
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900" />
                  )}
                  {/* Minimal subtle gradient to preserve clear readability of text over imagery */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                </div>

                {/* Top Header inside Frame */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 tracking-widest px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                    WORLD // {world.code || `0${idx + 1}`}
                  </span>
                  <div className={`p-2.5 rounded-xl border backdrop-blur-md transition ${
                    isActive ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm' : 'bg-black/50 text-white border-white/15 group-hover:bg-[#D97706] group-hover:border-[#D97706]'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Content inside Frame */}
                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                    {world.tagline}
                  </span>
                  <h3 className="text-2xl font-black font-serif-cinematic text-white group-hover:text-amber-400 transition">
                    {world.name}
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2">
                    {world.desc}
                  </p>

                  <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">{world.stats}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                      ENTER WORLD <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
