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
import { LiquidVolumeTool } from '@/components/tools/LiquidVolumeTool';
import { QuartsToCupsChart, ThreeQuartsTable, QuartWeightTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/cups-in-a-quart/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        There are 4 cups in a US quart. A quart is also 2 pints, 32 fluid ounces or 946 mL, and 4
        quarts make a gallon. One exception: a dry quart, the basket berries are sold in, is bigger
        and holds about 4.65 cups.
      </QuickAnswer>

      <div className="mt-6">
        <LiquidVolumeTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the amount. Fractions like 1 1/2 work.',
            "Choose the unit you're starting from.",
            'Read cups first, then every other unit underneath.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>cups = quarts × 4 and quarts = cups ÷ 4</Formula>
        <Prose>
          <p>1 1/2 quarts of stock. 1.5 × 4 = 6 cups, which is also 48 fluid ounces.</p>
          <p>
            A recipe needs 10 cups of water and your pitcher is marked in quarts. 10 ÷ 4 = 2.5 quarts,
            so fill it to 2 quarts and add 2 more cups.
          </p>
        </Prose>
      </Section>

      <Section title="Liquid quart vs dry quart" id="liquid-vs-dry">
        <Prose>
          <p>
            US recipes almost always mean the liquid quart: 4 cups, 32 fl oz, 946 mL. The dry quart is
            a separate, larger unit used for produce like strawberries, blueberries and cherry
            tomatoes. It&apos;s 1,101 mL, which is about 4.65 US cups. The British imperial quart is
            larger again at about 1,137 mL, or 4.8 US cups.
          </p>
        </Prose>
        <div className="mt-4">
          <ThreeQuartsTable />
        </div>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It converts US liquid volume only. Dry quarts and imperial quarts are explained above but
            aren&apos;t in the converter. A quart of flour or berries doesn&apos;t have a fixed weight;
            for weights, use cups to grams with the ingredient.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <QuartsToCupsChart />
          <QuartWeightTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'A pint is half a quart, so 2 cups. A gallon is 4 quarts, so 16 cups.',
            'The quart line on a large liquid measuring cup is at 4 cups. Use the cup marks for anything in between.',
            'A quart is a little smaller than a liter: 946 mL vs 1,000 mL. In a pinch you can swap them in soups, but not in baking.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
