import { Breadcrumbs } from './Breadcrumbs';
import { JsonLd } from './JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import { getPage } from '@/lib/data/pages';

export function TrustFrame({
  slug,
  extraSchema,
  children,
}: {
  slug: string;
  extraSchema?: object[];
  children: React.ReactNode;
}) {
  const page = getPage(slug);
  const schema: object[] = [breadcrumbSchema(slug), ...(extraSchema ?? [])];
  return (
    <div className="mx-auto max-w-trust px-4 py-8 md:px-10">
      <JsonLd data={schema} />
      <Breadcrumbs slug={slug} />
      <h1 className="mt-4">{page.h1}</h1>
      <div className="prose-measure mt-4 space-y-4 text-ink">{children}</div>
    </div>
  );
}
