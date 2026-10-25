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
import {
  LitersToCupsChart,
  CupsToLitersChart,
  CupsPerLiterTable,
  LiterWeightTable,
} from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/cups-in-a-liter/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        There are about 4.23 US cups in a liter, just under 4 1/4 cups. A liter is 1,000 mL and a US
        cup is 236.6 mL. If your recipe uses metric cups of 250 mL (UK, Australia, Canada), a liter is
        exactly 4 cups. A liter is also a little more than a US quart: 1.06 quarts, or 33.8 fluid
        ounces.
      </QuickAnswer>

      <div className="mt-6">
        <LiquidVolumeTool defaultUnit="liters" toolName="cups-in-a-liter" />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the amount. Fractions like 1/2 work.',
            'Choose liters, or switch the unit to go from cups, quarts or mL.',
            'Read cups first, then fluid ounces, quarts and the rest underneath.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>cups = liters × 4.227 and liters = cups × 0.2366</Formula>
        <Prose>
          <p>A 2 liter bottle of soda. 2 × 4.227 = 8.45 cups, a little more than 2 quarts.</p>
          <p>
            A soup recipe needs 6 cups of stock. 6 × 0.2366 = 1.42 liters, so a 1.5 liter carton is
            enough.
          </p>
        </Prose>
      </Section>

      <Section title="US cups vs metric cups" id="us-vs-metric">
        <Prose>
          <p>
            A US cup is 236.6 mL, so 1 liter is 4.23 US cups. Recipes from the UK, Australia, New
            Zealand and Canada often use a 250 mL metric cup, and then 1 liter is exactly 4 cups. US
            nutrition labels use a 240 mL cup, which makes a liter 4.17 cups. When a recipe gives both
            liters and cups, check which cup it means.
          </p>
        </Prose>
        <div className="mt-6">
          <CupsPerLiterTable />
        </div>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It converts liquid volume in US units. A liter of flour or sugar weighs very different
            amounts, so for dry ingredients use cups to grams with the ingredient. The table above
            covers metric and other cup sizes.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <LitersToCupsChart />
          <CupsToLitersChart />
          <LiterWeightTable />
          <p className="text-small text-muted">
            Water at exactly 1 g per mL is 1,000 g per liter. USDA&apos;s 237 g cup rounds up slightly,
            which gives 1,002 g.
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
            "Quick estimate: a liter is about 4 1/4 US cups. That's close enough for soups and stocks.",
            'For baking, measure 4 cups plus 3 1/2 tablespoons, or better, use the mL marks on your jug.',
            'A liter and a US quart are close but not the same. A liter is about 6% bigger.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
