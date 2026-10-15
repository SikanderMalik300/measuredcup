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
import { TablespoonsToCupsTool } from '@/components/tools/TablespoonsToCupsTool';
import { TablespoonsToCupsChart, SpoonGramsByIngredientTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/tablespoons-to-cups/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        There are 16 tablespoons in 1 US cup, so divide tablespoons by 16 to get cups. 4 tablespoons
        is 1/4 cup, 8 is 1/2 cup and 12 is 3/4 cup. Amounts in between are easiest as a cup plus
        spoons: 10 tablespoons is 1/2 cup + 2 tbsp.
      </QuickAnswer>

      <div className="mt-6">
        <TablespoonsToCupsTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the number of tablespoons. Fractions like 2 1/2 work.',
            'Switch to teaspoons if your recipe lists those.',
            'Read the cups, then the cup-and-spoon combination to measure with.',
            "Pick an ingredient if you'd rather weigh it in grams.",
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>cups = tablespoons ÷ 16 and cups = teaspoons ÷ 48</Formula>
        <Prose>
          <p>
            6 tablespoons. 6 ÷ 16 = 0.375 cups. That&apos;s 1/4 cup + 2 tbsp, which is 3/8 cup. It
            isn&apos;t 1/4 cup, a common mix-up: 1/4 cup is 4 tablespoons.
          </p>
          <p>
            11 tablespoons. 11 ÷ 16 = 0.6875 cups. The closest single cup is 2/3 cup, which is 10
            tablespoons + 2 teaspoons, so measure 2/3 cup + 1 tsp.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It uses US measuring spoons and cups (1 tablespoon = 14.8 mL, 1 cup = 236.6 mL).
            Australian tablespoons are 20 mL, so 4 Australian tablespoons are 80 mL, not 1/4 cup.
            Dinner spoons aren&apos;t measuring spoons and can hold anywhere from 7 mL to 14 mL. Gram
            results are averages; a heaped spoon or packed cup weighs more.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <TablespoonsToCupsChart />
          <SpoonGramsByIngredientTable />
        </div>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'Count tablespoons into a liquid measuring cup only for liquids. For flour and sugar, use dry cups and level them.',
            "Five tablespoons plus one teaspoon is exactly 1/3 cup. That's handy when your 1/3 cup is in the dishwasher.",
            'A stick of butter is 8 tablespoons, or 1/2 cup. The tablespoon marks on the wrapper are the fastest way to cut it.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
