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
import { GramsToMlTool } from '@/components/tools/GramsToMlTool';
import { GramsToMlChart } from '@/components/tables/Tables';
import { GramsToMlTable } from '@/components/tables/GramsToMlTable';
import { getPage } from '@/lib/data/pages';

const SLUG = '/grams-to-ml/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        Grams to mL is only 1 to 1 for water. Everything else depends on density: 100 g of all-purpose
        flour takes up about 189 mL, 100 g of sugar about 118 mL, 100 g of milk 97 mL and 100 g of
        honey just 70 mL (USDA FoodData Central). Pick the ingredient to get the right answer.
      </QuickAnswer>

      <div className="mt-6">
        <GramsToMlTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the weight in grams.',
            'Choose the ingredient. Light, fluffy ingredients take up much more space per gram.',
            'Leave the source on USDA, or switch to King Arthur for their recipes.',
            'Read the milliliters, plus the same amount in US cups.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>mL = grams ÷ density (g per mL) and density = grams per cup ÷ 236.6</Formula>
        <Prose>
          <p>
            250 g of all-purpose flour. Density 125 ÷ 236.6 = 0.528 g per mL. 250 ÷ 0.528 = 473.2 mL,
            which is exactly 2 US cups.
          </p>
          <p>
            50 g of honey. Density 339 ÷ 236.6 = 1.433 g per mL. 50 ÷ 1.433 = 34.9 mL, under 2 1/2
            tablespoons.
          </p>
        </Prose>
      </Section>

      <Section title="Why water is almost exactly 1 g per mL" id="why-water">
        <Prose>
          <p>
            A gram was originally defined as the mass of 1 mL of water, so for water and drinks that
            are mostly water, grams and milliliters match. The USDA figure of 237 g per cup works out
            to 1.002 g per mL, which is within rounding. Milk and cream are a touch heavier than water,
            oil is lighter, and dry ingredients like flour and cocoa are far lighter because of the air
            between the grains.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            Densities are averages for typical US products, measured the way a cup is filled. Sifted
            flour is lighter, packed brown sugar heavier. Powders not in our list, like protein powder,
            baking powder or spices, need their own density. It uses US milliliters and cups.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <GramsToMlChart />
          <GramsToMlTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'For liquids, weighing is often easier than reading a measuring jug at eye level. 240 g of milk is close to 1 cup.',
            'Light powders like cocoa and flour are where mL and grams differ most. 100 g of cocoa fills more than a cup.',
            'If a recipe lists grams, weigh it. Converting to mL and back adds rounding twice.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
