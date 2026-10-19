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
import { GallonsToCupsChart, ThreeGallonsTable, GallonWeightTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/cups-in-a-gallon/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        There are 16 cups in a US gallon. A gallon is also 4 quarts, 8 pints, 128 fluid ounces or about
        3.79 liters. Half a gallon is 8 cups and a quarter gallon is 4 cups, which is one quart.
      </QuickAnswer>

      <div className="mt-6">
        <LiquidVolumeTool defaultUnit="gallons" toolName="cups-in-a-gallon" />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the amount. Fractions like 1/2 work.',
            "Choose the unit you're starting from.",
            'Read cups first, then quarts, pints and the rest underneath.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>cups = gallons × 16 and gallons = cups ÷ 16</Formula>
        <Prose>
          <p>Half a gallon of milk. 0.5 × 16 = 8 cups, which is 2 quarts or 64 fluid ounces.</p>
          <p>
            A punch recipe makes 24 cups. 24 ÷ 16 = 1.5 gallons, so you need a container bigger than a
            standard 1 gallon jug.
          </p>
        </Prose>
      </Section>

      <Section title="US gallon vs UK gallon" id="us-vs-uk">
        <Prose>
          <p>
            US recipes and US milk jugs use the US liquid gallon: 16 cups, 128 fl oz, 3.79 L. The
            British imperial gallon is about 20% bigger at 4.55 L, which is about 19.2 US cups.
            There&apos;s also a rarely used US dry gallon of about 4.40 L (18.6 US cups), mostly in old
            produce measures.
          </p>
        </Prose>
        <div className="mt-4">
          <ThreeGallonsTable />
        </div>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It converts US liquid volume only. Imperial and dry gallons are explained above but
            aren&apos;t in the converter. For dry ingredients by weight, use cups to grams with the
            ingredient.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <GallonsToCupsChart />
          <div>
            <GallonWeightTable />
            <p className="mt-2 text-small text-muted">
              Water at exactly 1 g per mL gives 8.35 lb per gallon. The USDA cup figure of 237 g rounds
              up slightly, which gives 8.36 lb.
            </p>
          </div>
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'A gallon is 4 quarts and a quart is 4 cups, so 4 × 4 = 16.',
            'When a soup recipe makes 1 gallon, plan on about 16 one-cup servings.',
            "A standard gallon milk jug holds 16 cups, but leave some headroom if you're mixing anything in it.",
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
