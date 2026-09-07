import React, { useState, useEffect } from 'react';

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
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error and loading whenever the image source URL changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(Boolean(src && src.trim() !== ''));
  }, [src]);

  const computedPosition = focalPoint
    ? `${focalPoint.x}% ${focalPoint.y}%`
    : objectPosition;

  const handleError = () => {
    if (!hasError) {
      console.warn(`STARGAZE ASSET NOT FOUND: ${src}`);
      setHasError(true);
    }
    setIsLoading(false);
  };

  if (!src || src.trim() === '' || hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center ${className}`}
        style={{ objectPosition: computedPosition }}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-950 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-950 animate-pulse flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ objectPosition: computedPosition }}
      />
    </div>
  );
};
