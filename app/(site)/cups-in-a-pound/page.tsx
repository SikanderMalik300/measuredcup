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
import { PoundCupsTool } from '@/components/tools/PoundCupsTool';
import { CupsPerPoundTable, PoundsToCupsChart, BagSizesTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/cups-in-a-pound/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        It depends on the ingredient, because a pound is a weight and a cup is a volume. A pound of
        all-purpose flour is about 3 2/3 cups (3.63), granulated sugar about 2 1/4 cups (2.27),
        powdered sugar about 3 3/4 cups (3.78), and butter exactly 2 cups, or 4 sticks. A pound of
        water is about 1.9 cups (USDA FoodData Central).
      </QuickAnswer>

      <div className="mt-6">
        <PoundCupsTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the pounds. Fractions like 1/2 work.',
            'Pick the ingredient, and USDA or King Arthur.',
            'Read the cups, or the cup and spoon measure underneath.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>cups = pounds × 453.6 ÷ grams per cup</Formula>
        <Prose>
          <p>
            The cups in a pound equal the tablespoons in an ounce of the same ingredient, since both
            are 16 to 1.
          </p>
          <p>
            A 5 lb bag of all-purpose flour. 5 × 453.6 ÷ 125 = 18.1 cups, enough for about 8 loaves at
            2 1/4 cups each.
          </p>
          <p>A 2 lb bag of powdered sugar. 2 × 453.6 ÷ 120 = 7.56 cups, a little over 7 1/2 cups.</p>
        </Prose>
      </Section>

      <Section title="Common bag sizes" id="bags">
        <Prose>
          <p>How many cups are in the bag you just bought:</p>
        </Prose>
        <div className="mt-6">
          <BagSizesTable />
        </div>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It uses average weights for level, spooned cups of typical US products. Sifted flour and
            powdered sugar are lighter, so a pound fills more cups; packed or settled ingredients fill
            fewer. For liquids by volume, use cups in a quart or cups in a liter.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupsPerPoundTable />
          <PoundsToCupsChart />
          <p className="text-small text-muted">
            Butter shows 9.99 cups for 5 lb because USDA lists 227 g per cup; by the stick convention
            it&apos;s exactly 10 cups.
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
            'Icing sugar, powdered sugar and confectioners sugar are the same thing: about 3 3/4 cups per pound, unsifted.',
            'A pound of butter is 4 sticks, 2 cups or 32 tablespoons.',
            "If you weigh flour, you don't need the cup math at all. 1 lb is 453.6 g.",
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
