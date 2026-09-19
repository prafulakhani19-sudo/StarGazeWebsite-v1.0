/**
 * High-Performance Media & Image Optimization Engine for Stargaze Media
 * - Dynamic Unsplash / CDN image formatting & resolution capping
 * - WebP / AVIF auto-negotiation via CDN query params
 * - Responsive srcset generation
 * - Browser preloading & image caching memory store
 * - Client-side image compression before CMS uploads
 */

// Fallback high-speed cinematic CDN images for any missing local asset references
const LOCAL_ASSET_CDN_FALLBACKS: Record<string, string> = {
  // Hero / Work
  'nayi-soch-1920x1080.png': 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=75',
  'nayi-soch-1600x500.png': 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1600&h=500&q=75',
  'nayi-soch-1080x1350.png': 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1080&h=1350&q=75',

  'psycho-1920x1080.png': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=75',
  'psycho-1600x500.png': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&h=500&q=75',
  'psycho-1080x1350.png': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1080&h=1350&q=75',

  'saheb-vikaskari-1920x1080.png': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=75',
  'saheb-vikaskari-1600x500.png': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&h=500&q=75',
  'saheb-vikaskari-1080x1350.png': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1080&h=1350&q=75',

  'father-son-duo-1920x1080.png': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=75',
  'father-son-duo-1600x500.png': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&h=500&q=75',
  'father-son-duo-1080x1350.png': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1080&h=1350&q=75',

  // Equipment
  'arri-alexa.png': 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=75',
  'sony-venice.png': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=75',
  'ultra-primes.png': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=75',
  'optimo-zoom.png': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=75',

  // Team
  'nikhil-shirbhate.png': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=75',
  'satish-mohod.png': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=75',

  // Partners
  'orange-city-production.png': 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=400&q=75',
  'nagpur-police.png': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=75',
};

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100 (Default: 75)
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  fit?: 'crop' | 'clip' | 'max' | 'min';
}

/**
 * Optimizes an image URL for fast loading:
 * - Maps broken mock local paths to fast CDN equivalents
 * - Optimizes Unsplash query params (WebP/AVIF auto-format, size constraint, optimal compression)
 */
export function getOptimizedImageUrl(src: string, options: ImageOptimizationOptions = {}): string {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (!trimmed) return '';

  // 1. Check if it's a mock local asset path that needs CDN mapping
  for (const [filename, cdnUrl] of Object.entries(LOCAL_ASSET_CDN_FALLBACKS)) {
    if (trimmed.includes(filename)) {
      return applyUnsplashOptimization(cdnUrl, options);
    }
  }

  // 2. If it's an Unsplash URL, optimize parameters
  if (trimmed.includes('images.unsplash.com')) {
    return applyUnsplashOptimization(trimmed, options);
  }

  // 3. For local /uploads or other URLs, return as is
  return trimmed;
}

/**
 * Apply fast Unsplash optimization parameters
 */
function applyUnsplashOptimization(url: string, options: ImageOptimizationOptions): string {
  try {
    const parsed = new URL(url);
    const params = parsed.searchParams;

    // Default fast settings
    const quality = options.quality ?? 75;
    const format = options.format ?? 'auto';
    const fit = options.fit ?? 'crop';

    params.set('auto', format === 'auto' ? 'format' : format);
    params.set('fit', fit);
    params.set('q', quality.toString());

    if (options.width) {
      params.set('w', options.width.toString());
    }
    if (options.height) {
      params.set('h', options.height.toString());
    }

    return parsed.toString();
  } catch {
    // If URL parsing fails, append params safely
    const separator = url.includes('?') ? '&' : '?';
    const widthParam = options.width ? `&w=${options.width}` : '';
    const heightParam = options.height ? `&h=${options.height}` : '';
    return `${url}${separator}auto=format&fit=crop&q=${options.quality || 75}${widthParam}${heightParam}`;
  }
}

/**
 * Generate a responsive srcSet string for Unsplash and CDN URLs
 */
export function getOptimizedSrcSet(src: string, targetWidths: number[] = [480, 800, 1200, 1600, 1920]): string {
  if (!src || !src.includes('images.unsplash.com')) return '';

  return targetWidths
    .map((w) => `${getOptimizedImageUrl(src, { width: w })} ${w}w`)
    .join(', ');
}

// In-memory preloaded cache to avoid duplicate Image() construction
const preloadedCache = new Set<string>();

/**
 * Preloads an image into the browser's disk & memory cache
 */
export function preloadImage(src: string, options?: ImageOptimizationOptions): Promise<string> {
  const optimizedUrl = getOptimizedImageUrl(src, options);
  if (!optimizedUrl) return Promise.resolve('');

  if (preloadedCache.has(optimizedUrl)) {
    return Promise.resolve(optimizedUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      preloadedCache.add(optimizedUrl);
      resolve(optimizedUrl);
    };
    img.onerror = () => {
      resolve(optimizedUrl); // Still resolve to avoid blocking UI flow
    };
    img.src = optimizedUrl;
  });
}

/**
 * Preloads an array of image URLs concurrently
 */
export function preloadImages(srcs: string[], options?: ImageOptimizationOptions): Promise<string[]> {
  return Promise.all(srcs.filter(Boolean).map((src) => preloadImage(src, options)));
}

/**
 * Client-Side Image Compressor for CMS uploads
 * Compresses oversized user image uploads (e.g. 10MB raw camera photos) into fast ~250KB WebP/JPEGs
 */
export async function compressImageForUpload(
  file: File,
  maxDimension: number = 2048,
  quality: number = 0.82
): Promise<File> {
  // If not an image or already very small (< 400KB) and not a huge dimension, leave untouched
  if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
    return file;
  }

  if (file.size < 350 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled dimensions if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or fallback to JPEG
        const outputMime = 'image/webp';
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compressed blob is somehow larger or failed, return original
              resolve(file);
              return;
            }
            const compressedName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], compressedName, {
              type: outputMime,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputMime,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}
