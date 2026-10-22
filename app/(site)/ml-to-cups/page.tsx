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
import { CupsMlTool } from '@/components/tools/CupsMlTool';
import { MlToCupsChart, CupSizesTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/ml-to-cups/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        Divide milliliters by 236.6 to get US cups. 250 mL is 1.06 US cups, 100 mL is about 0.42 cups
        and 500 mL is 2.11 cups. With a metric cup it&apos;s simpler: divide by 250, so 250 mL is
        exactly 1 cup.
      </QuickAnswer>

      <div className="mt-6">
        <CupsMlTool direction="mlToCups" />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the milliliters.',
            "Pick the cup type you'll measure with.",
            'Read the cups, then the cup-and-spoon combination to measure with.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>cups = mL ÷ 236.6 (US cup) and cups = mL ÷ 250 (metric cup)</Formula>
        <Prose>
          <p>
            200 mL of milk. 200 ÷ 236.6 = 0.845 US cups, which is 3/4 cup + 1 tbsp + 1 1/2 tsp. In
            metric cups it&apos;s 0.8 cups.
          </p>
          <p>A 500 mL carton of cream. 500 ÷ 236.6 = 2.11 US cups, so just over 2 cups.</p>
        </Prose>
      </Section>

      <Section title="Which cup does your recipe use?" id="which-cup">
        <Prose>
          <p>
            A US cup in a recipe is 236.6 mL, defined in US customary units. US nutrition labels round
            it to 240 mL. UK, Australian, New Zealand and Canadian recipes usually mean a metric cup of
            250 mL, about 6% more than a US cup. Older Japanese recipes may use a 200 mL cup. If a
            recipe comes from outside the US, switch the cup type above.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It converts volume only. 100 mL of flour and 100 mL of honey weigh very different amounts;
            use grams to mL with the ingredient for weight. Spoon-sized amounts under 30 mL are easier
            in tablespoons: 15 mL is 1 tablespoon.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <MlToCupsChart />
          <CupSizesTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            '15 mL is 1 US tablespoon and 5 mL is 1 teaspoon, close enough for any recipe.',
            'A 250 mL measuring cup from Australia or the UK holds about 1 tablespoon more than a US cup.',
            'For drinks and soups, 240 mL and 250 mL are interchangeable. For baking, use the cup your recipe was written for.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
