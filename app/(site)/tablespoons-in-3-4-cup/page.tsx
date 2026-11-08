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
import { CupFractionTool } from '@/components/tools/CupFractionTool';
import { CupFractionEquivalentsTable } from '@/components/tables/Tables';
import { CupFractionTable } from '@/components/tables/CupFractionTable';
import { getPage } from '@/lib/data/pages';

const SLUG = '/tablespoons-in-3-4-cup/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        3/4 cup is 12 tablespoons, which is 36 teaspoons, 6 US fluid ounces or 177.4 mL. By weight it
        depends on the ingredient: 3/4 cup of all-purpose flour is about 93.8 g, granulated sugar 150
        g and butter 170 g (USDA FoodData Central).
      </QuickAnswer>

      <div className="mt-6">
        <CupFractionTool fraction={3 / 4} />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Pick the ingredient.',
            'Choose USDA, or King Arthur if your recipe comes from their kitchen.',
            'Read the grams in 3/4 cup, or use a 1/2 cup plus a 1/4 cup.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          3/4 cup = 16 × 3 ÷ 4 = 12 tablespoons and grams in 3/4 cup = grams per cup × 3 ÷ 4
        </Formula>
        <Prose>
          <p>
            Why 12: a cup is 16 tablespoons, and three quarters of 16 is 12. No teaspoons left over,
            unlike 1/3 and 2/3 cup.
          </p>
          <p>
            Whole milk. 244 g per cup × 3 ÷ 4 = 183 g. That matches what the cups to grams converter
            gives for 3/4 cup.
          </p>
        </Prose>
      </Section>

      <Section title="How to measure 3/4 cup without a 3/4 cup measure" id="how-to-measure">
        <Prose>
          <p>No 3/4 cup? Use any of these:</p>
        </Prose>
        <Tips
          items={[
            'A 1/2 cup plus a 1/4 cup. The easiest swap.',
            'Three level 1/4 cup scoops.',
            '12 level tablespoons.',
            'For liquids, the 6 fl oz line on a measuring cup.',
            'For butter, 1 1/2 US sticks.',
          ]}
        />
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It covers US measures only. A UK or Australian 3/4 metric cup is 187.5 mL, a bit more than
            the US 177.4 mL. Weights assume level, spooned measures and typical US products, so packing
            and brands change them a little.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupFractionEquivalentsTable fraction={3 / 4} />
          <CupFractionTable fraction={3 / 4} />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            "3/4 cup is a 1/2 cup plus a 1/4 cup. Most sets don't include a 3/4 cup, so this is the usual way.",
            'For butter, 3/4 cup is 1 1/2 sticks, about 170 g.',
            'Halving a recipe that calls for 3/4 cup gives 1/4 cup plus 2 tablespoons.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
