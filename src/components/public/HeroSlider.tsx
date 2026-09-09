import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STARGAZE_MEDIA_REGISTRY } from '../../data/media';
import { StargazeImage } from '../common/StargazeImage';
import { getMediaForSlot, resolveMediaById } from '../../lib/mediaResolver';
import { getHeroSlides } from '../../lib/cmsService';

export interface HeroSlideData {
  id: string;
  title: string;
  desktopSrc: string;
  mobileSrc: string;
  desktopFocalPoint?: { x: number; y: number };
  mobileFocalPoint?: { x: number; y: number };
  desktopMediaId?: string;
  mobileMediaId?: string;
}

const INITIAL_HERO_SLIDES: HeroSlideData[] = [
  {
    id: 'nayi-soch',
    title: 'Nayi Soch (112)',
    desktopSrc: STARGAZE_MEDIA_REGISTRY.find((m) => m.id === 'nayi-soch-desktop')?.src || '/assets/stargaze/hero/nayi-soch-1920x1080.png',
    mobileSrc: STARGAZE_MEDIA_REGISTRY.find((m) => m.id === 'nayi-soch-mobile')?.src || '/assets/stargaze/work/nayi-soch-1080x1350.png',
  },
  {
    id: 'psycho',
    title: 'Psycho (Samjo To)',
    desktopSrc: STARGAZE_MEDIA_REGISTRY.find((m) => m.id === 'psycho-desktop')?.src || '/assets/stargaze/hero/psycho-1920x1080.png',
    mobileSrc: STARGAZE_MEDIA_REGISTRY.find((m) => m.id === 'psycho-mobile')?.src || '/assets/stargaze/work/psycho-1080x1350.png',
  },
  {
    id: 'saheb-vikaskari',
    title: 'Saheb Vikas Kari',
    desktopSrc: STARGAZE_MEDIA_REGISTRY.find((m) => m.id === 'saheb-vikaskari-desktop')?.src || '/assets/stargaze/hero/saheb-vikaskari-1920x1080.png',
    mobileSrc: STARGAZE_MEDIA_REGISTRY.find((m) => m.id === 'saheb-vikaskari-mobile')?.src || '/assets/stargaze/work/saheb-vikaskari-1080x1350.png',
  },
  {
    id: 'father-son',
    title: 'Father & Son Duo',
    desktopSrc: STARGAZE_MEDIA_REGISTRY.find((m) => m.id === 'father-son-desktop')?.src || '/assets/stargaze/hero/father-son-duo-1920x1080.png',
    mobileSrc: STARGAZE_MEDIA_REGISTRY.find((m) => m.id === 'father-son-mobile')?.src || '/assets/stargaze/events/father-son-duo-1080x1350.png',
  },
  {
    id: 'stargaze-flagship',
    title: 'Stargaze Cinematic Studios',
    desktopSrc: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&h=1080&q=85',
    mobileSrc: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1080&h=1350&q=85',
  },
];

const SLIDE_DURATION = 6000; // 6 seconds per slide

export const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlideData[]>(INITIAL_HERO_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    async function resolveHeroMedia() {
      let baseSlides: HeroSlideData[] = INITIAL_HERO_SLIDES;
      try {
        const cmsSlides = await getHeroSlides();
        if (cmsSlides && cmsSlides.length > 0) {
          baseSlides = cmsSlides.map((s) => ({
            id: s.id,
            title: s.title,
            desktopSrc: s.desktopSrc,
            mobileSrc: s.mobileSrc,
            desktopFocalPoint: s.desktopFocalPoint,
            mobileFocalPoint: s.mobileFocalPoint,
            desktopMediaId: s.desktopMediaId,
            mobileMediaId: s.mobileMediaId,
          }));
        }
      } catch (err) {
        console.warn('Using default hero slides:', err);
      }

      const resolvedSlides = await Promise.all(
        baseSlides.map(async (slide) => {
          let finalDesktopSrc = slide.desktopSrc;
          let finalMobileSrc = slide.mobileSrc;
          let finalDesktopFocalPoint = slide.desktopFocalPoint;
          let finalMobileFocalPoint = slide.mobileFocalPoint;

          // 1. Resolve explicit media IDs if defined on the slide
          if (slide.desktopMediaId) {
            const res = await resolveMediaById(slide.desktopMediaId);
            if (res && res.url) {
              finalDesktopSrc = res.url;
              finalDesktopFocalPoint = res.focalPoint || slide.desktopFocalPoint;
            }
          }
          if (slide.mobileMediaId) {
            const res = await resolveMediaById(slide.mobileMediaId);
            if (res && res.url) {
              finalMobileSrc = res.url;
              finalMobileFocalPoint = res.focalPoint || slide.mobileFocalPoint;
            }
          }

          // 2. If no explicit media ID, resolve slot fallbacks
          if (!slide.desktopMediaId && !finalDesktopSrc) {
            const slotName = slide.id === 'nayi-soch'
              ? 'nayiSoch'
              : slide.id === 'psycho'
              ? 'psycho'
              : slide.id === 'saheb-vikaskari'
              ? 'sahebVikaskari'
              : 'fatherSon';
            const desktopSlot = `hero.${slotName}.desktop`;
            const resDesktop = await getMediaForSlot(desktopSlot, slide.desktopSrc);
            finalDesktopSrc = resDesktop.url || slide.desktopSrc;
            finalDesktopFocalPoint = resDesktop.focalPoint || slide.desktopFocalPoint;
          }

          if (!slide.mobileMediaId && !finalMobileSrc) {
            const slotName = slide.id === 'nayi-soch'
              ? 'nayiSoch'
              : slide.id === 'psycho'
              ? 'psycho'
              : slide.id === 'saheb-vikaskari'
              ? 'sahebVikaskari'
              : 'fatherSon';
            const mobileSlot = `hero.${slotName}.mobile`;
            const resMobile = await getMediaForSlot(mobileSlot, slide.mobileSrc);
            finalMobileSrc = resMobile.url || slide.mobileSrc;
            finalMobileFocalPoint = resMobile.focalPoint || slide.mobileFocalPoint;
          }

          return {
            ...slide,
            desktopSrc: finalDesktopSrc || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&h=1080&q=85',
            mobileSrc: finalMobileSrc || finalDesktopSrc || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1080&h=1350&q=85',
            desktopFocalPoint: finalDesktopFocalPoint,
            mobileFocalPoint: finalMobileFocalPoint,
          };
        })
      );
      setSlides(resolvedSlides);
    }
    resolveHeroMedia();
  }, []);

  const safeSlides = slides.length > 0 ? slides : INITIAL_HERO_SLIDES;
  const currentSlide = safeSlides[currentIndex] || safeSlides[0];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
    setProgress(0);
  }, [safeSlides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
    setProgress(0);
  }, [safeSlides.length]);

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
      className="group relative w-full pt-20 md:pt-24 bg-white overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Image Banner Slider"
    >
      {/* Aspect Ratio Container for Banner - Clean & Crystal Clear */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] max-h-[82vh] overflow-hidden bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: 6.0, ease: 'easeOut' },
            }}
            className="absolute inset-0 w-full h-full will-change-[opacity,transform]"
          >
            {/* Desktop Image */}
            <div className="absolute inset-0 hidden sm:block w-full h-full">
              <StargazeImage
                src={currentSlide.desktopSrc}
                alt={currentSlide.title || 'Banner Slide'}
                focalPoint={currentSlide.desktopFocalPoint}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Mobile / Portrait Image */}
            <div className="absolute inset-0 block sm:hidden w-full h-full">
              <StargazeImage
                src={currentSlide.mobileSrc || currentSlide.desktopSrc}
                alt={currentSlide.title || 'Banner Slide'}
                focalPoint={currentSlide.mobileFocalPoint || currentSlide.desktopFocalPoint}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Visible on hover on desktop, always accessible on touch) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-white text-zinc-900 border border-zinc-200 shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-white text-zinc-900 border border-zinc-200 shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Minimalist Slide Progress Bar & Indicators at Bottom */}
        <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 pointer-events-auto">
            {safeSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => handleSelect(idx)}
                className={`h-2 rounded-full transition-all duration-300 relative overflow-hidden ${
                  idx === currentIndex ? 'w-8 bg-white/40' : 'w-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {idx === currentIndex && (
                  <div
                    className="absolute inset-y-0 left-0 bg-[#D97706] transition-all ease-linear rounded-full"
                    style={{
                      width: `${progress}%`,
                      transitionDuration: isPaused ? '0ms' : '50ms',
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

