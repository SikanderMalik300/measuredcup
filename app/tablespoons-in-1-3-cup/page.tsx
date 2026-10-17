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

const SLUG = '/tablespoons-in-1-3-cup/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        1/3 cup is 5 tablespoons plus 1 teaspoon, which is 16 teaspoons, about 2.67 US fluid ounces or
        78.9 mL. By weight it depends on the ingredient: 1/3 cup of all-purpose flour is about 41.7 g,
        granulated sugar 66.7 g and butter 75.7 g (USDA FoodData Central).
      </QuickAnswer>

      <div className="mt-6">
        <CupFractionTool fraction={1 / 3} />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Pick the ingredient.',
            'Choose USDA, or King Arthur if your recipe comes from their kitchen.',
            'Read the grams in 1/3 cup, or measure 5 level tablespoons plus 1 level teaspoon.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          1/3 cup = 16 ÷ 3 = 5 1/3 tablespoons = 5 tbsp + 1 tsp and grams in 1/3 cup = grams per cup ÷ 3
        </Formula>
        <Prose>
          <p>
            Why the extra teaspoon: a tablespoon is 3 teaspoons, so the leftover 1/3 tablespoon is
            exactly 1 teaspoon. That&apos;s why 1/3 cup never comes out to a whole number of
            tablespoons.
          </p>
          <p>
            Granulated sugar. 200 g per cup ÷ 3 = 66.7 g. Five level tablespoons of sugar are 62.5 g,
            and the extra teaspoon adds the last 4.2 g.
          </p>
        </Prose>
      </Section>

      <Section title="How to measure 1/3 cup without a 1/3 cup measure" id="how-to-measure">
        <Prose>
          <p>Missing the 1/3 cup? These all land on the same amount:</p>
        </Prose>
        <Tips
          items={[
            '5 level tablespoons plus 1 level teaspoon.',
            "16 level teaspoons, if you're patient.",
            '1/4 cup plus 1 tablespoon plus 1 teaspoon.',
            'Half of a 2/3 cup measure, poured off by eye. Fine for liquids, less exact for flour.',
            'For liquids, a little under the 3 fl oz line on a measuring cup (1/3 cup is 2.67 fl oz).',
          ]}
        />
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It covers US measures only. A UK or Australian 1/3 metric cup is about 83.3 mL, a bit more
            than the US 78.9 mL. Weights assume level, spooned measures and typical US products, so
            packing and brands change them a little.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupFractionEquivalentsTable fraction={1 / 3} />
          <CupFractionTable fraction={1 / 3} />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            '2/3 cup is double: 10 tablespoons plus 2 teaspoons.',
            'For butter, 1/3 cup is 5 tablespoon marks plus a thin slice, about 75 g.',
            "When a recipe uses 1/3 cup of flour three times, use one full cup instead. It's faster and more accurate.",
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
