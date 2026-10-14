import { PhotoTile } from '@/components/PhotoTile';
import { SiteSearch, type SearchItem } from '@/components/SiteSearch';
import { getPage, toolPages } from '@/lib/data/pages';
import { INGREDIENTS } from '@/lib/data/ingredients';

const TOP = ['/grams-to-cups/', '/cups-to-grams/', '/butter-converter/', '/recipe-scaler/'];

export default function NotFound() {
  const searchItems: SearchItem[] = [
    ...toolPages().map((t) => ({ label: t.h1, href: t.slug, kind: 'Tool' as const })),
    ...INGREDIENTS.map((i) => ({ label: i.name, href: '/grams-to-cups/', kind: 'Ingredient' as const })),
  ];
  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-10">
      <h1>That page isn&apos;t here</h1>
      <p className="mt-4 text-ink">Try the converters below or search for an ingredient.</p>
      <div className="mt-6 max-w-xl">
        <SiteSearch items={searchItems} />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TOP.map((slug) => {
          const t = getPage(slug);
          return <PhotoTile key={slug} href={slug} name={t.h1} line={t.tileLine} photoId={t.photoId} />;
        })}
      </div>
    </div>
  );
}
