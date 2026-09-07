import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Film, Sparkles } from 'lucide-react';
import { STARGAZE_MEDIA_REGISTRY } from '../../data/media';
import { StargazeImage } from '../common/StargazeImage';

export interface HeroSlideData {
  id: string;
  eyebrow: string;
  title: string;
  highlightTitle?: string;
  description: string;
  desktopSrc: string;
  mobileSrc: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  primaryCtaExternal?: boolean;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

const HERO_SLIDES: HeroSlideData[] = [
  {
    id: 'stargaze',
    eyebrow: 'FLAGSHIP ENTERTAINMENT STUDIO',
    title: 'WE CREATE WHAT THE',
    highlightTitle: 'WORLD WATCHES',
    description: 'Production • Post-Production • Camera Equipment • Distribution • Entertainment Experiences',
    desktopSrc: '', // Branded dark cinematic backdrop per Part 9
    mobileSrc: '',
    primaryCtaText: 'START A PROJECT',
    primaryCtaLink: '/enquiry',
    secondaryCtaText: 'EXPLORE CINEMA SLATE',
    secondaryCtaLink: '#slate',
  },
  {
    id: 'nayi-soch',
    eyebrow: '02 // FEATURED SHORT FILM',
    title: 'NAYI SOCH',
    highlightTitle: '(112)',
    description: 'An impactful short film produced by Satish Tulshiramji Mohod in collaboration with Nagpur Police, featuring Mohana Ramteke. Highlighting safety, awareness, and social transformation.',
    desktopSrc: STARGAZE_MEDIA_REGISTRY.find(m => m.id === 'nayi-soch-desktop')?.src || '',
    mobileSrc: STARGAZE_MEDIA_REGISTRY.find(m => m.id === 'nayi-soch-mobile')?.src || '',
    primaryCtaText: 'WATCH TRAILER',
    primaryCtaLink: 'https://www.youtube.com/watch?v=orangecityproductions',
    primaryCtaExternal: true,
    secondaryCtaText: 'VIEW DETAILS',
    secondaryCtaLink: '#slate',
  },
  {
    id: 'psycho',
    eyebrow: '03 // AWARD-WINNING DRAMA',
    title: 'PSYCHO',
    highlightTitle: '(SAMJO TO)',
    description: 'Produced by Satish Mohod (Orange City Production). Official selections at New Delhi Film Festival, DPIFF Awards, Lift-Off Global Network, and Mumba International Short Film Festival.',
    desktopSrc: STARGAZE_MEDIA_REGISTRY.find(m => m.id === 'psycho-desktop')?.src || '',
    mobileSrc: STARGAZE_MEDIA_REGISTRY.find(m => m.id === 'psycho-mobile')?.src || '',
    primaryCtaText: 'EXPLORE SLATE',
    primaryCtaLink: '#slate',
    secondaryCtaText: 'ENQUIRE RIGHTS',
    secondaryCtaLink: '/enquiry',
  },
  {
    id: 'saheb-vikaskari',
    eyebrow: '04 // FEATURE FILM PREMIERE',
    title: 'SAHEB VIKAS KARI',
    highlightTitle: '',
    description: 'Presented by Satish Mohod, Orange City Production. Written by Vaibhav Arjun Parab. Starring Kyra Agrawal, Satish Mohod, Shrutika Nikode, and Swapnil Bhongade.',
    desktopSrc: STARGAZE_MEDIA_REGISTRY.find(m => m.id === 'saheb-vikaskari-desktop')?.src || '',
    mobileSrc: STARGAZE_MEDIA_REGISTRY.find(m => m.id === 'saheb-vikaskari-mobile')?.src || '',
    primaryCtaText: 'VIEW PROJECT',
    primaryCtaLink: '#slate',
    secondaryCtaText: 'START ENQUIRY',
    secondaryCtaLink: '/enquiry',
  },
];

const SLIDE_DURATION = 8000; // 8 seconds

export const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentSlide = HERO_SLIDES[currentIndex];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const handleSelect = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  // Autoplay and progress timer
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // Update progress every 50ms
    const increment = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    // Pause when tab is inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-[#F4F4F0] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Cinematic Hero Banner Slider"
    >
      {/* Background Image & Cinematic Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Desktop Image */}
            <div className="absolute inset-0 hidden md:block">
              {currentSlide.desktopSrc ? (
                <StargazeImage
                  src={currentSlide.desktopSrc}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover transition-transform duration-1000"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
              )}
            </div>
            {/* Mobile / Portrait Image */}
            <div className="absolute inset-0 block md:hidden">
              {currentSlide.mobileSrc ? (
                <StargazeImage
                  src={currentSlide.mobileSrc}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/60 to-black/40 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black/90 z-10 pointer-events-none" />
        
        {/* Subtle Gold Light Streak Effect */}
        <motion.div
          key={`streak-${currentSlide.id}`}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '200%', opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#E5C158]/20 to-transparent skew-x-12 z-10 pointer-events-none"
        />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-32 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#E5C158]/15 border border-[#E5C158]/35 text-[#E5C158] font-mono text-xs tracking-widest uppercase backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 fill-[#E5C158]" />
              {currentSlide.eyebrow}
            </div>

            {/* Cinematic Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-serif-cinematic tracking-tight uppercase leading-[1.05] text-white drop-shadow-2xl">
              {currentSlide.title}{' '}
              {currentSlide.highlightTitle && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C158] via-amber-200 to-[#E5C158]">
                  {currentSlide.highlightTitle}
                </span>
              )}
            </h1>

            {/* Supporting Description */}
            <p className="text-zinc-200 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed drop-shadow">
              {currentSlide.description}
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap justify-center gap-4 font-mono text-xs">
              <a
                href={currentSlide.primaryCtaLink}
                target={currentSlide.primaryCtaExternal ? '_blank' : '_self'}
                rel={currentSlide.primaryCtaExternal ? 'noopener noreferrer' : undefined}
                data-cursor="EXPLORE"
                className="px-8 py-4 rounded-xl bg-[#E5C158] hover:bg-[#F0CE68] text-black font-bold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#E5C158]/30 flex items-center gap-2 hover:scale-105"
              >
                {currentSlide.primaryCtaText} <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={currentSlide.secondaryCtaLink}
                data-cursor="VIEW"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md flex items-center gap-2 hover:border-[#E5C158]"
              >
                {currentSlide.secondaryCtaText} <Film className="w-4 h-4 text-[#E5C158]" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Controls & Navigation Bar at Bottom */}
      <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left: Slide Counter & Progress Bars */}
          <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-start">
            {/* Counter */}
            <div className="font-mono text-sm tracking-widest text-[#E5C158] font-bold">
              0{currentIndex + 1} <span className="text-zinc-500 font-normal">/ 0{HERO_SLIDES.length}</span>
            </div>

            {/* Progress indicators */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => handleSelect(idx)}
                  className="h-1.5 rounded-full bg-white/20 w-12 sm:w-16 overflow-hidden cursor-pointer relative transition-all"
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {idx === currentIndex && (
                    <div
                      className="absolute inset-y-0 left-0 bg-[#E5C158] transition-all ease-linear"
                      style={{ width: `${progress}%`, transitionDuration: isPaused ? '0ms' : '50ms' }}
                    />
                  )}
                  {idx < currentIndex && <div className="absolute inset-0 bg-[#E5C158]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Center / Right: Cinematic Thumbnail Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleSelect(idx)}
                  className={`group relative overflow-hidden rounded-lg transition-all duration-300 text-left border ${
                    isActive
                      ? 'w-40 h-16 border-[#E5C158] shadow-lg shadow-[#E5C158]/20 scale-105'
                      : 'w-28 h-14 border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                  aria-label={`Switch to slide ${idx + 1}: ${slide.title}`}
                >
                  <div className="absolute inset-0 z-0">
                    <StargazeImage
                      src={slide.desktopSrc}
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#E5C158] font-bold">0{idx + 1}</span>
                    <span className="font-sans text-[10px] text-white font-medium truncate max-w-[70px]">
                      {slide.id === 'stargaze' ? 'STARGAZE' : slide.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Slider Arrow Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="p-3 rounded-full bg-black/60 hover:bg-[#E5C158] border border-white/20 hover:border-[#E5C158] text-white hover:text-black transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="p-3 rounded-full bg-black/60 hover:bg-[#E5C158] border border-white/20 hover:border-[#E5C158] text-white hover:text-black transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
