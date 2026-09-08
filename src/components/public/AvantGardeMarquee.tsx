import React from 'react';
import { Sparkles, Film, Award, Clapperboard, Globe2, Flame, Camera } from 'lucide-react';

export const AvantGardeMarquee: React.FC = () => {
  const marqueeItems = [
    { icon: Sparkles, label: 'WE CREATE WHAT THE WORLD WATCHES' },
    { icon: Film, label: 'IMAX & 8K RED HELIUM CERTIFIED' },
    { icon: Award, label: 'OFFICIAL SELECTION // CANNES & DPIFF 2026' },
    { icon: Clapperboard, label: '4 SOUND STAGES & DA VINCI HDR SUITES' },
    { icon: Globe2, label: 'GLOBAL THEATRICAL & OTT SYNDICATION' },
    { icon: Flame, label: 'ORIGINAL MOTION PICTURE PRODUCTIONS' },
    { icon: Camera, label: 'COOKE ANAMORPHIC / ARRI ALEXA 35 VAULT' },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-black border-y border-white/10 py-3.5 select-none z-20">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#08080A] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#08080A] to-transparent z-10 pointer-events-none" />
      
      <div className="animate-studio-marquee flex items-center gap-10">
        {[...marqueeItems, ...marqueeItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-4 group cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
              <span className="text-xs sm:text-sm font-grotesk font-extrabold tracking-[0.25em] text-white/90 group-hover:text-[#FFB800] transition duration-300 uppercase whitespace-nowrap">
                {item.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-[#FFB800]/70 group-hover:text-[#FFB800] group-hover:scale-110 transition duration-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
