import type { Metadata } from 'next';
import { buildMetadata, buildPageGraph } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { PhotoTile } from '@/components/PhotoTile';
import { Section, Prose, UpdatedLine } from '@/components/content';
import { getPage } from '@/lib/data/pages';

const SLUG = '/data/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  const weights = getPage('/data/ingredient-weights/');
  return (
    <div className="mx-auto max-w-container px-4 py-8 md:px-10">
      <JsonLd data={buildPageGraph(SLUG)} />
      <Breadcrumbs slug={SLUG} />
      <h1 className="mt-4">{page.h1}</h1>
      <UpdatedLine date={page.lastUpdated} />
      <Prose>
        <p className="mt-4">The numbers behind every converter, with their sources.</p>
      </Prose>
      <Section id="tiles">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <PhotoTile
            href={weights.slug}
            name={weights.h1}
            line={weights.tileLine}
            photoId={weights.photoId}
          />
        </div>
      </Section>
    </div>
  );
}
