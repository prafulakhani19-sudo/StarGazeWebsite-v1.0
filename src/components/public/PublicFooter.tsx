import React from 'react';
import { Sparkles, Film, Camera, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black">
              <Sparkles className="w-5 h-5 fill-black" />
            </div>
            <span className="text-lg font-bold tracking-widest text-white uppercase font-mono">
              STARGAZE MEDIA
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            A premium cinematic digital universe. Film studio, IMAX visual productions, rental camera systems, and global content distribution.
          </p>
          <div className="pt-2 text-xs text-zinc-400">
            © {new Date().getFullYear()} Stargaze Media Studios. All rights reserved.
          </div>
        </div>

        {/* Studio Divisions */}
        <div>
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase mb-4 text-amber-500">
            DIVISIONS
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="/projects" className="hover:text-white transition">Feature Films & Sci-Fi Epics</a></li>
            <li><a href="/equipment" className="hover:text-white transition">Camera & DOP Rig Rentals</a></li>
            <li><a href="/events" className="hover:text-white transition">Film Festivals & Premieres</a></li>
            <li><a href="/distribution" className="hover:text-white transition">Global Content Distribution</a></li>
            <li><a href="/news" className="hover:text-white transition">Studio Press & Insights</a></li>
          </ul>
        </div>

        {/* Global Hubs */}
        <div>
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase mb-4 text-amber-500">
            STUDIO HUBS
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Stargaze Complex, Soundstage 4, Film City, Mumbai 400065</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>+91 22 8900 1200</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>press@stargazemedia.com</span>
            </li>
          </ul>
        </div>

        {/* CMS Portal Link */}
        <div>
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase mb-4 text-amber-500">
            INTERNAL CMS
          </h4>
          <p className="text-xs text-zinc-400 mb-4">
            Authorized administrator portal for content management, user administration, and role-based permissions.
          </p>
          <a
            href="/admin/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold transition"
          >
            Go to Admin Login →
          </a>
        </div>
      </div>
    </footer>
  );
};
