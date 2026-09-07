import React, { useState } from 'react';
import { Film, Sliders, Camera, Globe, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';

interface WorldItem {
  id: string;
  code: string;
  name: string;
  tagline: string;
  desc: string;
  imageUrl: string;
  icon: any;
  link: string;
  stats: string;
}

const STARGAZE_WORLDS: WorldItem[] = [
  {
    id: 'film',
    code: '01',
    name: 'FILM & SERIES',
    tagline: 'IMAX & THEATRICAL PRODUCTION',
    desc: 'Development, co-production, and full principal photography for feature films and original streaming series.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    icon: Film,
    link: '/projects',
    stats: '14 Features In Slate',
  },
  {
    id: 'post',
    code: '02',
    name: 'POST-PRODUCTION',
    tagline: 'VFX, COLOUR & DOLBY ATMOS',
    desc: 'State-of-the-art post suite for 8K grading, photorealistic visual effects, Foley, dubbing, and DCP mastering.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    icon: Sliders,
    link: '/capabilities',
    stats: '8K Dolby Vision Certified',
  },
  {
    id: 'gear',
    code: '03',
    name: 'CAMERA & GEAR',
    tagline: 'TECHNICAL DOP RENTAL DIVISION',
    desc: 'ARRI ALEXA 35, Sony Venice 2, Cooke Anamorphic glass, C-motion wireless focus, and LED Volume stages.',
    imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
    icon: Camera,
    link: '/equipment',
    stats: '250+ Cine Packages',
  },
  {
    id: 'distribution',
    code: '04',
    name: 'DISTRIBUTION',
    tagline: 'GLOBAL CATALOGUE & LICENSING',
    desc: 'Worldwide theatrical, SVOD, Pay TV, and international rights acquisition across 120+ territories.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    icon: Globe,
    link: '/distribution',
    stats: '120+ Global Territories',
  },
  {
    id: 'experiences',
    code: '05',
    name: 'EXPERIENCES',
    tagline: 'PREMIERES & FESTIVALS',
    desc: 'High-profile red carpet galas, film festival showcases, immersive fan experiences, and workshops.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles,
    link: '/events',
    stats: '40+ Annual Galas',
  },
  {
    id: 'growth',
    code: '06',
    name: 'MARKETING & PR',
    tagline: 'ENTERTAINMENT CAMPAIGNS',
    desc: 'Strategic film promotion, digital campaign execution, celebrity talent PR, and global box office drive.',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    icon: TrendingUp,
    link: '/enquiry',
    stats: '2.4B Global Reach',
  },
];

export const StargazeUniverse3D: React.FC = () => {
  const [activeWorld, setActiveWorld] = useState<WorldItem>(STARGAZE_WORLDS[0]);

  return (
    <div className="py-24 bg-[#0A0A0C] border-t border-white/5 relative overflow-hidden">
      {/* Moving Spatial Ambient Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial from-[#E5C158]/30 via-transparent to-transparent blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5C158]/10 border border-[#E5C158]/30 text-[#E5C158] font-mono text-xs tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-[#E5C158]" />
            SPATIAL DIRECTORY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic tracking-tight uppercase text-white">
            THE STARGAZE UNIVERSE
          </h2>
          <p className="text-zinc-400 font-sans text-sm sm:text-base leading-relaxed">
            Six interconnected cinema domains powering entertainment from script to global screens.
          </p>
        </div>

        {/* 6 Spatial Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STARGAZE_WORLDS.map((world) => {
            const Icon = world.icon;
            const isActive = activeWorld.id === world.id;

            return (
              <a
                key={world.id}
                href={world.link}
                onMouseEnter={() => setActiveWorld(world)}
                data-cursor="EXPLORE"
                className={`group relative rounded-2xl overflow-hidden p-6 transition-all duration-500 flex flex-col justify-between aspect-[4/5] border ${
                  isActive
                    ? 'border-[#E5C158] bg-zinc-900/90 shadow-[0_0_40px_rgba(229,193,88,0.2)] -translate-y-2'
                    : 'border-white/10 bg-zinc-950/80 hover:border-white/30 hover:-translate-y-1'
                }`}
              >
                {/* Background Frame Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={world.imageUrl}
                    alt={world.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isActive ? 'scale-110 opacity-40' : 'scale-100 opacity-20 group-hover:opacity-30'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/70 to-transparent" />
                </div>

                {/* Top Header inside Frame */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#E5C158] tracking-widest">
                    WORLD // {world.code}
                  </span>
                  <div className={`p-2.5 rounded-xl border transition ${
                    isActive ? 'bg-[#E5C158] text-black border-[#E5C158]' : 'bg-white/5 text-white border-white/10'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Content inside Frame */}
                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] font-mono text-[#E5C158] uppercase tracking-widest block">
                    {world.tagline}
                  </span>
                  <h3 className="text-2xl font-black font-serif-cinematic text-white group-hover:text-[#E5C158] transition">
                    {world.name}
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2">
                    {world.desc}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">{world.stats}</span>
                    <span className="text-[#E5C158] font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
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
