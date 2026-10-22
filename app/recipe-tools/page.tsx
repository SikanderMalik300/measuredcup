import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, buildPageGraph } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { PhotoTile } from '@/components/PhotoTile';
import { Section, Prose, UpdatedLine } from '@/components/content';
import { getPage, pagesInCategory } from '@/lib/data/pages';
import { TableWrap } from '@/components/tables/Tables';

const SLUG = '/recipe-tools/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  const tools = pagesInCategory('recipe-tools');

  return (
    <div className="mx-auto max-w-container px-4 py-8 md:px-10">
      <JsonLd data={buildPageGraph(SLUG)} />
      <Breadcrumbs slug={SLUG} />
      <h1 className="mt-4">{page.h1}</h1>
      <UpdatedLine date={page.lastUpdated} />
      <Prose>
        <p className="mt-4">
          These tools change the size of a recipe. Halving 3/4 cup or tripling 1/3 cup in your head
          goes wrong easily, because US measures mix cups, tablespoons and teaspoons. The calculators
          here convert everything to teaspoons, do the multiplication, then rebuild the amount from
          standard measuring cups and spoons so you can actually measure it. Two things don&apos;t
          scale with the ingredients. Pan size: a halved cake needs a pan with about half the area, so
          a 9-inch round becomes roughly a 6 1/2-inch round, and a doubled batter needs twice the
          area. Baking time: it follows batter depth, not quantity, so keep the depth the same and
          start checking at the original time. Eggs are the other snag. A large egg weighs about 50 g
          out of the shell, so half an egg is about 25 g of beaten egg.
        </p>
      </Prose>

      <Section title="Which tool do I need?" id="which">
        <TableWrap>
          <table className="w-full border-collapse">
            <caption className="pb-2 text-left text-small text-muted">Which tool do I need?</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">You want to</th>
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Halve or double one amount', 'Half of a measurement calculator', '/half-a-measurement/'],
                ['Resize a whole recipe', 'Recipe scaler', '/recipe-scaler/'],
              ].map((r) => (
                <tr key={r[2]} className="border-b border-line">
                  <td className="px-3 py-2 text-ink">{r[0]}</td>
                  <td className="px-3 py-2">
                    <Link href={r[2]} prefetch={false} className="link">{r[1]}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Section>

      <Section id="tiles">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tools.map((t) => (
            <PhotoTile key={t.slug} href={t.slug} name={t.h1} line={t.tileLine} photoId={t.photoId} />
          ))}
        </div>
      </Section>

      {page.faq && (
        <Section>
          <Faq items={page.faq} />
        </Section>
      )}
    </div>
  );
}
