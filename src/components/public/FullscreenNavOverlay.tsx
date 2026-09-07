import React, { useState } from 'react';
import { X, ArrowRight, Sparkles, Film, Camera, Globe, Tv, Calendar, Newspaper, ExternalLink } from 'lucide-react';

interface FullscreenNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_PREVIEWS: Record<string, { image: string; tag: string; title: string; desc: string }> = {
  WORK: {
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    tag: 'CINEMA SLATE',
    title: 'ASTRA: BEYOND THE HORIZON',
    desc: 'IMAX 70mm Feature Co-Production & Visual Effects Suite',
  },
  CAPABILITIES: {
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    tag: 'PRODUCTION ECOSYSTEM',
    title: 'FULL-SERVICE FILMMAKING',
    desc: 'Development through 8K Post-Production & Dolby Atmos Mastering',
  },
  EQUIPMENT: {
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=1200&q=80',
    tag: 'CAMERA DEPARTMENT',
    title: 'ARRI ALEXA 35 & COOKE ANAMORPHICS',
    desc: 'State-of-the-art camera systems & optical rental infrastructure',
  },
  DISTRIBUTION: {
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    tag: 'GLOBAL CATALOGUE',
    title: 'INTERNATIONAL LICENSING',
    desc: 'Representing theatrical & streaming rights across 120+ territories',
  },
  EXPERIENCES: {
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    tag: 'ENTERTAINMENT & EVENTS',
    title: 'CANNES PREMIERE GALA',
    desc: 'Immersive festival showcases and live entertainment activations',
  },
  NEWSROOM: {
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    tag: 'PRESS & INSIGHTS',
    title: '$150M PRODUCTION ANNOUNCEMENT',
    desc: 'Latest company press releases and cinema technology reports',
  },
};

export const FullscreenNavOverlay: React.FC<FullscreenNavOverlayProps> = ({ isOpen, onClose }) => {
  const [activeNav, setActiveNav] = useState<string>('WORK');

  if (!isOpen) return null;

  const currentPreview = NAV_PREVIEWS[activeNav] || NAV_PREVIEWS.WORK;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0C]/95 backdrop-blur-2xl text-white flex flex-col justify-between overflow-hidden animate-fade-in">
      {/* Moving Ambient Light Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E5C158]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Header bar inside overlay */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E5C158] flex items-center justify-center text-black font-black">
            <Sparkles className="w-4 h-4 fill-black" />
          </div>
          <span className="text-lg font-black tracking-widest font-serif-cinematic">STARGAZE UNIVERSE</span>
        </div>

        <button
          onClick={onClose}
          data-cursor="VIEW"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#E5C158] bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-widest transition"
        >
          <span>CLOSE SCENE</span>
          <X className="w-4 h-4 text-[#E5C158]" />
        </button>
      </div>

      {/* Main Overlay Body: 2-Column Grid */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Navigation Column (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono text-[#E5C158] tracking-widest uppercase block mb-2">
            PRIMARY DIRECTORY
          </span>

          <nav className="space-y-2">
            {[
              { label: 'WORK', path: '/projects', sub: 'Films • Series • Documentaries • Campaigns' },
              { label: 'CAPABILITIES', path: '/capabilities', sub: 'Production • VFX • Sound • Post • PR' },
              { label: 'EQUIPMENT', path: '/equipment', sub: 'ARRI • Sony Venice • Cooke • Master Primes' },
              { label: 'DISTRIBUTION', path: '/distribution', sub: 'Global Licensing • Film Catalogue • Rights' },
              { label: 'EXPERIENCES', path: '/events', sub: 'Premieres • Festivals • Live Activations' },
              { label: 'NEWSROOM', path: '/news', sub: 'Press Releases • Industry Insights • Awards' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.path}
                onMouseEnter={() => setActiveNav(item.label)}
                data-cursor="VIEW"
                className="group block p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#E5C158]/30 transition duration-300"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl sm:text-5xl font-black font-serif-cinematic tracking-tight text-white/80 group-hover:text-[#E5C158] group-hover:translate-x-2 transition duration-300">
                    {item.label}
                  </span>
                  <ArrowRight className="w-6 h-6 text-[#E5C158] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-300" />
                </div>
                <p className="text-xs text-zinc-400 font-mono tracking-wider mt-1 opacity-80 group-hover:opacity-100">
                  {item.sub}
                </p>
              </a>
            ))}
          </nav>
        </div>

        {/* Dynamic Project Preview Frame (Right 5 Cols) */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#E5C158]/30 bg-zinc-900 shadow-2xl group">
            <img
              src={currentPreview.image}
              alt={currentPreview.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent" />

            <div className="absolute bottom-0 inset-x-0 p-8 space-y-3">
              <span className="inline-block px-3 py-1 rounded bg-[#E5C158]/90 text-black font-mono text-[10px] font-bold tracking-widest uppercase">
                {currentPreview.tag}
              </span>
              <h3 className="text-2xl font-bold font-serif-cinematic text-white leading-tight">
                {currentPreview.title}
              </h3>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {currentPreview.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Secondary Links inside Overlay */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6 text-zinc-400">
          <a href="/about" className="hover:text-[#E5C158] transition">ABOUT STARGAZE</a>
          <a href="/enquiry" className="hover:text-[#E5C158] transition">CONTACT & ENQUIRIES</a>
          <a href="/news" className="hover:text-[#E5C158] transition">PRESS KIT</a>
          <a href="/admin/login" className="hover:text-[#E5C158] transition flex items-center gap-1">
            CMS PORTAL <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <a
          href="/enquiry"
          className="px-6 py-3 rounded-xl bg-[#E5C158] hover:bg-[#F0CE68] text-black font-bold uppercase tracking-wider transition shadow-lg shadow-[#E5C158]/20 flex items-center gap-2"
        >
          START A PROJECT <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
