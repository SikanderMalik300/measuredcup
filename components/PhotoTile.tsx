import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Picture } from './Picture';
import { findPhoto } from '@/lib/data/photos';

/** A tile is a single link: square photo, name with inline arrow, one muted line. */
export function PhotoTile({
  href,
  name,
  line,
  photoId,
}: {
  href: string;
  name: string;
  line?: string;
  photoId?: string;
}) {
  const photo = findPhoto(photoId);
  return (
    <Link
      href={href}
      prefetch={false}
      className="group block rounded-card border border-line bg-surface p-3 transition-colors hover:border-brand"
    >
      {photo && (
        <div className="overflow-hidden rounded-photo">
          <div className="aspect-square">
            <Picture
              photo={photo}
              variant="tile"
              width={600}
              height={600}
              sizes="(max-width: 767px) 45vw, 280px"
              className="tile-photo h-full w-full transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      )}
      <div className="mt-3">
        <span className="inline-flex items-center gap-1 font-medium text-ink group-hover:underline">
          {name}
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" className="text-brand" />
        </span>
        {line && <p className="mt-1 text-small text-muted">{line}</p>}
      </div>
    </Link>
  );
}
