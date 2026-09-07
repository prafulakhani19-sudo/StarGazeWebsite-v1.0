import React, { useState } from 'react';
import { Film, Sparkles } from 'lucide-react';

interface StargazeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  category?: string;
}

export const StargazeImage: React.FC<StargazeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
  category = 'STARGAZE MEDIA',
}) => {
  const [hasError, setHasError] = useState(false);

  // If no src or previously failed to load
  if (!src || hasError) {
    return (
      <div className={`relative bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-white/10 flex flex-col items-center justify-center p-6 text-center overflow-hidden ${className}`}>
        {/* Cinematic ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#E5C158]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

        <div className="relative z-10 space-y-3 max-w-xs">
          <div className="w-12 h-12 rounded-full bg-[#E5C158]/15 border border-[#E5C158]/40 flex items-center justify-center mx-auto text-[#E5C158] shadow-lg shadow-[#E5C158]/20">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#E5C158] uppercase tracking-widest block mb-1">
              {category}
            </span>
            <h4 className="text-sm sm:text-base font-bold font-serif-cinematic text-white uppercase line-clamp-2">
              {fallbackTitle || alt || 'Cinematic Asset'}
            </h4>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-mono text-[9px] tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-[#E5C158]" /> Verified Production Archive
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};
