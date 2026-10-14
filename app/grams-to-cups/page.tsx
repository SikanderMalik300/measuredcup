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
import { GramsToCupsTool } from '@/components/tools/GramsToCupsTool';
import { ComparisonTable, GramAmountsTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/grams-to-cups/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        200 grams of all-purpose flour is 1.6 cups using USDA&apos;s 125 g per cup, or 1 2/3 cups
        using King Arthur&apos;s 120 g per cup. Sugar is heavier: 200 g of granulated sugar is
        exactly 1 cup. A cup can weigh anything from 81 g (rolled oats) to 339 g (honey), so pick
        your ingredient first.
      </QuickAnswer>

      <div className="mt-6">
        <GramsToCupsTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the weight in grams from your recipe.',
            'Choose the ingredient. Flour, sugar and butter weigh very differently per cup.',
            'Leave the data source on USDA, or switch to King Arthur if your recipe comes from a King Arthur or similar test kitchen.',
            'Read the cups, plus the leftover in tablespoons and teaspoons.',
            'For flour, spoon it into the cup and level it with a knife. Scooping straight from the bag packs in up to 20% more.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>cups = grams ÷ grams per cup for that ingredient</Formula>
        <Prose>
          <p>
            250 g all-purpose flour. USDA: 250 ÷ 125 = 2 cups exactly. King Arthur: 250 ÷ 120 = 2.08
            cups, which is 2 cups + 1 tbsp + 1 tsp. That 10 g gap is about one heaped tablespoon of
            flour, enough to change how a cookie spreads.
          </p>
          <p>
            100 g butter. 100 ÷ 227 = 0.44 cups, which is 7 tablespoons. One US stick is 113 g, so
            100 g is one stick minus about 1 tablespoon.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It doesn&apos;t know your brand or how you fill the cup. Sifted flour weighs less than
            spooned flour, and packed brown sugar weighs more than loose. It uses US cups (236.6 mL),
            not UK or Australian metric cups (250 mL). For liquids measured by volume, use a
            measuring jug instead.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <ComparisonTable />
          <GramAmountsTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            "Weigh flour when a recipe gives grams. It's the one ingredient where cup measurements drift the most.",
            'Brown sugar numbers assume packed. If your recipe says light brown sugar, packed, use the same row.',
            'Butter: 1 tablespoon is about 14 g. Counting tablespoon marks on the wrapper is faster than any cup.',
            'Sticky ingredients like honey and peanut butter: spray the cup with oil first so the full amount comes out.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
