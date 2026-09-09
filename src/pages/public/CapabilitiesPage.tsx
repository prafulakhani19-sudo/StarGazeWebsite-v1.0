import React, { useState } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { Film, Sliders, Camera, Globe, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServiceCategory {
  id: string;
  name: string;
  icon: any;
  tagline: string;
  services: { title: string; desc: string; specs: string }[];
}

const CATEGORIES: ServiceCategory[] = [
  {
    id: 'production',
    name: '01 PRODUCTION & PRE-PROD',
    icon: Film,
    tagline: 'From script coverage to principal photography on international soundstages.',
    services: [
      { title: 'Film & Series Production', desc: 'End-to-end production management for IMAX features, streaming series, and documentaries.', specs: 'IMAX 70mm & 8K RAW' },
      { title: 'Script Coverage & Packaging', desc: 'Screenplay analysis, director attachment, and international co-production financing.', specs: 'Global Financing' },
      { title: 'Location Scouting & Clearance', desc: 'Global site permits, soundstage bookings, basecamp caravans, and local crew sourcing.', specs: '120+ Countries' },
      { title: 'Camera & Lighting Rigs', desc: 'Deployment of high-speed pursuit vehicles, heavy gimbals, and high-altitude drone units.', specs: 'FAA & DGCA Certified' }
    ]
  },
  {
    id: 'post',
    name: '02 POST & VISUAL EFFECTS',
    icon: Sliders,
    tagline: '8K grading, photorealistic 3D VFX, Dolby Atmos mixing & DCP mastering.',
    services: [
      { title: 'Photorealistic VFX & 3D', desc: 'Complex CGI environment creation, digital doubles, creature animation, and matte painting.', specs: 'Unreal 5.4 / Nuke' },
      { title: 'Dolby Vision Color Grading', desc: 'ACES 1.3 color pipeline with custom optics LUT emulation and HDR master mastering.', specs: 'DaVinci Resolve Studio' },
      { title: 'Dolby Atmos Sound & Foley', desc: 'Custom acoustic Foley recording, sound design, ADR dubbing, and 7.1.4 surround mix.', specs: 'Dolby Certified Stage' },
      { title: 'DCP Mastering & KDM', desc: 'DCI-compliant digital cinema package creation, encrypted keys, and theatrical distribution prints.', specs: 'DCI Compliant' }
    ]
  },
  {
    id: 'equipment',
    name: '03 CAMERA RENTAL DIVISION',
    icon: Camera,
    tagline: 'ARRI Alexa 35, Sony Venice 2, Cooke Anamorphic glass & wireless focus.',
    services: [
      { title: 'Cinema Camera Packages', desc: 'ARRI ALEXA 35, Sony Venice 2, RED V-Raptor XL 8K, and Sony FX6 production kits.', specs: 'LPL & PL Mounts' },
      { title: 'Anamorphic & Prime Glass', desc: 'Cooke Anamorphic /i, ARRI Master Primes, Angenieux Optimo zooms, and Leica Summilux glass.', specs: 'Custom Flare Coatings' },
      { title: 'Virtual Production LED Volume', desc: 'Stage 3 360-degree LED volume with real-time camera tracking and background rendering.', specs: '1.5mm Pixel Pitch' }
    ]
  },
  {
    id: 'distribution',
    name: '04 GLOBAL DISTRIBUTION',
    icon: Globe,
    tagline: 'Worldwide theatrical sales, streaming acquisitions, and airline licensing.',
    services: [
      { title: 'Theatrical Distribution', desc: 'Cinema booking across premier chain multiplexes, IMAX venues, and independent screens.', specs: 'Global Cinema Chains' },
      { title: 'SVOD & Streaming Rights', desc: 'Negotiation and delivery to Netflix, Amazon Prime, Apple TV+, and regional platforms.', specs: 'Worldwide Rights' },
      { title: 'Airline & In-Flight Media', desc: 'Specialized non-theatrical licensing for commercial airlines and maritime cruises.', specs: 'Full Localization' }
    ]
  },
  {
    id: 'marketing',
    name: '05 MARKETING & EXPERIENCES',
    icon: TrendingUp,
    tagline: 'Entertainment PR, premiere galas, merchandising & film festival activations.',
    services: [
      { title: 'Entertainment PR & Campaigns', desc: 'Box office promotional campaigns, talent press junkets, and digital viral marketing.', specs: '2.4B Global Impressions' },
      { title: 'World Premiere Galas', desc: 'Red carpet event architecture, Cannes & Venice festival showcases, and VIP receptions.', specs: 'Turnkey Event Build' },
      { title: 'Merchandising & Workshops', desc: 'Official film merchandise, collector items, masterclasses, and industry training.', specs: 'Global Supply Chain' }
    ]
  }
];

export const CapabilitiesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(CATEGORIES[0]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#D97706] selection:text-white">
      <PublicHeader />

      {/* Hero Header */}
      <section className="pt-32 pb-20 bg-[#F8F9FA] border-b border-zinc-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#B45309] font-mono text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
            STUDIO ARCHITECTURE & SERVICES
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-serif-cinematic tracking-tight uppercase text-zinc-900">
            ENTERTAINMENT CAPABILITIES
          </h1>

          <p className="text-zinc-600 max-w-3xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Stargaze Media operates a vertically integrated studio infrastructure encompassing 20+ specialized media services from script development to global distribution.
          </p>
        </div>
      </section>

      {/* Capabilities Interactive Matrix */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Category Selector Sidebar (Left 4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest block mb-2">
              SELECT CAPABILITY DIVISION
            </span>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory.id === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  data-cursor="VIEW"
                  className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between font-mono text-xs ${
                    isSelected
                      ? 'bg-[#D97706] text-white border-[#D97706] font-bold shadow-md shadow-amber-600/20'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-amber-400 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{cat.name}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>

          {/* Detailed Services Grid (Right 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-zinc-200 space-y-2 shadow-xs">
              <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest block">
                DIVISION OVERVIEW
              </span>
              <h2 className="text-2xl font-bold font-serif-cinematic text-zinc-900">
                {activeCategory.name}
              </h2>
              <p className="text-sm text-zinc-600">{activeCategory.tagline}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeCategory.services.map((srv, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-amber-400 hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#D97706]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <h4 className="font-bold text-zinc-900 text-base font-serif-cinematic">
                        {srv.title}
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-[11px] font-mono text-[#B45309]">
                    <span className="text-zinc-500 font-medium">SPECIFICATION:</span>
                    <span className="font-bold">{srv.specs}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <a
                href="/enquiry"
                className="w-full py-4 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-md shadow-amber-600/20"
              >
                BOOK DIVISION SERVICES <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
