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
import { HalfMeasurementTool } from '@/components/tools/HalfMeasurementTool';
import { HalfThirdTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/half-a-measurement/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        Half of 3/4 cup is 1/4 cup plus 2 tablespoons (6 tablespoons). Half of 1/3 cup is 2
        tablespoons plus 2 teaspoons, and half of 1/4 cup is 2 tablespoons. Type any amount below to
        halve it, cut it to a third, or double it.
      </QuickAnswer>

      <div className="mt-6">
        <HalfMeasurementTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the amount from your recipe, for example 3/4.',
            'Pick the unit.',
            'Choose half, one third, double, or type your own factor.',
            'Measure the combination shown. It always uses standard US cups and spoons.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          Convert to teaspoons (1 cup = 48 tsp, 1 tbsp = 3 tsp), multiply by the factor, then rebuild
          the largest cups and spoons that fit, down to 1/8 teaspoon.
        </Formula>
        <Prose>
          <p>Half of 1/3 cup. 1/3 cup = 16 tsp. Half = 8 tsp = 2 tbsp (6 tsp) + 2 tsp.</p>
          <p>
            Half of 1 1/4 cups. 1 1/4 cups = 20 tbsp. Half = 10 tbsp = 1/2 cup (8 tbsp) + 2 tbsp.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It halves volume only. Eggs, pan sizes and baking times don&apos;t scale the same way. For
            half an egg, beat one large egg and use about 25 g. For a full recipe, use the recipe
            scaler.
          </p>
        </Prose>
      </Section>

      <Section title="Reference table" id="tables">
        <HalfThirdTable />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            "Most recipes tolerate small rounding, but leaveners don't. Weigh baking powder and soda when you cut a recipe to a third.",
            'Halving a cake? A 9-inch round pan has about the same area as two 6-inch rounds, not one.',
            "Write the halved amounts on the recipe before you start, so you don't slip back to the full amount mid-way.",
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
