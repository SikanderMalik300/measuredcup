import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import {
  Section,
  Prose,
  QuickAnswer,
  Steps,
  Tips,
  Formula,
  InPagePhoto,
  ToolPageFrame,
} from '@/components/content';
import { AdSlot } from '@/components/AdSlot';
import { CupsToGramsTool } from '@/components/tools/CupsToGramsTool';
import { ComparisonTable, CupFractionsTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/cups-to-grams/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        1 cup of all-purpose flour weighs 125 g (USDA) or 120 g (King Arthur). 1 cup of granulated
        sugar is 200 g, packed brown sugar is 220 g, and butter is 227 g. Type any amount, including
        fractions like 2/3 or 1 1/2, and pick the ingredient.
      </QuickAnswer>

      <div className="mt-6">
        <CupsToGramsTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the cup amount. Fractions and mixed numbers work: 3/4, 1 1/3, 2.5.',
            'Choose the ingredient.',
            'Pick the data source if your recipe names one.',
            'Read grams and ounces, then weigh that amount on a kitchen scale.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>grams = cups × grams per cup for that ingredient</Formula>
        <Prose>
          <p>
            1 1/2 cups all-purpose flour. USDA: 1.5 × 125 = 187.5 g, shown as 188 g. King Arthur: 1.5
            × 120 = 180 g.
          </p>
          <p>
            3/4 cup packed brown sugar. USDA: 0.75 × 220 = 165 g. King Arthur: 0.75 × 213 = 159.75 g,
            shown as 160 g.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It doesn&apos;t know your brand or how you fill the cup. Sifted flour weighs less than
            spooned flour, and packed brown sugar weighs more than loose. It uses US cups (236.6 mL),
            not UK or Australian metric cups (250 mL). For liquids measured by volume, use a
            measuring jug instead.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupFractionsTable />
          <ComparisonTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'If a recipe was written in cups, the writer probably scooped. Spoon-and-level gives you less flour, so expect a slightly softer result.',
            'For 1/3 and 2/3 cup, grams are more accurate than stacking 1/4 cup and tablespoons.',
            'Ounces on this page are weight ounces, not fluid ounces.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
