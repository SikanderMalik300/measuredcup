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
import { TspTbspTool } from '@/components/tools/TspTbspTool';
import { TspToTbspChart, SpoonWeightTable, TablespoonSizesTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/teaspoons-in-a-tablespoon/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        There are 3 teaspoons in a US tablespoon. A tablespoon is 14.8 mL and a teaspoon is 4.9 mL, so
        1 teaspoon is 1/3 of a tablespoon and 1/2 tablespoon is 1 1/2 teaspoons. The UK tablespoon is
        also 3 teaspoons (15 mL), but an Australian tablespoon is 20 mL, which is 4 teaspoons.
      </QuickAnswer>

      <div className="mt-6">
        <TspTbspTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the amount. Fractions like 1/2 work.',
            "Choose whether you're starting from tablespoons or teaspoons.",
            'Read the answer, plus the same amount in cups, fluid ounces and mL.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>teaspoons = tablespoons × 3 and tablespoons = teaspoons ÷ 3</Formula>
        <Prose>
          <p>Halving 1 tablespoon of vanilla. 1 tbsp × 3 = 3 tsp, so half is 1 1/2 teaspoons.</p>
          <p>
            A recipe calls for 5 teaspoons of baking powder. 5 ÷ 3 = 1 2/3 tablespoons, so measure 1
            tablespoon plus 2 teaspoons.
          </p>
        </Prose>
      </Section>

      <Section title="Tablespoon sizes around the world" id="sizes">
        <Prose>
          <p>
            Most countries use a 15 mL tablespoon, which holds 3 teaspoons of 5 mL. The US tablespoon
            is a hair smaller at 14.8 mL, but still 3 US teaspoons. Australia is the exception: its
            tablespoon is 20 mL, so it holds 4 teaspoons. If an Australian recipe says 1 tablespoon,
            use 1 US tablespoon plus 1 teaspoon.
          </p>
        </Prose>
        <div className="mt-6">
          <TablespoonSizesTable />
        </div>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It converts US tablespoons and teaspoons by volume. Measuring spoons sold in the US match
            these sizes. For an Australian 20 mL tablespoon, see the table above. For weight, use the
            grams per spoon table below or the tablespoons to grams converter.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <TspToTbspChart />
          <SpoonWeightTable />
          <p className="text-small text-muted">
            Weights are for level spoons. Heaped spoons can weigh half as much again.
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
            'No tablespoon? Use 3 level teaspoons.',
            '1/2 tablespoon is 1 1/2 teaspoons. Most measuring sets include a 1/2 teaspoon, so that\'s one teaspoon plus one half teaspoon.',
            'Level every spoon with a straight edge. A rounded teaspoon of flour can hold close to double.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
