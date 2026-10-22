import { Breadcrumbs } from './Breadcrumbs';
import { JsonLd } from './JsonLd';
import { UpdatedLine } from './content';
import { buildPageGraph } from '@/lib/seo';
import { getPage } from '@/lib/data/pages';

export function TrustFrame({
  slug,
  showUpdated = false,
  children,
}: {
  slug: string;
  showUpdated?: boolean;
  children: React.ReactNode;
}) {
  const page = getPage(slug);
  return (
    <div className="mx-auto max-w-trust px-4 py-8 md:px-10">
      <JsonLd data={buildPageGraph(slug)} />
      <Breadcrumbs slug={slug} />
      <h1 className="mt-4">{page.h1}</h1>
      {showUpdated && <UpdatedLine date={page.lastUpdated} />}
      <div className="prose-measure mt-4 space-y-4 text-ink">{children}</div>
    </div>
  );
}
