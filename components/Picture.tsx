import type { Photo } from '@/lib/data/photos';

type Variant = 'tile' | 'inline' | 'hero';

const WIDTHS: Record<Variant, number[]> = {
  tile: [300, 600],
  inline: [720],
  hero: [640, 1280],
};

/**
 * Responsive <picture> with AVIF, WebP and JPEG, explicit width and height, and a focal-point crop
 * baked in at build time. Files live under /photos/<file>-<width>.<ext>.
 */
export function Picture({
  photo,
  variant,
  width,
  height,
  sizes,
  priority = false,
  className,
}: {
  photo: Photo;
  variant: Variant;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const ws = WIDTHS[variant];
  const srcset = (ext: string) => ws.map((w) => `/photos/${photo.file}-${w}.${ext} ${w}w`).join(', ');
  const fallback = `/photos/${photo.file}-${ws[ws.length - 1]}.jpg`;
  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={fallback}
        alt={photo.alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'auto' : 'async'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={className}
        style={{ objectFit: 'cover', objectPosition: `${photo.focalX * 100}% ${photo.focalY * 100}%` }}
      />
    </picture>
  );
}
