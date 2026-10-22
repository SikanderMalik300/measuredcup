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

const SLUG = '/tablespoons-in-2-3-cup/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        2/3 cup is 10 tablespoons plus 2 teaspoons, which is 32 teaspoons, about 5.33 US fluid ounces
        or 157.7 mL. By weight it depends on the ingredient: 2/3 cup of all-purpose flour is about 83.3
        g, granulated sugar 133 g and butter 151 g (USDA FoodData Central).
      </QuickAnswer>

      <div className="mt-6">
        <CupFractionTool fraction={2 / 3} />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Pick the ingredient.',
            'Choose USDA, or King Arthur if your recipe comes from their kitchen.',
            'Read the grams in 2/3 cup, or use two level 1/3 cup scoops.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          2/3 cup = 16 × 2 ÷ 3 = 10 2/3 tablespoons = 10 tbsp + 2 tsp and grams in 2/3 cup = grams per
          cup × 2 ÷ 3
        </Formula>
        <Prose>
          <p>
            Why 2 teaspoons: 2/3 of a tablespoon is 2 teaspoons, because a tablespoon holds 3. So 2/3
            cup is 10 tablespoons with 2 teaspoons left over.
          </p>
          <p>
            Whole milk. 244 g per cup × 2 ÷ 3 = 162.7 g, shown as 163 g. That matches what the cups to
            grams converter gives for 2/3 cup.
          </p>
        </Prose>
      </Section>

      <Section title="How to measure 2/3 cup without a 2/3 cup measure" id="how-to-measure">
        <Prose>
          <p>No 2/3 cup? Use any of these:</p>
        </Prose>
        <Tips
          items={[
            'Two level 1/3 cup scoops. The easiest swap.',
            '1/2 cup plus 2 tablespoons plus 2 teaspoons.',
            '10 level tablespoons plus 2 level teaspoons.',
            'For liquids, a little above the 5 fl oz line on a measuring cup (2/3 cup is 5.33 fl oz).',
            'Not 2 1/2 quarter cups. Two 1/4 cups plus 2 tablespoons and 2 teaspoons is right, because 2/3 cup is 2 2/3 quarter cups.',
          ]}
        />
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It covers US measures only. A UK or Australian 2/3 metric cup is about 166.7 mL, a bit more
            than the US 157.7 mL. Weights assume level, spooned measures and typical US products, so
            packing and brands change them a little.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupFractionEquivalentsTable fraction={2 / 3} />
          <CupFractionTable fraction={2 / 3} />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            '2/3 cup is two 1/3 cups. If you own a 1/3 cup, use it twice.',
            'For butter, 2/3 cup is 1 stick plus 2 tablespoons and 2 teaspoons, about 151 g.',
            'Halving a recipe that calls for 2/3 cup gives exactly 1/3 cup.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
