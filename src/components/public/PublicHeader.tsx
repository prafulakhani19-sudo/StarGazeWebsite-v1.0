import React, { useState } from 'react';
import { Sparkles, Menu, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FullscreenNavOverlay } from './FullscreenNavOverlay';

export const PublicHeader: React.FC = () => {
  const [navOverlayOpen, setNavOverlayOpen] = useState(false);
  const { user, profile } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0C]/80 backdrop-blur-xl border-b border-white/5 transition duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3.5 group" data-cursor="VIEW">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E5C158] to-amber-200 flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#E5C158]/20 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5 fill-black text-black" />
              </div>
              <div>
                <span className="text-xl font-black tracking-[0.2em] text-white block uppercase font-serif-cinematic">
                  STARGAZE
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#E5C158] block uppercase font-mono">
                  MEDIA & ENTERTAINMENT
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-mono font-bold tracking-widest text-zinc-300">
              <a href="/projects" className="hover:text-[#E5C158] transition py-1 relative group" data-cursor="VIEW">
                WORK
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E5C158] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/capabilities" className="hover:text-[#E5C158] transition py-1 relative group" data-cursor="VIEW">
                CAPABILITIES
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E5C158] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/equipment" className="hover:text-[#E5C158] transition py-1 relative group" data-cursor="VIEW">
                EQUIPMENT
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E5C158] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/distribution" className="hover:text-[#E5C158] transition py-1 relative group" data-cursor="VIEW">
                DISTRIBUTION
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E5C158] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/events" className="hover:text-[#E5C158] transition py-1 relative group" data-cursor="VIEW">
                EXPERIENCES
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E5C158] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/news" className="hover:text-[#E5C158] transition py-1 relative group" data-cursor="VIEW">
                NEWSROOM
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E5C158] group-hover:w-full transition-all duration-300" />
              </a>
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-4">
              {/* Fullscreen Overlay Trigger Button */}
              <button
                onClick={() => setNavOverlayOpen(true)}
                data-cursor="VIEW"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white tracking-widest uppercase transition"
              >
                <Menu className="w-4 h-4 text-[#E5C158]" />
                <span className="hidden sm:inline">EXPLORE SCENES</span>
              </button>

              {/* Primary CTA */}
              <a
                href="/enquiry"
                data-cursor="ENQUIRE"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5C158] hover:bg-[#F0CE68] text-black font-bold text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-[#E5C158]/20"
              >
                START A PROJECT <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* CMS Admin Link */}
              {user ? (
                <a
                  href="/admin"
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400 hover:text-amber-300 transition"
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

