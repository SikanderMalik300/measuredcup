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

const SLUG = '/tablespoons-in-1-2-cup/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        1/2 cup is 8 tablespoons, which is 24 teaspoons, 4 US fluid ounces or about 118.3 mL. By
        weight it depends on the ingredient: 1/2 cup of all-purpose flour is about 62.5 g, granulated
        sugar 100 g and butter about 113 g, one US stick (USDA FoodData Central).
      </QuickAnswer>

      <div className="mt-6">
        <CupFractionTool fraction={1 / 2} />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Pick the ingredient.',
            'Choose USDA, or King Arthur if your recipe comes from their kitchen.',
            'Read the grams in 1/2 cup, or count out 8 level tablespoons.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          1/2 cup = 16 ÷ 2 = 8 tablespoons and grams in 1/2 cup = grams per cup ÷ 2
        </Formula>
        <Prose>
          <p>
            Butter. 1/2 cup is 8 tablespoons, which is exactly one US stick. USDA&apos;s 227 g per cup
            gives 113.5 g; the stick wrapper says 113 g (4 oz).
          </p>
          <p>
            Whole milk. 244 g per cup ÷ 2 = 122 g, which matches the cups to grams converter for 1/2
            cup.
          </p>
        </Prose>
      </Section>

      <Section title="How to measure 1/2 cup without a 1/2 cup measure" id="how-to-measure">
        <Prose>
          <p>No 1/2 cup? Use any of these:</p>
        </Prose>
        <Tips
          items={[
            'Two level 1/4 cup scoops. The easiest swap.',
            '8 level tablespoons.',
            '1/3 cup plus 2 tablespoons plus 2 teaspoons.',
            'For liquids, the 4 fl oz line on a measuring cup.',
            'For butter, one US stick. The wrapper marks all 8 tablespoons.',
          ]}
        />
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It covers US measures only. A UK or Australian 1/2 metric cup is 125 mL, a little more
            than the US 118.3 mL. Weights assume level, spooned measures and typical US products, so
            packing and brands change them a little.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupFractionEquivalentsTable fraction={1 / 2} />
          <CupFractionTable fraction={1 / 2} />
          <p className="text-small text-muted">
            Butter shows 114 g because USDA lists 227 g per cup. A US stick is labeled 113 g (4 oz);
            the 1 g gap is rounding.
          </p>
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            '1/2 cup of butter is one stick. No measuring cup needed.',
            'Halving a recipe that calls for 1 cup? Use 1/2 cup, or 8 tablespoons.',
            'Halving 1/2 cup gives 1/4 cup, which is 4 tablespoons.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
