import React, { useState, useEffect, useMemo } from 'react';
import { getOptimizedImageUrl, getOptimizedSrcSet } from '../../lib/imageOptimizer';

interface StargazeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectPosition?: string;
  focalPoint?: { x: number; y: number };
  fallbackTitle?: string;
  category?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export const StargazeImage: React.FC<StargazeImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  objectPosition = 'center',
  focalPoint,
  priority = false,
  quality = 75,
  sizes,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Compute optimized URL based on width/height/quality
  const optimizedSrc = useMemo(() => {
    return getOptimizedImageUrl(src, {
      width,
      height,
      quality,
      format: 'auto',
    });
  }, [src, width, height, quality]);

  // Compute responsive srcSet if no strict fixed width is given
  const srcSet = useMemo(() => {
    if (width && width < 600) return undefined; // small thumbnails don't need large srcSet
    return getOptimizedSrcSet(src);
  }, [src, width]);

  // Reset error and loading whenever the image source URL changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(Boolean(optimizedSrc && optimizedSrc.trim() !== ''));
  }, [optimizedSrc]);

  const computedPosition = focalPoint
    ? `${focalPoint.x}% ${focalPoint.y}%`
    : objectPosition;

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
    setIsLoading(false);
  };

  if (!optimizedSrc || optimizedSrc.trim() === '' || hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center ${className}`}
        style={{ objectPosition: computedPosition }}
      >
        <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-600">
          <div className="w-3 h-3 rounded-full bg-amber-500/20" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-950 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-pulse flex items-center justify-center z-10 transition-opacity duration-300">
          <div className="w-5 h-5 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt || 'Stargaze Media'}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        // @ts-ignore - modern fetchPriority HTML attribute
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-500 ease-out ${
          isLoading ? 'opacity-0 scale-105 blur-xs' : 'opacity-100 scale-100 blur-0'
        }`}
        style={{ objectPosition: computedPosition }}
      />
    </div>
  );
};
