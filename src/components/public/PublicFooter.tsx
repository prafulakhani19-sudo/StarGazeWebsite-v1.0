import React, { useState, useEffect } from 'react';
import { Sparkles, Film, Camera, Globe, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { StargazeHorizontalLogo } from '../common/StargazeHorizontalLogo';
import { getMediaForSlot } from '../../lib/mediaResolver';
import { getBrandSettings, getThemeCustomizerSettings, getNavigationMenuByLocation } from '../../lib/cmsService';
import { ThemeCustomizerSettings, NavigationMenu } from '../../types';

export const PublicFooter: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [customizer, setCustomizer] = useState<ThemeCustomizerSettings | null>(null);
  const [footerMenu, setFooterMenu] = useState<NavigationMenu | null>(null);

  useEffect(() => {
    let isMounted = true;
    getBrandSettings()
      .then((brand) => {
        if (isMounted && (brand?.primaryLogoUrl || brand?.altLogoUrl)) {
          setLogoUrl(brand.primaryLogoUrl || brand.altLogoUrl || null);
        } else {
          return getMediaForSlot('brand.logo').then((res) => {
            if (isMounted && res.url) {
              setLogoUrl(res.url);
            }
          });
        }
      })
      .catch(() => {
        getMediaForSlot('brand.logo').then((res) => {
          if (isMounted && res.url) {
            setLogoUrl(res.url);
          }
        });
      });

    getThemeCustomizerSettings().then((c) => {
      if (isMounted && c) setCustomizer(c);
    });

    getNavigationMenuByLocation('footer_col_1').then((m) => {
      if (isMounted && m) setFooterMenu(m);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const footerConfig = customizer?.footer;
  const themeConfig = customizer?.theme;
  const accentColor = themeConfig?.customAccentHex || '#D97706';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const defaultLinks = [
    { id: '1', label: 'Feature Films & Sci-Fi Epics', url: '/projects' },
    { id: '2', label: 'Camera & DOP Rig Rentals', url: '/equipment' },
    { id: '3', label: 'Film Festivals & Premieres', url: '/events' },
    { id: '4', label: 'Global Content Distribution', url: '/distribution' },
    { id: '5', label: 'Studio Press & Insights', url: '/news' },
  ];

  const quickLinks = footerMenu?.items && footerMenu.items.length > 0 ? footerMenu.items : defaultLinks;

  return (
    <footer className="bg-white border-t border-zinc-200 text-zinc-600 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center">
            <StargazeHorizontalLogo
              customLogoUrl={logoUrl || undefined}
              alt="Stargaze Media"
              className="h-10 w-auto max-w-[200px]"
            />
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            {footerConfig?.tagline || 'A premium cinematic digital universe. Film studio, IMAX visual productions, rental camera systems, and global content distribution.'}
          </p>
          <div className="pt-2 text-xs text-zinc-400 font-mono">
            {footerConfig?.copyrightText || `© ${new Date().getFullYear()} Stargaze Media Studios. All rights reserved.`}
          </div>
        </div>

        {/* Studio Divisions / Quick Links */}
        <div>
          <h4 
            className="text-xs font-mono font-bold tracking-widest uppercase mb-4"
            style={{ color: accentColor }}
          >
            {footerMenu?.name ? footerMenu.name.toUpperCase() : 'DIVISIONS'}
          </h4>
          <ul className="space-y-2.5 text-xs font-medium text-zinc-600">
            {quickLinks.map((item: any) => (
              <li key={item.id}>
                <a 
                  href={item.url} 
                  target={item.target || '_self'} 
                  className="hover:text-amber-600 transition inline-flex items-center gap-1.5"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-700 font-bold font-mono">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Global Hubs */}
        <div>
          <h4 
            className="text-xs font-mono font-bold tracking-widest uppercase mb-4"
            style={{ color: accentColor }}
          >
            STUDIO HUBS
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-600">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Stargaze Complex, Soundstage 4, Film City, Mumbai 400065</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>+91 22 8900 1200</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600 shrink-0" />
              <span>press@stargazemedia.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter or CMS Portal Link */}
        <div>
          {footerConfig?.showNewsletter ? (
            <div>
              <h4 
                className="text-xs font-mono font-bold tracking-widest uppercase mb-2"
                style={{ color: accentColor }}
              >
                {footerConfig.newsletterHeading}
              </h4>
              <p className="text-xs text-zinc-500 mb-3">
                {footerConfig.newsletterSubtext}
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Stargaze Cinema Dispatch.'); }} className="flex gap-1.5">
                <input
                  type="email"
                  required
                  placeholder="name@studio.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-300 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl text-white font-mono text-xs font-bold transition shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  JOIN
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h4 
                className="text-xs font-mono font-bold tracking-widest uppercase mb-4"
                style={{ color: accentColor }}
              >
                INTERNAL CMS
              </h4>
              <p className="text-xs text-zinc-500 mb-4">
                Authorized administrator portal for content management, visual page builder, navigation menus, and WordPress-style customizer.
              </p>
              <a
                href="/admin/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-amber-500/40 text-[#B45309] font-mono text-xs font-bold transition shadow-xs"
              >
                Go to Admin Login →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Back to Top */}
      {footerConfig?.showBackToTop !== false && (
        <button
          onClick={scrollToTop}
          title="Back to Top"
          className="fixed bottom-6 right-6 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white shadow-xl backdrop-blur-md border border-zinc-700 transition hover:scale-110 z-40 group"
        >
          <ArrowUp className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </footer>
  );
};
