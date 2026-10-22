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

const SLUG = '/tablespoons-in-1-4-cup/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        1/4 cup is 4 tablespoons. That&apos;s also 12 teaspoons, 2 US fluid ounces or 59.1 mL. By
        weight it depends on the ingredient: 1/4 cup of all-purpose flour is about 31.3 g, granulated
        sugar 50 g and butter 56.8 g (USDA FoodData Central).
      </QuickAnswer>

      <div className="mt-6">
        <CupFractionTool fraction={1 / 4} />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Pick the ingredient.',
            'Choose USDA, or King Arthur if your recipe comes from their kitchen.',
            'Read the grams in 1/4 cup, or measure 4 level tablespoons.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>1/4 cup = 16 ÷ 4 = 4 tablespoons and grams in 1/4 cup = grams per cup ÷ 4</Formula>
        <Prose>
          <p>
            Granulated sugar. 200 g per cup ÷ 4 = 50 g. So 4 level tablespoons of sugar weigh 50 g.
          </p>
          <p>
            Butter. 227 g per cup ÷ 4 = 56.8 g. That&apos;s half of a US stick, and 4 tablespoon marks
            on the wrapper.
          </p>
        </Prose>
      </Section>

      <Section title="How to measure 1/4 cup without a 1/4 cup measure" id="how-to-measure">
        <Prose>
          <p>No 1/4 cup in the drawer? Any of these work:</p>
        </Prose>
        <Tips
          items={[
            '4 level tablespoons, the most accurate swap.',
            '12 level teaspoons, if your tablespoon is missing.',
            'Two 1/8 cup measures, if your set has one.',
            'The 2 fl oz line on a liquid measuring cup, for liquids only.',
            'Half of a 1/2 cup, poured off by eye. Fine for liquids, less exact for flour.',
          ]}
        />
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It covers US measures only. A UK or Australian 1/4 metric cup is 62.5 mL, a little more
            than the US 59.1 mL. Weights assume level, spooned measures and typical US products, so
            packing and brands change them a little.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupFractionEquivalentsTable fraction={1 / 4} />
          <CupFractionTable fraction={1 / 4} />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            "1/3 cup is 1/4 cup + 1 tbsp + 1 tsp. That's handy when the 1/3 cup is missing.",
            'For butter, 1/4 cup is half a stick. Cut at the 4 tablespoon mark on the wrapper.',
            'Spoon flour into the cup and level it with a knife. Scooping straight from the bag packs in up to 20% more.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
