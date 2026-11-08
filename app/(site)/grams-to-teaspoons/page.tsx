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
import { GramsToTeaspoonsTool } from '@/components/tools/GramsToTeaspoonsTool';
import {
  GramsToTeaspoonsChart,
  TeaspoonsToGramsChart,
  GramsPerTeaspoonTable,
} from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/grams-to-teaspoons/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        Grams to teaspoons depends on the ingredient, because a teaspoon of salt weighs more than
        twice as much as a teaspoon of flour. Using USDA data, 1 US teaspoon holds about 2.6 g of
        all-purpose flour, 4.2 g of granulated sugar, 4.7 g of butter, 6.1 g of table salt and 4.9 g
        of water. Divide your grams by that number. So 5 g of sugar is 1.2 teaspoons.
      </QuickAnswer>

      <div className="mt-6">
        <GramsToTeaspoonsTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the weight in grams, or switch to teaspoons to go the other way.',
            'Choose the ingredient. Sugar, flour and salt all weigh differently per spoon.',
            'Leave the source on USDA, or switch to King Arthur for their recipes.',
            'Read the teaspoons, then the spoon combination to measure with.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          teaspoons = grams ÷ (grams per cup ÷ 48) and grams = teaspoons × grams per cup ÷ 48
        </Formula>
        <Prose>
          <p>
            10 g of sugar. 200 ÷ 48 = 4.17 g per teaspoon. 10 ÷ 4.17 = 2.4 teaspoons, so 2 teaspoons
            plus a scant 1/2 teaspoon.
          </p>
          <p>
            1 teaspoon of table salt. 292 ÷ 48 = 6.08 g. That&apos;s why recipes that list salt in
            grams use small numbers.
          </p>
        </Prose>
      </Section>

      <Section title="Is 1 teaspoon 5 grams?" id="is-5-grams">
        <Prose>
          <p>
            Only for water-like liquids. A US teaspoon holds 4.93 mL, so a teaspoon of water weighs
            about 4.9 g, close to 5. Flour weighs about half that, and honey about 7 g. The 5 g figure
            is a good guess for liquids and a poor one for dry ingredients.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It assumes level US measuring spoons (4.93 mL per teaspoon). Heaped spoons can hold half as
            much again. It covers the 23 ingredients in our dataset only, so baking powder, yeast and
            spices aren&apos;t included yet. Kosher salt is lighter per spoon than table salt.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <GramsToTeaspoonsChart />
          <TeaspoonsToGramsChart />
          <GramsPerTeaspoonTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'Under 5 g, a scale that reads in 0.1 g steps beats any spoon. Most kitchen scales only read whole grams.',
            'Level dry ingredients with a knife. A heaped teaspoon can hold half as much again.',
            'Salt brands differ a lot. Kosher salt flakes weigh less per spoon than fine table salt, so weigh it when you can.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
