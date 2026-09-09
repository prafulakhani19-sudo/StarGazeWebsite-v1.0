import React, { useState, useEffect } from 'react';
import { Menu, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FullscreenNavOverlay } from './FullscreenNavOverlay';
import { StargazeHorizontalLogo } from '../common/StargazeHorizontalLogo';
import { getMediaForSlot } from '../../lib/mediaResolver';
import { getBrandSettings } from '../../lib/cmsService';

export const PublicHeader: React.FC = () => {
  const [navOverlayOpen, setNavOverlayOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoAlt, setLogoAlt] = useState<string>('Stargaze Media - We Create What The World Watches');
  const { user, profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    
    // First try brand settings from CMS, then fallback to slot
    getBrandSettings()
      .then((brand) => {
        if (isMounted && (brand?.primaryLogoUrl || brand?.altLogoUrl)) {
          setLogoUrl(brand.primaryLogoUrl || brand.altLogoUrl || '');
          if (brand.brandName) setLogoAlt(brand.brandName);
        } else {
          return getMediaForSlot('brand.logo').then((res) => {
            if (isMounted && res.url) {
              setLogoUrl(res.url);
              if (res.alt) setLogoAlt(res.alt);
            }
          });
        }
      })
      .catch(() => {
        getMediaForSlot('brand.logo').then((res) => {
          if (isMounted && res.url) {
            setLogoUrl(res.url);
            if (res.alt) setLogoAlt(res.alt);
          }
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-200/80 transition duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Horizontal Brand Logo without any border or boxes */}
            <a href="/" className="inline-flex items-center group py-1" data-cursor="VIEW" aria-label="Stargaze Media Home">
              <StargazeHorizontalLogo
                customLogoUrl={logoUrl}
                alt={logoAlt}
                className="h-10 sm:h-12 w-auto max-w-[220px] sm:max-w-[280px]"
              />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-mono font-bold tracking-widest text-zinc-700">
              <a href="/projects" className="hover:text-[#D97706] transition py-1 relative group" data-cursor="VIEW">
                WORK
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D97706] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/capabilities" className="hover:text-[#D97706] transition py-1 relative group" data-cursor="VIEW">
                CAPABILITIES
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D97706] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/equipment" className="hover:text-[#D97706] transition py-1 relative group" data-cursor="VIEW">
                EQUIPMENT
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D97706] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/distribution" className="hover:text-[#D97706] transition py-1 relative group" data-cursor="VIEW">
                DISTRIBUTION
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D97706] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/events" className="hover:text-[#D97706] transition py-1 relative group" data-cursor="VIEW">
                EXPERIENCES
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D97706] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/news" className="hover:text-[#D97706] transition py-1 relative group" data-cursor="VIEW">
                NEWSROOM
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D97706] group-hover:w-full transition-all duration-300" />
              </a>
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-4">
              {/* Fullscreen Overlay Trigger Button */}
              <button
                onClick={() => setNavOverlayOpen(true)}
                data-cursor="VIEW"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-mono text-zinc-800 tracking-widest uppercase transition"
              >
                <Menu className="w-4 h-4 text-[#D97706]" />
                <span className="hidden sm:inline font-bold">EXPLORE SCENES</span>
              </button>

              {/* Primary CTA */}
              <a
                href="/enquiry"
                data-cursor="ENQUIRE"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs font-mono tracking-wider uppercase transition shadow-md shadow-amber-600/20"
              >
                START A PROJECT <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* CMS Admin Link */}
              {user ? (
                <a
                  href="/admin"
                  className="p-2.5 rounded-xl bg-zinc-100 border border-zinc-300 text-amber-700 hover:bg-zinc-200 transition"
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

