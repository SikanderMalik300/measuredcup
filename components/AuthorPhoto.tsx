// Author headshot: AVIF/WebP with a JPEG fallback, square, lazy, fixed dimensions (no CLS).
export function AuthorPhoto({ size = 40 }: { size?: number }) {
  const sizes = `${size}px`;
  const srcset = (ext: string) =>
    `/photos/sikander-malik-96.${ext} 96w, /photos/sikander-malik-192.${ext} 192w`;
  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src="/photos/sikander-malik-96.jpg"
        srcSet={srcset('jpg')}
        sizes={sizes}
        alt="Sikander Malik"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="shrink-0 rounded-full"
        style={{ width: size, height: size, objectFit: 'cover' }}
      />
    </picture>
  );
}
