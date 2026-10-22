import type { Metadata } from 'next';
import { buildMetadata, buildPageGraph } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { Sources } from '@/components/Sources';
import { DownloadCsv } from '@/components/DownloadCsv';
import { Section, Prose, QuickAnswer, UpdatedLine } from '@/components/content';
import { DataTable } from '@/components/tables/DataTable';
import { getPage } from '@/lib/data/pages';

const SLUG = '/data/ingredient-weights/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);

  return (
    <div className="mx-auto max-w-container px-4 py-8 md:px-10">
      <JsonLd data={buildPageGraph(SLUG)} />
      <Breadcrumbs slug={SLUG} />
      <h1 className="mt-4">{page.h1}</h1>
      <UpdatedLine date={page.lastUpdated} />

      <QuickAnswer>
        Most baking ingredients weigh within 5% of each other in USDA and King Arthur data, but bread
        and cake flour, cornstarch, oil, oats, milk, rice and powdered sugar differ by 6% to 13%. USDA
        lists all-purpose flour at 125 g per cup and bread flour at 137 g; King Arthur uses 120 g for
        both. The full table and a CSV are below.
      </QuickAnswer>

      <div className="mt-6 flex flex-col gap-2">
        <DownloadCsv href="/data/ingredient-weights.csv" />
        <p className="text-small text-muted">
          Free to reuse with a link to MeasuredCup (CC BY 4.0). USDA data is public domain.
        </p>
      </div>

      <Section id="table">
        <DataTable />
      </Section>

      <Section title="How we built this table" id="how-built">
        <Prose>
          <p>
            USDA values come from the FoodData Central SR Legacy release, using each food&apos;s
            household portion for 1 cup. King Arthur values come from their published ingredient
            weight chart; where they list 1/2 cup or 1/4 cup, we multiplied up to a full cup.
            Tablespoon and teaspoon figures are the cup weight divided by 16 and 48.
          </p>
        </Prose>
      </Section>

      <Section title="Why the sources disagree" id="why-disagree">
        <Prose>
          <p>
            USDA portions describe a standard household cup. Test kitchens weigh the way their own
            recipes are written, often spooning flour lightly into the cup. Liquids differ for a
            different reason: King Arthur rounds milk and cream to 8 ounces per cup, while USDA weighs
            the liquid itself, which is denser than water.
          </p>
        </Prose>
      </Section>

      <Section title="What this page doesn't cover" id="not-covered">
        <Prose>
          <p>
            It doesn&apos;t cover individual brands yet. Our next update adds weights from US nutrition
            labels, which list a serving in both cups and grams.
          </p>
        </Prose>
      </Section>

      <Section>
        <Sources sources={page.sources} />
      </Section>

      {page.faq && (
        <Section>
          <Faq items={page.faq} />
        </Section>
      )}
    </div>
  );
}
