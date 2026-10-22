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
import { EmbedBox } from '@/components/embed/EmbedBox';
import { TablespoonsToGramsTool } from '@/components/tools/TablespoonsToGramsTool';
import { SpoonGramsTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/tablespoons-to-grams/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        1 US tablespoon of water weighs 14.8 g. Other ingredients depend on density: 1 tablespoon of
        all-purpose flour is about 7.8 g, granulated sugar 12.5 g, butter 14.2 g, and honey 21.2 g
        (USDA FoodData Central). A teaspoon is one third of each.
      </QuickAnswer>

      <div className="mt-6">
        <TablespoonsToGramsTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the number of spoons.',
            'Choose tablespoons or teaspoons.',
            'Choose the ingredient.',
            'Read the grams. Use level spoons, not heaped.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>grams = spoons × (grams per cup ÷ 16) for tablespoons, ÷ 48 for teaspoons</Formula>
        <Prose>
          <p>3 tablespoons of butter. 227 ÷ 16 = 14.19 g per tablespoon. 3 × 14.19 = 42.6 g.</p>
          <p>
            2 tablespoons of honey. 339 ÷ 16 = 21.19 g per tablespoon. 2 × 21.19 = 42.4 g. Honey is
            the heaviest common baking ingredient per spoon.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It assumes level US measuring spoons (14.8 mL tablespoon, 4.9 mL teaspoon). Dinner spoons
            vary from about 7 mL to 14 mL, so they aren&apos;t reliable. Australian tablespoons are
            20 mL, a third bigger. It doesn&apos;t cover leaveners by brand: baking powder and baking
            soda weights differ slightly by product.
          </p>
        </Prose>
      </Section>

      <EmbedBox slug={SLUG} />

      <Section title="Reference table" id="tables">
        <SpoonGramsTable />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            "Measure sticky liquids like honey and molasses over a separate bowl so drips don't land in the batter.",
            'For salt, brand matters a lot. Table salt is about 6 g per teaspoon; flaky kosher salt can be half that.',
            'Three teaspoons make one tablespoon, and 16 tablespoons make one cup.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
