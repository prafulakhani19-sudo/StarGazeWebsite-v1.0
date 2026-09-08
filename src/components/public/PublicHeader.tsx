import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, ShieldCheck, ArrowUpRight, Film } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FullscreenNavOverlay } from './FullscreenNavOverlay';
import { getMediaForSlot } from '../../lib/mediaResolver';

export const PublicHeader: React.FC = () => {
  const [navOverlayOpen, setNavOverlayOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoAlt, setLogoAlt] = useState<string>('Stargaze Media & Entertainment');
  const [logoError, setLogoError] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    getMediaForSlot('brand.logo').then((res) => {
      if (isMounted && res.url) {
        setLogoUrl(res.url);
        if (res.alt) setLogoAlt(res.alt);
        setLogoError(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#08080A]/85 backdrop-blur-2xl border-b border-white/[0.08] transition duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Avant-Garde typography */}
            <a href="/" className="flex items-center gap-3.5 group" data-cursor="VIEW">
              <div className="relative h-11 w-11 rounded-xl bg-zinc-950 border border-[#FFB800]/30 flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#FFB800]/10 group-hover:border-[#FFB800] group-hover:scale-105 transition-all duration-300 overflow-hidden p-1">
                {logoUrl && !logoError ? (
                  <img
                    src={logoUrl}
                    alt={logoAlt}
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#FFB800] via-amber-300 to-[#FF5500] flex items-center justify-center rounded-lg">
                    <Sparkles className="w-5 h-5 fill-black text-black" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-[0.18em] text-white block uppercase font-grotesk group-hover:text-[#FFB800] transition duration-300">
                    STARGAZE
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-ping" />
                </div>
                <span className="text-[9px] tracking-[0.28em] text-zinc-400 block uppercase font-mono-studio">
                  STUDIO & PRODUCTION
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links - Modern Editorial Track */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-mono-studio font-bold tracking-[0.2em] text-zinc-300">
              <a href="/projects" className="hover:text-[#FFB800] transition-colors py-1 relative group" data-cursor="VIEW">
                [ 01 // WORK ]
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFB800] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/capabilities" className="hover:text-[#FFB800] transition-colors py-1 relative group" data-cursor="VIEW">
                [ 02 // CAPABILITIES ]
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFB800] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/equipment" className="hover:text-[#FFB800] transition-colors py-1 relative group" data-cursor="VIEW">
                [ 03 // OPTICS & GEAR ]
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFB800] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/distribution" className="hover:text-[#FFB800] transition-colors py-1 relative group" data-cursor="VIEW">
                [ 04 // SYNDICATION ]
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFB800] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/events" className="hover:text-[#FFB800] transition-colors py-1 relative group" data-cursor="VIEW">
                [ 05 // LIVE ]
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFB800] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/news" className="hover:text-[#FFB800] transition-colors py-1 relative group" data-cursor="VIEW">
                [ 06 // JOURNAL ]
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFB800] group-hover:w-full transition-all duration-300" />
              </a>
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-3.5">
              {/* Fullscreen Overlay Trigger Button */}
              <button
                onClick={() => setNavOverlayOpen(true)}
                data-cursor="VIEW"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono-studio text-white tracking-widest uppercase transition-all duration-300 hover:border-[#FFB800]/40"
              >
                <Menu className="w-4 h-4 text-[#FFB800]" />
                <span className="hidden sm:inline font-bold">INDEX</span>
              </button>

              {/* Primary CTA with high-energy Avant-Garde pill styling */}
              <a
                href="/enquiry"
                data-cursor="ENQUIRE"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FFB800] text-black font-extrabold text-xs font-mono-studio tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#FFB800]/25 hover:scale-[1.02]"
              >
                COMMISSION PROJECT <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              {/* CMS Admin Link */}
              {user ? (
                <a
                  href="/admin"
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-[#FFB800] hover:text-white transition"
                  title={`CMS Admin (${profile?.role || 'Admin'})`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Cinematic Overlay Menu */}
      <FullscreenNavOverlay
        isOpen={navOverlayOpen}
        onClose={() => setNavOverlayOpen(false)}
      />
    </>
  );
};


