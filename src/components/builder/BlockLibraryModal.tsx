import React, { useState } from 'react';
import { 
  X, Sparkles, Film, Type, Image as ImageIcon, 
  Play, LayoutGrid, Hash, Megaphone, HelpCircle, 
  Quote, Mail, Split, Code, Search
} from 'lucide-react';
import { PageBlockType, PageBlock } from '../../types';

interface BlockLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (block: PageBlock) => void;
}

interface BlockDefinition {
  type: PageBlockType;
  title: string;
  category: 'HERO' | 'CONTENT' | 'MEDIA' | 'SHOWCASE' | 'CONVERSION' | 'UTILITY';
  description: string;
  icon: React.ReactNode;
  defaultSettings: Record<string, any>;
  defaultStyles: Record<string, any>;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'hero',
    title: 'Hero Screen & Banner',
    category: 'HERO',
    description: 'Immersive fullscreen opening with headline, background cinematic poster, and action buttons.',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      eyebrow: 'EXCLUSIVE CINEMA ACCESS',
      heading: 'YOUR CINEMATIC TITLE HERE',
      subheading: 'Describe the premiere, facility, or production narrative with bold typography.',
      badge: 'LIMITED TIME // 4K ATMOS',
      primaryBtnText: 'REQUEST ACCESS',
      primaryBtnLink: '/enquiry',
      secondaryBtnText: 'EXPLORE SLATE',
      secondaryBtnLink: '/projects',
      align: 'center',
    },
    defaultStyles: {
      paddingTop: 80,
      paddingBottom: 80,
      backgroundColor: '#09090b',
      textColor: '#ffffff',
      accentColor: '#d97706',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      backgroundOverlayOpacity: 75,
      containerWidth: 'standard',
    },
  },
  {
    type: 'heading',
    title: 'Section Heading & Eyebrow',
    category: 'CONTENT',
    description: 'Typographic chapter marker with category eyebrow and amber dividing accent.',
    icon: <Type className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      eyebrow: '01 // CURATED SELECTION',
      heading: 'SECTION HEADLINE',
      subheading: 'A brief contextual introduction to the following showcase.',
      align: 'center',
      showDivider: true,
    },
    defaultStyles: {
      paddingTop: 48,
      paddingBottom: 16,
      backgroundColor: 'transparent',
      textColor: '#ffffff',
      containerWidth: 'standard',
    },
  },
  {
    type: 'rich_text',
    title: 'Rich Narrative Text',
    category: 'CONTENT',
    description: 'Multi-paragraph editorial copy with markdown formatting and high-contrast typography.',
    icon: <Film className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      content: '### CINEMA WITHOUT BOUNDARIES\n\nStargaze Media crafts world-class cinematic experiences, combining state-of-the-art camera tech with visionary storytelling.\n\nFrom indie retrospectives to large-format theatrical releases, our studios power the next generation of visual media.',
    },
    defaultStyles: {
      paddingTop: 32,
      paddingBottom: 32,
      backgroundColor: 'transparent',
      textColor: '#d4d4d8',
      containerWidth: 'standard',
    },
  },
  {
    type: 'image_banner',
    title: 'Cinema Image Banner',
    category: 'MEDIA',
    description: 'High-definition widescreen or vertical 9:16 banner with gradient overlay and bottom caption.',
    icon: <ImageIcon className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
      caption: 'PRODUCTION ON 65MM LARGE FORMAT',
      subcaption: 'Principal photography behind-the-scenes',
      aspectRatio: '16:9',
    },
    defaultStyles: {
      paddingTop: 32,
      paddingBottom: 32,
      backgroundColor: 'transparent',
      containerWidth: 'standard',
    },
  },
  {
    type: 'video_player',
    title: '4K Video / Reel Player',
    category: 'MEDIA',
    description: 'Responsive video container for YouTube/Vimeo embeds with cinema play button.',
    icon: <Play className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      videoTitle: 'WATCH THEATRICAL TEASER',
      videoEmbedUrl: '',
      posterUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80',
    },
    defaultStyles: {
      paddingTop: 40,
      paddingBottom: 40,
      backgroundColor: 'transparent',
      containerWidth: 'standard',
    },
  },
  {
    type: 'feature_cards',
    title: 'Feature Cards Grid',
    category: 'SHOWCASE',
    description: 'Multi-column cards highlighting services, technical labs, or cinema offerings.',
    icon: <LayoutGrid className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      columns: 3,
      cards: [
        { title: 'Production Stages', description: 'Multi-acre sound stages with sound dampening and heavy lighting grids.', badge: 'STAGES', icon: 'Film', linkText: 'Explore Stages', linkUrl: '#' },
        { title: 'Camera Packages', description: 'ARRI Alexa 35, Sony Venice 2, and Cooke full frame prime lenses.', badge: 'RENTAL', icon: 'Camera', linkText: 'Browse Catalog', linkUrl: '#' },
        { title: 'Dolby Atmos Lab', description: '8K HDR color suite and object-based immersive audio mastering.', badge: 'POST-LAB', icon: 'Sliders', linkText: 'Book Suite', linkUrl: '#' },
      ],
    },
    defaultStyles: {
      paddingTop: 40,
      paddingBottom: 40,
      backgroundColor: 'transparent',
      textColor: '#ffffff',
      containerWidth: 'standard',
    },
  },
  {
    type: 'stats_counter',
    title: 'Stats & Milestone Counter',
    category: 'SHOWCASE',
    description: 'Grid of impactful milestone numbers with gold mono accents.',
    icon: <Hash className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      items: [
        { number: '14+', label: 'Feature Productions' },
        { number: '250+', label: 'Camera Packages' },
        { number: '120+', label: 'Global Territories' },
        { number: '40+', label: 'Industry Awards' },
      ],
    },
    defaultStyles: {
      paddingTop: 32,
      paddingBottom: 32,
      backgroundColor: '#18181b',
      textColor: '#ffffff',
      containerWidth: 'standard',
    },
  },
  {
    type: 'cta_banner',
    title: 'Call to Action Banner',
    category: 'CONVERSION',
    description: 'High-conversion banner with gradient backdrop and primary action trigger.',
    icon: <Megaphone className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      eyebrow: 'START YOUR PRODUCTION',
      heading: 'BRING YOUR VISION TO THE SCREEN',
      description: 'Contact our executive production desk to schedule camera prep, stage hire, or distribution consultations.',
      primaryBtnText: 'BOOK PRODUCTION CALL',
      primaryBtnLink: '/enquiry',
      secondaryBtnText: 'VIEW SLATE',
      secondaryBtnLink: '/projects',
    },
    defaultStyles: {
      paddingTop: 48,
      paddingBottom: 48,
      backgroundColor: '#09090b',
      textColor: '#ffffff',
      containerWidth: 'standard',
    },
  },
  {
    type: 'faq_accordion',
    title: 'FAQ Accordion',
    category: 'CONTENT',
    description: 'Expandable question and answer cards for production guidelines and specs.',
    icon: <HelpCircle className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      eyebrow: 'ANSWERS & GUIDELINES',
      heading: 'FREQUENTLY ASKED QUESTIONS',
      items: [
        { question: 'What camera packages are available for hire?', answer: 'We stock ARRI Alexa 35, Mini LF, Sony Venice 2, and Red V-Raptor XL with full anamorphic lens sets.' },
        { question: 'How can we submit a project for theatrical distribution?', answer: 'Submit your screener link, synopsis, and budget slate through our online business enquiry desk.' },
      ],
    },
    defaultStyles: {
      paddingTop: 40,
      paddingBottom: 40,
      backgroundColor: 'transparent',
      textColor: '#ffffff',
      containerWidth: 'standard',
    },
  },
  {
    type: 'testimonial_quote',
    title: 'Testimonial / Directorial Quote',
    category: 'SHOWCASE',
    description: 'Prominent quote with elegant serif font and author badge.',
    icon: <Quote className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      quote: 'Stargaze Media sets the gold standard for Indian cinema production and technical innovation.',
      author: 'A-List Cinematographer',
      authorTitle: 'National Award Winner',
    },
    defaultStyles: {
      paddingTop: 48,
      paddingBottom: 48,
      backgroundColor: 'transparent',
      textColor: '#ffffff',
      containerWidth: 'standard',
    },
  },
  {
    type: 'contact_form',
    title: 'Direct Enquiry Form',
    category: 'CONVERSION',
    description: 'Embedded lead capture form with instant validation.',
    icon: <Mail className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      formTitle: 'INITIATE PRODUCTION ENQUIRY',
      formSubtitle: 'Direct contact with Stargaze Media producers and technical coordinators.',
    },
    defaultStyles: {
      paddingTop: 40,
      paddingBottom: 40,
      backgroundColor: 'transparent',
      textColor: '#ffffff',
      containerWidth: 'standard',
    },
  },
  {
    type: 'spacer_divider',
    title: 'Spacer & Filmstrip Divider',
    category: 'UTILITY',
    description: 'Adjustable vertical spacing with optional horizontal divider rule.',
    icon: <Split className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      height: 48,
      showLine: true,
    },
    defaultStyles: {
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: 'transparent',
      containerWidth: 'standard',
    },
  },
  {
    type: 'custom_html',
    title: 'Custom HTML / Embed',
    category: 'UTILITY',
    description: 'Insert arbitrary HTML markup, SVG graphics, or 3rd-party widget embeds.',
    icon: <Code className="w-5 h-5 text-amber-400" />,
    defaultSettings: {
      rawHtml: '<div class="p-8 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-amber-400 font-mono text-sm">CUSTOM EMBEDDED CONTENT</div>',
    },
    defaultStyles: {
      paddingTop: 24,
      paddingBottom: 24,
      backgroundColor: 'transparent',
      containerWidth: 'standard',
    },
  },
];

export const BlockLibraryModal: React.FC<BlockLibraryModalProps> = ({
  isOpen,
  onClose,
  onAddBlock,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredBlocks = BLOCK_DEFINITIONS.filter((b) => {
    const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelect = (def: BlockDefinition) => {
    const newBlock: PageBlock = {
      id: `block-${def.type}-${Date.now()}`,
      type: def.type,
      title: def.title,
      settings: JSON.parse(JSON.stringify(def.defaultSettings)),
      styles: JSON.parse(JSON.stringify(def.defaultStyles)),
    };
    onAddBlock(newBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              ELEMENTOR WIDGET LIBRARY
            </span>
            <h2 className="text-xl font-bold uppercase font-display text-white">
              Add Section / Element
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/40 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search elements (hero, video, cards, accordion)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-amber-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono font-bold">
            {['ALL', 'HERO', 'CONTENT', 'MEDIA', 'SHOWCASE', 'CONVERSION', 'UTILITY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* WIDGET GRID */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlocks.map((b) => (
            <div
              key={b.type}
              onClick={() => handleSelect(b)}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-500/60 transition-all cursor-pointer group flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition">
                    {b.icon}
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase font-bold">
                    {b.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase font-display group-hover:text-amber-400 transition mb-1">
                  {b.title}
                </h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-amber-500 font-bold opacity-0 group-hover:opacity-100 transition">
                <span>+ INSERT BLOCK</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
