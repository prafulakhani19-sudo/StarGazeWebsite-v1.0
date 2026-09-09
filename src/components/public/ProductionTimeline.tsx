import React, { useState } from 'react';
import { Film, MapPin, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface TimelineStage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  deliverables: string[];
  specs: Record<string, string>;
}

const STAGES: TimelineStage[] = [
  {
    id: 'dev',
    step: '01',
    title: 'DEVELOPMENT & PACKAGING',
    subtitle: 'Script coverage, financing & top-tier talent attachment',
    description: 'We turn cinematic concepts into greenlit productions through expert script coverage, director attachments, international co-production packaging, and financial modeling.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80',
    deliverables: ['Original Screenplays', 'Co-Production Agreements', 'IMAX Concept Art', 'Cast & Director Packaging'],
    specs: { 'Development Cycle': '3-6 Months', 'Studio Access': 'Global Co-Pro', 'Budget Tier': '$5M - $150M' }
  },
  {
    id: 'pre',
    step: '02',
    title: 'PRE-PRODUCTION & VISUALIZATION',
    subtitle: 'Virtual production, 3D pre-vis & lens choices',
    description: 'Comprehensive technical preparation including 3D pre-visualization, location scouting, set construction, custom optics tuning, and LED Volume rehearsal.',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1000&q=80',
    deliverables: ['Unreal Engine Pre-Vis', 'Optical Lens Tests', 'Costume & Set Design', 'Safety & Permitting'],
    specs: { 'Pre-Vis Engine': 'Unreal Engine 5.4', 'Scouting Radius': 'Worldwide', 'Optics': 'Cooke & Master Primes' }
  },
  {
    id: 'prod',
    step: '03',
    title: 'PRINCIPAL PHOTOGRAPHY',
    subtitle: 'ARRI 35, Sony Venice 2 & multi-camera setups',
    description: 'Execution of principal photography powered by elite DOP crews, dual 8K large format camera packages, specialized motion control, and high-speed pursuit vehicles.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=80',
    deliverables: ['8K RAW Camera Masters', 'On-Set DIT Dailies', 'Live Motion Control', 'High-Speed Phantom Runs'],
    specs: { 'Resolution': '4.6K - 8K RAW', 'Color Space': 'ARRI REVEAL / S-Gamut3', 'DIT Workflow': 'Real-time Lut Grade' }
  },
  {
    id: 'loc',
    step: '04',
    title: 'LOCATIONS & LOGISTICS',
    subtitle: 'Global permitting, Soundstages & extreme environments',
    description: 'Full infrastructure support for filming in high-altitude mountain ranges, dense jungle, desert dunes, oceanic setups, and air-conditioned soundstages.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    deliverables: ['Permit Clearance', 'Basecamp Caravans', 'Drone Aerial Units', 'Helicopter Rigs'],
    specs: { 'Soundstages': '4 Soundstages (50k sqft)', 'Permitting': '120 Countries', 'Aerial': 'FAA & DGCA Certified' }
  },
  {
    id: 'supp',
    step: '05',
    title: 'CREW & PRODUCTION SUPPORT',
    subtitle: 'Master DOPs, Gaffers, Grips & Catering',
    description: 'Deployment of seasoned film technicians, production managers, gaffers, key grips, stunt coordinators, and high-end unit hospitality.',
    image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=1000&q=80',
    deliverables: ['DOP & Camera Crew', 'Lighting & Grip Trucks', 'Stunt Safety Teams', 'Executive Catering'],
    specs: { 'Crew Capacity': '500+ Professionals', 'Safety Standard': 'ISO Film Certified', 'Catering': 'Five-Star On Set' }
  }
];

export const ProductionTimeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState<TimelineStage>(STAGES[2]); // Default to Production

  return (
    <section className="py-24 bg-[#F8F9FA] border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-zinc-200 pb-6 gap-4">
          <div>
            <span className="text-[#B45309] text-xs font-mono font-bold tracking-widest uppercase block mb-2">
              ECOSYSTEM // PRODUCTION PIPELINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-zinc-900 uppercase">
              THE PRODUCTION TIMELINE
            </h2>
          </div>
          <p className="text-zinc-600 font-sans text-xs sm:text-sm max-w-md">
            From initial screenplay coverage to large-format principal photography across global soundstages.
          </p>
        </div>

        {/* Timeline Stage Selector Buttons */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-zinc-200 pb-4 overflow-x-auto">
          {STAGES.map((s) => {
            const isSelected = activeStage.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s)}
                data-cursor="VIEW"
                className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#D97706] text-white shadow-lg shadow-amber-500/20'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:text-zinc-900 hover:border-amber-400'
                }`}
              >
                <span className={isSelected ? 'text-white font-extrabold' : 'text-[#B45309]'}>
                  {s.step}
                </span>
                <span>{s.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg">
          {/* Left Text Detail */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono text-[#B45309]">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 font-bold">
                STAGE {activeStage.step}
              </span>
              <span className="uppercase tracking-widest font-semibold">{activeStage.subtitle}</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold font-serif-cinematic text-zinc-900 leading-tight">
              {activeStage.title}
            </h3>

            <p className="text-zinc-600 font-sans text-sm sm:text-base leading-relaxed">
              {activeStage.description}
            </p>

            {/* Deliverables Checklist */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest block mb-2">
                KEY DELIVERABLES:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeStage.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-sans text-zinc-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specs Bar */}
            <div className="pt-4 border-t border-zinc-100 grid grid-cols-3 gap-4 font-mono text-xs">
              {Object.entries(activeStage.specs).map(([key, val]) => (
                <div key={key}>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">{key}</span>
                  <span className="text-[#B45309] font-bold">{val}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="/enquiry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-50 hover:bg-[#D97706] hover:text-white border border-amber-500/40 text-[#B45309] text-xs font-mono font-bold tracking-wider uppercase transition"
              >
                REQUEST STAGE SUPPORT <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Stage Imagery */}
          <div className="lg:col-span-6">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-200 relative group shadow-md">
              <img
                src={activeStage.image}
                alt={activeStage.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
