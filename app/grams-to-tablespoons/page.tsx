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
import { GramsToTablespoonsTool } from '@/components/tools/GramsToTablespoonsTool';
import { GramsToTablespoonsChart, SpoonGramsTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/grams-to-tablespoons/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        Grams to tablespoons depends on the ingredient, because a spoonful of honey weighs almost
        three times as much as a spoonful of flour. Using USDA data, 1 tablespoon holds about 7.8 g of
        all-purpose flour, 12.5 g of sugar, 14.2 g of butter and 14.8 g of water. Divide your grams by
        that number.
      </QuickAnswer>

      <div className="mt-6">
        <GramsToTablespoonsTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the weight in grams.',
            'Choose the ingredient. Flour, sugar and butter all weigh differently per spoon.',
            'Leave the source on USDA, or switch to King Arthur for their recipes.',
            'Read the tablespoons, then the spoon combination to measure with.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          tablespoons = grams ÷ (grams per cup ÷ 16) and teaspoons = grams ÷ (grams per cup ÷ 48)
        </Formula>
        <Prose>
          <p>
            25 g of sugar. 200 ÷ 16 = 12.5 g per tablespoon. 25 ÷ 12.5 = 2 tablespoons exactly, which
            is also 1/8 cup.
          </p>
          <p>
            100 g of butter. 227 ÷ 16 = 14.19 g per tablespoon. 100 ÷ 14.19 = 7.05 tablespoons, so
            about 7 tablespoons, one less than a full stick.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It assumes level US measuring spoons (14.8 mL tablespoon, 4.9 mL teaspoon). Heaped spoons
            can hold half as much again. It covers the 23 ingredients in our dataset only, so spices,
            ground coffee, yeast and baking powder aren&apos;t included yet. Australian tablespoons are
            20 mL, a third bigger.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <GramsToTablespoonsChart />
          <SpoonGramsTable />
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
            'Level dry ingredients with a knife. A heaped tablespoon of flour can weigh 12 g instead of 7.8 g.',
            'For butter, skip the spoon. The wrapper marks tablespoons, and each one is about 14 g.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
