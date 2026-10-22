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
import { PintsToCupsChart, ThreePintsTable, PintWeightTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/cups-in-a-pint/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        There are 2 cups in a US pint. A pint is also 16 fluid ounces or 473 mL, and 2 pints make a
        quart. A pint of ice cream or cream is this same 2 cups. Berries are different: a dry pint
        basket holds about 2.33 cups.
      </QuickAnswer>

      <div className="mt-6">
        <LiquidVolumeTool defaultUnit="pints" toolName="cups-in-a-pint" />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the amount. Fractions like 1 1/2 work.',
            "Choose the unit you're starting from.",
            'Read cups first, then quarts, fluid ounces and the rest underneath.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>cups = pints × 2 and pints = cups ÷ 2</Formula>
        <Prose>
          <p>A recipe needs 1 1/2 pints of cream. 1.5 × 2 = 3 cups, which is 24 fluid ounces.</p>
          <p>You have 5 cups of stock. 5 ÷ 2 = 2.5 pints, so it fills two pint jars with a cup left over.</p>
        </Prose>
      </Section>

      <Section title="Liquid pint vs dry pint vs UK pint" id="pint-kinds">
        <Prose>
          <p>
            Recipes and cartons of milk, cream and ice cream use the US liquid pint: 2 cups, 16 fl oz,
            473 mL. Blueberries, cherry tomatoes and other small produce are sold by the US dry pint,
            which is 551 mL, about 2.33 US cups. A British pint is bigger again at 568 mL, about 2.4 US
            cups, which is why a pint of beer in London is more than one in New York.
          </p>
        </Prose>
        <div className="mt-4">
          <ThreePintsTable />
        </div>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It converts US liquid volume only. Dry and imperial pints are explained above but
            aren&apos;t in the converter. A pint of rice, sugar or flour has no fixed weight; use cups
            to grams with the ingredient for that.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <PintsToCupsChart />
          <PintWeightTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'The old saying "a pint\'s a pound the world around" is close for water in the US: a pint weighs about 1.04 pounds.',
            'Two pints make a quart and eight pints make a gallon.',
            "A pint of berries won't fill a 2 cup measure neatly. Dry pints are about a third of a cup bigger.",
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
