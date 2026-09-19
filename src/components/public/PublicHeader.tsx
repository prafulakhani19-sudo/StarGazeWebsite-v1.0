import React, { useState, useEffect } from 'react';
import { Menu, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FullscreenNavOverlay } from './FullscreenNavOverlay';
import { StargazeHorizontalLogo } from '../common/StargazeHorizontalLogo';
import { getMediaForSlot } from '../../lib/mediaResolver';
import { getBrandSettings, getNavigationMenuByLocation, getThemeCustomizerSettings } from '../../lib/cmsService';
import { NavigationMenu, ThemeCustomizerSettings } from '../../types';

export const PublicHeader: React.FC = () => {
  const [navOverlayOpen, setNavOverlayOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoAlt, setLogoAlt] = useState<string>('Stargaze Media - We Create What The World Watches');
  const [menu, setMenu] = useState<NavigationMenu | null>(null);
  const [customizer, setCustomizer] = useState<ThemeCustomizerSettings | null>(null);
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

    // Fetch dynamic header navigation and theme settings
    getNavigationMenuByLocation('header_primary').then((m) => {
      if (isMounted && m) setMenu(m);
    });

    getThemeCustomizerSettings().then((c) => {
      if (isMounted && c) setCustomizer(c);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const headerConfig = customizer?.header;
  const themeConfig = customizer?.theme;
  const accentColor = themeConfig?.customAccentHex || '#D97706';

  const defaultNavLinks = [
    { id: '1', label: 'WORK', url: '/projects' },
    { id: '2', label: 'CAPABILITIES', url: '/capabilities' },
    { id: '3', label: 'EQUIPMENT', url: '/equipment' },
    { id: '4', label: 'DISTRIBUTION', url: '/distribution' },
    { id: '5', label: 'EXPERIENCES', url: '/events' },
    { id: '6', label: 'NEWSROOM', url: '/news' },
  ];

  const navItems = menu?.items && menu.items.length > 0 ? menu.items : defaultNavLinks;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${
        headerConfig?.glassmorphism !== false ? 'bg-white/95 backdrop-blur-xl' : 'bg-white'
      } border-b border-zinc-200/80 transition duration-300 shadow-xs`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Horizontal Brand Logo without any border or boxes */}
            <a href="/" className="inline-flex items-center group py-1" data-cursor="VIEW" aria-label="Stargaze Media Home">
              <StargazeHorizontalLogo
                customLogoUrl={logoUrl}
                alt={logoAlt}
                className="w-auto max-w-[220px] sm:max-w-[280px]"
                height={headerConfig?.logoHeight || 48}
              />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-mono font-bold tracking-widest text-zinc-700">
              {navItems.map((item: any) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.target || '_self'}
                  className="hover:text-amber-600 transition py-1 relative group inline-flex items-center gap-1.5"
                  data-cursor="VIEW"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 border border-amber-500/40 font-bold uppercase">
                      {item.badge}
                    </span>
                  )}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: accentColor }}
                  />
                </a>
              ))}
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-4">
              {/* Fullscreen Overlay Trigger Button */}
              {headerConfig?.showExploreButton !== false && (
                <button
                  onClick={() => setNavOverlayOpen(true)}
                  data-cursor="VIEW"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-mono text-zinc-800 tracking-widest uppercase transition"
                >
                  <Menu className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline font-bold">
                    {headerConfig?.exploreButtonText || 'EXPLORE SCENES'}
                  </span>
                </button>
              )}

              {/* Primary CTA */}
              {headerConfig?.showPrimaryCta !== false && (
                <a
                  href={headerConfig?.primaryCtaLink || '/enquiry'}
                  data-cursor="ENQUIRE"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs font-mono tracking-wider uppercase transition shadow-md shadow-amber-600/20"
                  style={{ backgroundColor: accentColor }}
                >
                  <span>{headerConfig?.primaryCtaText || 'START A PROJECT'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}

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


