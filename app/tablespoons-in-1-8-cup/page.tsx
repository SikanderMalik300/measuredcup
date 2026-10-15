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
import { EighthCupTool } from '@/components/tools/EighthCupTool';
import { EighthCupEquivalentsTable } from '@/components/tables/Tables';
import { EighthCupTable } from '@/components/tables/EighthCupTable';
import { getPage } from '@/lib/data/pages';

const SLUG = '/tablespoons-in-1-8-cup/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        1/8 cup is 2 tablespoons. That&apos;s also 6 teaspoons, 1 US fluid ounce or 29.6 mL. By weight
        it depends on the ingredient: 1/8 cup of all-purpose flour is about 15.6 g, granulated sugar
        25 g and butter 28.4 g (USDA FoodData Central).
      </QuickAnswer>

      <div className="mt-6">
        <EighthCupTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Pick the ingredient.',
            'Choose USDA, or King Arthur if your recipe comes from their kitchen.',
            'Read the grams in 1/8 cup, or just use 2 level tablespoons.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>1/8 cup = 16 ÷ 8 = 2 tablespoons and grams in 1/8 cup = grams per cup ÷ 8</Formula>
        <Prose>
          <p>
            Granulated sugar. 200 g per cup ÷ 8 = 25 g. So 2 level tablespoons of sugar weigh about 25
            g.
          </p>
          <p>
            Honey. 339 g per cup ÷ 8 = 42.4 g. Honey weighs nearly three times as much as the same
            spoonful of flour, which is why sticky ingredients are worth weighing.
          </p>
        </Prose>
      </Section>

      <Section title="How to measure 1/8 cup without a 1/8 cup measure" id="how-to-measure">
        <Prose>
          <p>Most US measuring cup sets stop at 1/4 cup, so use spoons instead:</p>
        </Prose>
        <Tips
          items={[
            '2 level tablespoons, the most accurate option.',
            '6 level teaspoons, if your tablespoon is missing.',
            'Half of a 1/4 cup. Fill the 1/4 cup and pour off half by eye. Fine for liquids, less exact for flour.',
            'The 1 fl oz line on a liquid measuring cup or a shot glass marked in ounces, for liquids only.',
            'A coffee scoop, if yours is marked 2 tablespoons. Many are, but sizes vary, so check before you rely on it.',
          ]}
        />
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It covers US measures only. A UK or Australian 1/8 metric cup is 31.25 mL, slightly more
            than the US 29.6 mL. Weights assume level spoons and typical US products, so brands and
            packing change them a little.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <EighthCupEquivalentsTable />
          <EighthCupTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'For butter, 1/8 cup is a quarter of a stick: 2 tablespoon marks on the wrapper.',
            'Spoon flour into the tablespoon and level it with a knife. Scooping packs it and adds up to 20%.',
            'For oil and other liquids, a 1 fl oz shot glass with a line is quicker than two spoons.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
