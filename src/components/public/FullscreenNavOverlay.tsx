import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { getMediaForSlot } from '../../lib/mediaResolver';
import { StargazeImage } from '../common/StargazeImage';

interface FullscreenNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavPreviewItem {
  image: string;
  focalPoint?: { x: number; y: number };
  tag: string;
  title: string;
  desc: string;
}

const DEFAULT_NAV_PREVIEWS: Record<string, NavPreviewItem> = {
  WORK: {
    image: '/uploads/Saheb_Vikaskari_-_1920x1080_1788768188845_6yh5ad.png',
    tag: 'CINEMA SLATE',
    title: 'SAHEB VIKAS KARI',
    desc: 'Political-social narrative feature presented by Satish Mohod, Orange City Production.',
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
    image: '/uploads/physco_1920x1080_1788768698932_os0fl1.png',
    tag: 'GLOBAL CATALOGUE',
    title: 'PSYCHO (SAMJO TO)',
    desc: 'Critically acclaimed short film distributed across global film festivals & OTT platforms.',
  },
  EXPERIENCES: {
    image: '/uploads/Father___Son_Duo_1600x500_1788768266576_25bj4l.png',
    tag: 'ENTERTAINMENT & EVENTS',
    title: 'FATHER & SON DUO LIVE',
    desc: 'Immersive live music concert & theatrical tour featuring Narayan Mohod & Satish Mohod.',
  },
  NEWSROOM: {
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    tag: 'PRESS & INSIGHTS',
    title: 'STUDIO ANNOUNCEMENT',
    desc: 'Latest company press releases and cinema technology reports',
  },
};

export const FullscreenNavOverlay: React.FC<FullscreenNavOverlayProps> = ({ isOpen, onClose }) => {
  const [activeNav, setActiveNav] = useState<string>('WORK');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [navPreviews, setNavPreviews] = useState<Record<string, NavPreviewItem>>(DEFAULT_NAV_PREVIEWS);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicMedia() {
      const [logoRes, workRes, distRes, expRes] = await Promise.all([
        getMediaForSlot('brand.logo'),
        getMediaForSlot('hero.sahebVikaskari.desktop'),
        getMediaForSlot('hero.psycho.desktop'),
        getMediaForSlot('events.fatherSon'),
      ]);

      if (!isMounted) return;

      if (logoRes.url) {
        setLogoUrl(logoRes.url);
      }

      setNavPreviews((prev) => ({
        ...prev,
        WORK: {
          ...prev.WORK,
          image: workRes.url || prev.WORK.image,
          focalPoint: workRes.focalPoint,
        },
        DISTRIBUTION: {
          ...prev.DISTRIBUTION,
          image: distRes.url || prev.DISTRIBUTION.image,
          focalPoint: distRes.focalPoint,
        },
        EXPERIENCES: {
          ...prev.EXPERIENCES,
          image: expRes.url || prev.EXPERIENCES.image,
          focalPoint: expRes.focalPoint,
        },
      }));
    }

    if (isOpen) {
      loadDynamicMedia();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPreview = navPreviews[activeNav] || navPreviews.WORK;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl text-zinc-900 flex flex-col justify-between overflow-hidden animate-fade-in">
      {/* Moving Ambient Light Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[150px]" />
      </div>

      {/* Header bar inside overlay */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-200">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Stargaze Media"
              className="h-10 w-auto max-w-[140px] object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center text-white font-black">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
          )}
          <span className="text-lg font-black tracking-widest font-serif-cinematic text-zinc-900">STARGAZE UNIVERSE</span>
        </div>

        <button
          onClick={onClose}
          data-cursor="VIEW"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-300 hover:border-[#D97706] bg-zinc-100 hover:bg-zinc-200 text-xs font-mono uppercase tracking-widest text-zinc-800 transition"
        >
          <span>CLOSE SCENE</span>
          <X className="w-4 h-4 text-[#D97706]" />
        </button>
      </div>

      {/* Main Overlay Body: 2-Column Grid */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Navigation Column (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono text-[#B45309] font-bold tracking-widest uppercase block mb-2">
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
                className="group block p-3 rounded-xl hover:bg-zinc-100 border border-transparent hover:border-[#D97706]/40 transition duration-300"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl sm:text-5xl font-black font-serif-cinematic tracking-tight text-zinc-800 group-hover:text-[#D97706] group-hover:translate-x-2 transition duration-300">
                    {item.label}
                  </span>
                  <ArrowRight className="w-6 h-6 text-[#D97706] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition duration-300" />
                </div>
                <p className="text-xs text-zinc-500 font-mono tracking-wider mt-1 opacity-90 group-hover:opacity-100">
                  {item.sub}
                </p>
              </a>
            ))}
          </nav>
        </div>

        {/* Dynamic Project Preview Frame (Right 5 Cols) */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-xl group">
            <StargazeImage
              src={currentPreview.image}
              alt={currentPreview.title}
              focalPoint={currentPreview.focalPoint}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 inset-x-0 p-8 space-y-3">
              <span className="inline-block px-3 py-1 rounded bg-[#D97706] text-white font-mono text-[10px] font-bold tracking-widest uppercase shadow-sm">
                {currentPreview.tag}
              </span>
              <h3 className="text-2xl font-bold font-serif-cinematic text-white leading-tight">
                {currentPreview.title}
              </h3>
              <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                {currentPreview.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Secondary Links inside Overlay */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6 text-zinc-600 font-semibold">
          <a href="/about" className="hover:text-[#D97706] transition">ABOUT STARGAZE</a>
          <a href="/enquiry" className="hover:text-[#D97706] transition">CONTACT & ENQUIRIES</a>
          <a href="/news" className="hover:text-[#D97706] transition">PRESS KIT</a>
          <a href="/admin/login" className="hover:text-[#D97706] transition flex items-center gap-1">
            CMS PORTAL <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <a
          href="/enquiry"
          className="px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold uppercase tracking-wider transition shadow-md shadow-amber-600/20 flex items-center gap-2"
        >
          START A PROJECT <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
