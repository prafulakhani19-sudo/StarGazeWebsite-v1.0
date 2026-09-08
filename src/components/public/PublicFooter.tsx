import React, { useState, useEffect } from 'react';
import { Sparkles, Film, Camera, Globe, Mail, Phone, MapPin, ArrowUpRight, Lock } from 'lucide-react';
import { getMediaForSlot } from '../../lib/mediaResolver';

export const PublicFooter: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getMediaForSlot('brand.logo').then((res) => {
      if (isMounted && res.url) {
        setLogoUrl(res.url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="bg-[#08080A] border-t border-white/[0.08] text-zinc-400 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-[#FFB800]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Stargaze Media"
                className="h-10 w-auto max-w-[120px] object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFB800] to-amber-300 flex items-center justify-center text-black font-black shadow-lg shadow-[#FFB800]/20">
                <Sparkles className="w-5 h-5 fill-black stroke-black" />
              </div>
            )}
            <span className="text-xl font-black tracking-tight text-white uppercase font-grotesk">
              STARGAZE<span className="text-[#FFB800]">.</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Avant-garde cinema studio, IMAX motion productions, optical hardware vaults, and global content syndication networks.
          </p>
          <div className="pt-2 text-[11px] font-mono-studio text-zinc-500">
            © {new Date().getFullYear()} STARGAZE MEDIA ENTERTAINMENT. ALL RIGHTS RESERVED.
          </div>
        </div>

        {/* Studio Divisions */}
        <div>
          <h4 className="text-xs font-mono-studio font-extrabold tracking-[0.25em] text-[#FFB800] uppercase mb-4">
            [ DIVISIONS ]
          </h4>
          <ul className="space-y-2.5 text-xs font-mono-studio">
            <li><a href="/projects" className="text-zinc-400 hover:text-white transition flex items-center gap-1 group">Feature Epics & Slate <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#FFB800] transition" /></a></li>
            <li><a href="/equipment" className="text-zinc-400 hover:text-white transition flex items-center gap-1 group">Camera & Optics Vault <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#FFB800] transition" /></a></li>
            <li><a href="/events" className="text-zinc-400 hover:text-white transition flex items-center gap-1 group">Galas & Premieres <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#FFB800] transition" /></a></li>
            <li><a href="/distribution" className="text-zinc-400 hover:text-white transition flex items-center gap-1 group">Global Syndication <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#FFB800] transition" /></a></li>
            <li><a href="/news" className="text-zinc-400 hover:text-white transition flex items-center gap-1 group">Studio Dispatches <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#FFB800] transition" /></a></li>
          </ul>
        </div>

        {/* Global Hubs */}
        <div>
          <h4 className="text-xs font-mono-studio font-extrabold tracking-[0.25em] text-[#FFB800] uppercase mb-4">
            [ STUDIO HUBS ]
          </h4>
          <ul className="space-y-3 text-xs font-sans text-zinc-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
              <span>Stargaze Soundstage 4, Film City Complex, Mumbai 400065</span>
            </li>
            <li className="flex items-center gap-2.5 font-mono-studio text-xs">
              <Phone className="w-4 h-4 text-[#FFB800] shrink-0" />
              <span>+91 22 8900 1200</span>
            </li>
            <li className="flex items-center gap-2.5 font-mono-studio text-xs">
              <Mail className="w-4 h-4 text-[#FFB800] shrink-0" />
              <span>press@stargazemedia.com</span>
            </li>
          </ul>
        </div>

        {/* CMS Portal Link */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono-studio font-extrabold tracking-[0.25em] text-[#FFB800] uppercase">
            [ STUDIO PORTAL ]
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Authorized administrative gateway for film masters, asset dispatch, and real-time CMS sync.
          </p>
          <a
            href="/admin/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-[#FFB800] border border-white/10 hover:border-[#FFB800] text-zinc-300 hover:text-black font-mono-studio text-xs font-bold transition duration-300"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>ENTER CMS PORTAL</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>
    </footer>
  );
};

