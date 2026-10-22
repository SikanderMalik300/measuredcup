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
import { CupsToMlChart, CupSizesTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/cups-to-ml/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        1 US cup is 236.6 mL, so multiply cups by 236.6 to get milliliters. 1/2 cup is 118.3 mL and
        1/4 cup is 59.1 mL. If your recipe is from the UK, Australia or Canada it probably uses a 250
        mL metric cup, so 1 cup there is 250 mL.
      </QuickAnswer>

      <div className="mt-6">
        <CupsMlTool direction="cupsToMl" />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the cup amount. Fractions like 2/3 or 1 1/2 work.',
            'Pick the cup type. Leave it on US cup for American recipes.',
            'Read the milliliters, plus tablespoons and fluid ounces.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>mL = cups × 236.6 (US cup) and mL = cups × 250 (metric cup)</Formula>
        <Prose>
          <p>
            3/4 cup of milk. 0.75 × 236.6 = 177.4 mL. With an Australian 250 mL cup it would be 187.5
            mL.
          </p>
          <p>2 1/2 cups of stock. 2.5 × 236.6 = 591.5 mL, a little over half a liter.</p>
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
            It converts volume only. A cup of flour and a cup of honey are both 236.6 mL but weigh very
            different amounts; use cups to grams for weight. It doesn&apos;t cover UK imperial cups
            from old British cookbooks (about 284 mL).
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupsToMlChart />
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
            'For liquids, a jug marked in mL is more accurate than filling a cup to the brim.',
            '4 US cups is 946 mL, a little under a liter. 4 metric cups is exactly 1 liter.',
            'When a recipe gives both cups and grams, trust the grams.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
