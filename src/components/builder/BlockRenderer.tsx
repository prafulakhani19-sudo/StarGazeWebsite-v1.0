import React, { useState } from 'react';
import { 
  ArrowRight, Play, CheckCircle2, ChevronDown, 
  ExternalLink, Film, Camera, Sliders, Sparkles, Send,
  Globe, Star, Quote, Shield, Info, HelpCircle
} from 'lucide-react';
import { PageBlock } from '../../types';
import { StargazeHorizontalLogo } from '../common/StargazeHorizontalLogo';

interface BlockRendererProps {
  block: PageBlock;
  isEditing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isEditing = false,
  onSelect,
  isSelected = false,
}) => {
  const { type, settings = {}, styles = {} } = block;
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Dynamic Styles Calculation
  const blockStyle: React.CSSProperties = {
    paddingTop: styles.paddingTop !== undefined ? `${styles.paddingTop}px` : '48px',
    paddingBottom: styles.paddingBottom !== undefined ? `${styles.paddingBottom}px` : '48px',
    paddingLeft: styles.paddingX !== undefined ? `${styles.paddingX}px` : undefined,
    paddingRight: styles.paddingX !== undefined ? `${styles.paddingX}px` : undefined,
    backgroundColor: styles.backgroundColor || 'transparent',
    color: styles.textColor || 'inherit',
    position: 'relative',
    overflow: 'hidden',
  };

  const containerClass = 
    styles.containerWidth === 'narrow' ? 'max-w-4xl' :
    styles.containerWidth === 'wide' ? 'max-w-7xl' :
    styles.containerWidth === 'full' ? 'w-full px-4' :
    'max-w-6xl';

  // Helper for icon resolution
  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'camera': return <Camera className="w-5 h-5" />;
      case 'film': return <Film className="w-5 h-5" />;
      case 'sliders': return <Sliders className="w-5 h-5" />;
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'globe': return <Globe className="w-5 h-5" />;
      case 'shield': return <Shield className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  // Render individual block types
  const renderContent = () => {
    switch (type) {
      case 'hero': {
        const alignClass = 
          settings.align === 'left' ? 'text-left items-start' :
          settings.align === 'right' ? 'text-right items-end' :
          'text-center items-center';

        return (
          <div className="relative w-full">
            {/* Background image & overlay if present */}
            {styles.backgroundImageUrl && (
              <div 
                className="absolute inset-0 bg-cover bg-center z-0" 
                style={{ backgroundImage: `url(${styles.backgroundImageUrl})` }}
              >
                <div 
                  className="absolute inset-0 bg-black" 
                  style={{ opacity: (styles.backgroundOverlayOpacity ?? 70) / 100 }} 
                />
              </div>
            )}

            <div className={`relative z-10 ${containerClass} mx-auto px-4 sm:px-6 flex flex-col ${alignClass}`}>
              {settings.badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{settings.badge}</span>
                </div>
              )}

              {settings.eyebrow && (
                <p className="text-xs sm:text-sm font-mono tracking-widest text-amber-500 uppercase font-bold mb-3">
                  {settings.eyebrow}
                </p>
              )}

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase leading-none font-display max-w-4xl mb-6">
                {settings.heading || 'YOUR CINEMATIC TITLE HERE'}
              </h1>

              {settings.subheading && (
                <p className="text-base sm:text-lg lg:text-xl text-zinc-300 max-w-2xl font-light leading-relaxed mb-8">
                  {settings.subheading}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {settings.primaryBtnText && (
                  <a
                    href={settings.primaryBtnLink || '#'}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
                  >
                    <span>{settings.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
                {settings.secondaryBtnText && (
                  <a
                    href={settings.secondaryBtnLink || '#'}
                    className="px-6 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs font-mono tracking-wider uppercase transition inline-flex items-center gap-2 backdrop-blur-sm"
                  >
                    <span>{settings.secondaryBtnText}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'heading': {
        const alignClass = 
          settings.align === 'center' ? 'text-center items-center' :
          settings.align === 'right' ? 'text-right items-end' :
          'text-left items-start';

        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6 flex flex-col ${alignClass}`}>
            {settings.eyebrow && (
              <span className="text-xs font-mono tracking-widest uppercase font-bold text-amber-500 mb-2">
                {settings.eyebrow}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight font-display">
              {settings.heading || 'Section Title'}
            </h2>
            {settings.subheading && (
              <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl font-light">
                {settings.subheading}
              </p>
            )}
            {settings.showDivider && (
              <div className="w-16 h-1 bg-amber-500 rounded-full mt-4" />
            )}
          </div>
        );
      }

      case 'rich_text': {
        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6 prose prose-invert max-w-none`}>
            <div className="text-base sm:text-lg leading-relaxed whitespace-pre-line text-zinc-300 font-light">
              {settings.content || 'Enter rich text content and narrative copy here...'}
            </div>
          </div>
        );
      }

      case 'image_banner': {
        const aspectRatioClass = 
          settings.aspectRatio === '16:9' ? 'aspect-video' :
          settings.aspectRatio === '9:16' ? 'aspect-[9/16] max-w-md mx-auto' :
          settings.aspectRatio === '4:3' ? 'aspect-[4/3]' :
          settings.aspectRatio === '1:1' ? 'aspect-square max-w-lg mx-auto' :
          'aspect-video';

        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            <div className={`relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 ${aspectRatioClass} group shadow-2xl`}>
              <img
                src={settings.imageUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80'}
                alt={settings.caption || 'Cinematic Banner'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {settings.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                  <p className="text-sm font-mono tracking-wider text-amber-400 uppercase font-bold">
                    {settings.caption}
                  </p>
                  {settings.subcaption && (
                    <p className="text-xs text-zinc-300 mt-1">{settings.subcaption}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'video_player': {
        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl group">
              {settings.videoEmbedUrl ? (
                <iframe
                  src={settings.videoEmbedUrl}
                  title="Cinema Video Reel"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative bg-gradient-to-b from-zinc-900 to-black">
                  {settings.posterUrl && (
                    <img 
                      src={settings.posterUrl} 
                      alt="Video Poster" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60" 
                    />
                  )}
                  <div className="relative z-10">
                    <button className="w-16 h-16 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-110 transition group-hover:bg-amber-400 mb-4">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </button>
                    <p className="text-sm font-mono font-bold tracking-widest text-white uppercase">
                      {settings.videoTitle || 'WATCH PREMIERE TRAILER'}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">4K UHD • Dolby Atmos Mastering</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'feature_cards': {
        const cols = settings.columns === 2 ? 'md:grid-cols-2' : settings.columns === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';
        const cards = settings.cards || [
          { title: 'Cinematic Production', description: 'Feature films, OTT original series, and commercial narratives with Hollywood-grade standards.', badge: 'PRODUCTION', icon: 'Film' },
          { title: 'Technical Gear Rental', description: 'ARRI Alexa 35, Cooke Anamorphic glass, Ronin 2, and specialized high-speed grip gear.', badge: 'EQUIPMENT', icon: 'Camera' },
          { title: 'Post-Production & VFX', description: '8K color grading, Dolby Atmos certified mastering, photorealistic VFX, and DCP delivery.', badge: 'POST-LAB', icon: 'Sliders' },
        ];

        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            <div className={`grid grid-cols-1 ${cols} gap-6`}>
              {cards.map((card: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        {renderIcon(card.icon)}
                      </div>
                      {card.badge && (
                        <span className="text-[10px] font-mono tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase font-display tracking-tight mb-2 group-hover:text-amber-400 transition">
                      {card.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-light">
                      {card.description}
                    </p>
                  </div>

                  {card.linkText && (
                    <a
                      href={card.linkUrl || '#'}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider mt-6 pt-4 border-t border-zinc-800/80"
                    >
                      <span>{card.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'stats_counter': {
        const items = settings.items || [
          { number: '14+', label: 'Feature Productions' },
          { number: '250+', label: 'Camera Packages' },
          { number: '120+', label: 'Global Territories' },
          { number: '40+', label: 'Industry Awards' },
        ];

        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="p-4 flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-amber-400 mb-1">
                    {item.number}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'cta_banner': {
        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/60 via-zinc-900 to-zinc-950 border border-amber-500/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-2xl">
              {settings.eyebrow && (
                <span className="text-xs font-mono tracking-widest uppercase font-bold text-amber-400 mb-3">
                  {settings.eyebrow}
                </span>
              )}
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-display max-w-2xl mb-4">
                {settings.heading || 'READY TO BRING YOUR STORY TO THE SCREEN?'}
              </h2>
              {settings.description && (
                <p className="text-sm sm:text-base text-zinc-300 max-w-xl font-light leading-relaxed mb-8">
                  {settings.description}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {settings.primaryBtnText && (
                  <a
                    href={settings.primaryBtnLink || '/enquiry'}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono tracking-wider uppercase transition shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
                  >
                    <span>{settings.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
                {settings.secondaryBtnText && (
                  <a
                    href={settings.secondaryBtnLink || '/projects'}
                    className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs font-mono tracking-wider uppercase transition inline-flex items-center gap-2"
                  >
                    <span>{settings.secondaryBtnText}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'faq_accordion': {
        const items = settings.items || [
          { question: 'What production stages does Stargaze Media operate?', answer: 'We operate multiple sound stages, audio post-production studios, and camera preparation floors in Maharashtra.' },
          { question: 'How do I book camera and lighting rental packages?', answer: 'You can browse our online equipment catalog and submit an enquiry or call our 24/7 technical dispatch team.' },
          { question: 'What territories are available for film distribution?', answer: 'We handle worldwide theatrical, SVOD, and linear broadcast rights across India, North America, UK, and European territories.' },
        ];

        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            {settings.heading && (
              <div className="text-center mb-8">
                {settings.eyebrow && (
                  <p className="text-xs font-mono tracking-widest text-amber-500 uppercase font-bold mb-2">
                    {settings.eyebrow}
                  </p>
                )}
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight font-display text-white">
                  {settings.heading}
                </h2>
              </div>
            )}
            <div className="max-w-3xl mx-auto space-y-3">
              {items.map((item: any, idx: number) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden transition"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-white hover:text-amber-400 transition"
                    >
                      <span className="pr-4">{item.question}</span>
                      <ChevronDown className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed border-t border-zinc-800/60 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'testimonial_quote': {
        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            <div className="max-w-4xl mx-auto text-center relative py-6">
              <Quote className="w-12 h-12 text-amber-500/20 mx-auto mb-4" />
              <blockquote className="text-xl sm:text-3xl font-light italic text-white leading-relaxed font-serif">
                "{settings.quote || 'Stargaze Media combines visionary directorial narrative with unprecedented cinematography rigor.'}"
              </blockquote>
              <div className="mt-6 flex flex-col items-center">
                <p className="text-sm font-mono font-bold tracking-wider uppercase text-amber-400">
                  {settings.author || 'Renowned Filmmaker & Director'}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {settings.authorTitle || 'Official Festival Jury Statement'}
                </p>
              </div>
            </div>
          </div>
        );
      }

      case 'contact_form': {
        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            <div className="max-w-xl mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
              <h3 className="text-xl font-bold uppercase font-display text-white mb-2 text-center">
                {settings.formTitle || 'SEND DIRECT ENQUIRY'}
              </h3>
              <p className="text-xs text-zinc-400 text-center mb-6">
                {settings.formSubtitle || 'Our production desk responds within 24 business hours.'}
              </p>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <CheckCircle2 className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white font-mono uppercase">Enquiry Dispatched</p>
                  <p className="text-xs text-zinc-400 mt-1">Thank you! A studio executive will be in touch shortly.</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@production.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Production Details / Message</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe your film, rental needs, or event dates..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SUBMIT PRODUCTION INQUIRY</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        );
      }

      case 'spacer_divider': {
        const height = settings.height || 48;
        return (
          <div style={{ height: `${height}px` }} className="w-full flex items-center justify-center">
            {settings.showLine && (
              <div className="w-full max-w-4xl border-t border-zinc-800/80" />
            )}
          </div>
        );
      }

      case 'custom_html': {
        return (
          <div className={`${containerClass} mx-auto px-4 sm:px-6`}>
            {settings.rawHtml ? (
              <div dangerouslySetInnerHTML={{ __html: settings.rawHtml }} />
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-zinc-700 text-center text-xs font-mono text-zinc-500">
                Custom HTML Block (No code provided)
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <div className={`${containerClass} mx-auto px-4 text-center py-6 text-xs font-mono text-zinc-500`}>
            Block: {type}
          </div>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      style={blockStyle}
      className={`relative transition-all duration-200 ${
        isEditing ? 'cursor-pointer hover:outline-2 hover:outline-amber-500/50 hover:outline-dashed' : ''
      } ${isSelected ? 'ring-2 ring-amber-500 outline-none' : ''}`}
    >
      {/* Editor Badge Tag */}
      {isEditing && (
        <div className="absolute top-2 left-2 z-30 opacity-0 group-hover:opacity-100 transition px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-amber-400 font-bold">
          {type.toUpperCase()}
        </div>
      )}
      {renderContent()}
    </div>
  );
};
