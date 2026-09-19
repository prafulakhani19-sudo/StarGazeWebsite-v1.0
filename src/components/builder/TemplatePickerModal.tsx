import React from 'react';
import { X, Sparkles, Film, Camera, Layers, ArrowRight, Check } from 'lucide-react';
import { PageBlock } from '../../types';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (blocks: PageBlock[]) => void;
}

interface StarterTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewImageUrl: string;
  blocks: PageBlock[];
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'film-premiere',
    name: 'Theatrical Film Premiere Landing',
    category: 'CINEMA',
    description: 'Hero trailer reveal, festival laurels, synopsis, director notes, and ticket/RSVP conversion banner.',
    previewImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    blocks: [
      {
        id: 't1-hero',
        type: 'hero',
        title: 'Premiere Hero',
        styles: {
          paddingTop: 90,
          paddingBottom: 90,
          backgroundColor: '#09090b',
          textColor: '#ffffff',
          accentColor: '#d97706',
          backgroundImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
          backgroundOverlayOpacity: 80,
        },
        settings: {
          eyebrow: 'OFFICIAL SELECTION // CANNES & TIFF',
          heading: 'WORLD PREMIERE SCREENING',
          subheading: 'A groundbreaking visual odyssey captured entirely on 65mm large format anamorphic film.',
          badge: 'EXCLUSIVE THEATRICAL ENGAGEMENT',
          primaryBtnText: 'RESERVE VIP PASS',
          primaryBtnLink: '/enquiry',
          secondaryBtnText: 'WATCH TEASER',
          secondaryBtnLink: '#trailer',
          align: 'center',
        },
      },
      {
        id: 't1-video',
        type: 'video_player',
        title: 'Teaser Reel',
        styles: { paddingTop: 40, paddingBottom: 40, backgroundColor: '#09090b' },
        settings: {
          videoTitle: 'OFFICIAL THEATRICAL TRAILER 4K',
          posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
        },
      },
      {
        id: 't1-quote',
        type: 'testimonial_quote',
        title: 'Critic Laurel',
        styles: { paddingTop: 40, paddingBottom: 40, backgroundColor: '#18181b', textColor: '#ffffff' },
        settings: {
          quote: 'A cinematic masterpiece that redefines modern Indian storytelling with breathtaking visual clarity.',
          author: 'International Cinema Review',
          authorTitle: 'Cannes Film Festival Retrospective',
        },
      },
      {
        id: 't1-cta',
        type: 'cta_banner',
        title: 'Premiere Registration',
        styles: { paddingTop: 60, paddingBottom: 60, backgroundColor: '#09090b', textColor: '#ffffff' },
        settings: {
          eyebrow: 'LIMITED SEATS REMAINING',
          heading: 'SECURE YOUR GALA PREMIERE PASS',
          description: 'Experience the red carpet screening, director Q&A, and networking dinner.',
          primaryBtnText: 'REQUEST PASS',
          primaryBtnLink: '/enquiry',
        },
      },
    ],
  },
  {
    id: 'studio-facilities',
    name: 'Production Sound Stages & Facilities',
    category: 'STUDIO',
    description: 'Stage schematics, lighting power capacity, rental inventory cross-link, and booking form.',
    previewImageUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80',
    blocks: [
      {
        id: 't2-hero',
        type: 'hero',
        title: 'Facility Hero',
        styles: {
          paddingTop: 80,
          paddingBottom: 80,
          backgroundColor: '#09090b',
          textColor: '#ffffff',
          backgroundImageUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1600&q=80',
          backgroundOverlayOpacity: 80,
        },
        settings: {
          eyebrow: 'STATE-OF-THE-ART SOUND STAGES',
          heading: 'PRODUCTION STAGES & TECHNICAL LABS',
          subheading: 'A comprehensive cinema production infrastructure equipped with motorized lighting grids and heavy power backups.',
          primaryBtnText: 'SCHEDULE STAGE VISIT',
          primaryBtnLink: '/enquiry',
          secondaryBtnText: 'EQUIPMENT ROSTER',
          secondaryBtnLink: '/equipment',
          align: 'center',
        },
      },
      {
        id: 't2-stats',
        type: 'stats_counter',
        title: 'Studio Specs',
        styles: { paddingTop: 40, paddingBottom: 40, backgroundColor: '#18181b', textColor: '#ffffff' },
        settings: {
          items: [
            { number: '35,000', label: 'Sq. Ft. Stage Area' },
            { number: '200 kW', label: 'Generator Backup' },
            { number: 'Dolby', label: 'Certified Atmos Suite' },
            { number: '24 / 7', label: 'On-Call Grip Team' },
          ],
        },
      },
      {
        id: 't2-features',
        type: 'feature_cards',
        title: 'Stage Capabilities',
        styles: { paddingTop: 40, paddingBottom: 40, backgroundColor: '#ffffff', textColor: '#09090b' },
        settings: {
          columns: 3,
          cards: [
            { title: 'Sound Stage A (15,000 sq ft)', description: '36-foot ceiling clearance with motorized grid and cyclorama.', badge: 'STAGE A', icon: 'Film' },
            { title: 'Audio & Dubbing Suite', description: 'Certified Dolby Atmos mixing stage and automated dialogue replacement.', badge: 'POST', icon: 'Sliders' },
            { title: 'DOP Camera Prep Bay', description: 'Collimators, lens projection charts, and climate-controlled prep tables.', badge: 'LAB', icon: 'Camera' },
          ],
        },
      },
      {
        id: 't2-faq',
        type: 'faq_accordion',
        title: 'Booking FAQ',
        styles: { paddingTop: 40, paddingBottom: 60, backgroundColor: '#f4f4f5' },
        settings: {
          eyebrow: 'STAGE HIRE GUIDELINES',
          heading: 'FACILITY & TECHNICAL FAQ',
          items: [
            { question: 'What are the sound proofing specs of Stage A?', answer: 'Stage A provides STC 60 acoustic isolation with floating concrete floors and silent HVAC ducts.' },
            { question: 'Are camera packages discounted when bundled with stage hire?', answer: 'Yes, we offer integrated stage + ARRI camera packages with prioritized support.' },
          ],
        },
      },
    ],
  },
  {
    id: 'masterclass-academy',
    name: 'Filmmaking Masterclass & Workshop',
    category: 'EDUCATION',
    description: 'Curriculum overview, instructor bios, schedule breakdown, and registration form.',
    previewImageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80',
    blocks: [
      {
        id: 't3-hero',
        type: 'hero',
        title: 'Workshop Hero',
        styles: {
          paddingTop: 80,
          paddingBottom: 80,
          backgroundColor: '#09090b',
          textColor: '#ffffff',
          backgroundImageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1600&q=80',
          backgroundOverlayOpacity: 85,
        },
        settings: {
          eyebrow: 'INTENSIVE 3-DAY WORKSHOP',
          heading: 'ANAMORPHIC CINEMATOGRAPHY LAB',
          subheading: 'Master the optical physics, lighting ratios, and color science of modern widescreen cinema.',
          primaryBtnText: 'REGISTER NOW',
          primaryBtnLink: '/enquiry',
          badge: 'ONLY 12 SEATS AVAILABLE',
          align: 'center',
        },
      },
      {
        id: 't3-features',
        type: 'feature_cards',
        title: 'Curriculum Highlights',
        styles: { paddingTop: 40, paddingBottom: 40, backgroundColor: '#09090b', textColor: '#ffffff' },
        settings: {
          columns: 3,
          cards: [
            { title: 'Day 1: Optics & Lenses', description: 'Deconstructing flare characteristics, barrel distortion, and anamorphic bokeh.', badge: 'DAY 1', icon: 'Camera' },
            { title: 'Day 2: Dramatic Lighting', description: 'Cinematic contrast ratios, chiaroscuro lighting, and HMI / LED fixtures.', badge: 'DAY 2', icon: 'Sliders' },
            { title: 'Day 3: 8K Color Pipeline', description: 'ACES workflow, CDL grading, and delivery for DCI theatrical DCP projection.', badge: 'DAY 3', icon: 'Film' },
          ],
        },
      },
      {
        id: 't3-form',
        type: 'contact_form',
        title: 'Application Form',
        styles: { paddingTop: 40, paddingBottom: 60, backgroundColor: '#18181b', textColor: '#ffffff' },
        settings: {
          formTitle: 'APPLY FOR MASTERCLASS SEAT',
          formSubtitle: 'Please submit your showreel and cinematography background.',
        },
      },
    ],
  },
];

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              STARTER BLUEPRINTS
            </span>
            <h2 className="text-xl font-bold uppercase font-display text-white">
              Choose a Cinema Page Template
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TEMPLATES GRID */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {STARTER_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col justify-between group hover:border-amber-500/60 transition-all hover:shadow-2xl hover:shadow-amber-500/5"
            >
              <div className="relative aspect-video overflow-hidden bg-zinc-900">
                <img
                  src={tmpl.previewImageUrl}
                  alt={tmpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono font-bold text-amber-400 uppercase border border-amber-500/30">
                  {tmpl.category}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-400">
                  {tmpl.blocks.length} Sections
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white uppercase font-display mb-2 group-hover:text-amber-400 transition">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                    {tmpl.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectTemplate(tmpl.blocks);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>LOAD THIS TEMPLATE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
