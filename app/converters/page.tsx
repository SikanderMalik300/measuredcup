import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, breadcrumbSchema, collectionPageSchema, faqSchema } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { PhotoTile } from '@/components/PhotoTile';
import { Section, Prose } from '@/components/content';
import { getPage, pagesInCategory } from '@/lib/data/pages';
import { TableWrap } from '@/components/tables/Tables';

const SLUG = '/converters/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  const tools = pagesInCategory('converters');
  const schema: object[] = [collectionPageSchema(page), breadcrumbSchema(SLUG)];
  const faq = faqSchema(page);
  if (faq) schema.push(faq);

  return (
    <div className="mx-auto max-w-container px-4 py-8 md:px-10">
      <JsonLd data={schema} />
      <Breadcrumbs slug={SLUG} />
      <h1 className="mt-4">{page.h1}</h1>
      <Prose>
        <p className="mt-4">
          These converters turn grams into cups and back again, one ingredient at a time. The reason
          is density. A US cup holds 236.6 mL, but 236.6 mL of all-purpose flour weighs about 125 g
          while the same cup of honey weighs 339 g. A single &quot;grams to cups&quot; number
          can&apos;t be right for both. Each converter here uses two published sources: USDA FoodData
          Central, the US government&apos;s food composition database, and King Arthur Baking&apos;s
          ingredient weight chart, which reflects how their test kitchen measures. You can switch
          between them, and the page tells you when they differ by more than 3%. Not sure which tool
          to use? If your recipe lists grams and you only own cups, start with grams to cups. If it
          lists cups and you own a scale, use cups to grams. Butter has its own converter because US
          recipes count it in sticks and tablespoons.
        </p>
      </Prose>

      <Section title="Which tool do I need?" id="which">
        <TableWrap>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">Recipe says</th>
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">You have</th>
                <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['grams', 'cups', 'Grams to cups', '/grams-to-cups/'],
                ['cups', 'scale', 'Cups to grams', '/cups-to-grams/'],
                ['tablespoons', 'measuring cups', 'Tablespoons to cups', '/tablespoons-to-cups/'],
                ['tablespoons', 'scale', 'Tablespoons to grams', '/tablespoons-to-grams/'],
                ['1/8 cup', 'tablespoons', 'Tablespoons in 1/8 cup', '/tablespoons-in-1-8-cup/'],
                ['sticks or grams of butter', 'either', 'Butter converter', '/butter-converter/'],
              ].map((r) => (
                <tr key={r[3]} className="border-b border-line">
                  <td className="px-3 py-2 text-ink">{r[0]}</td>
                  <td className="px-3 py-2 text-ink">{r[1]}</td>
                  <td className="px-3 py-2">
                    <Link href={r[3]} prefetch={false} className="link">{r[2]}</Link>
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
