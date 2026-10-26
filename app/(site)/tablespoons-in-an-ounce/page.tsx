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
import { OunceTbspTool } from '@/components/tools/OunceTbspTool';
import { FlOzToTbspTable, TbspPerOunceTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/tablespoons-in-an-ounce/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        There are 2 tablespoons in a US fluid ounce, which is also 6 teaspoons or 29.6 mL. For dry
        ingredients measured by weight, it depends on the food: 1 ounce of all-purpose flour is about
        3.6 tablespoons, granulated sugar about 2.3 tablespoons, and butter exactly 2 tablespoons (USDA
        FoodData Central).
      </QuickAnswer>

      <div className="mt-6">
        <OunceTbspTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the number of ounces.',
            'Choose fluid ounces for liquids, or ounces by weight for dry ingredients and butter.',
            'For weight, pick the ingredient and read the tablespoons, or the spoon measure underneath.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          tablespoons = fluid ounces × 2 and tablespoons = ounces × 28.35 ÷ grams per tablespoon
        </Formula>
        <Prose>
          <p>
            Handy shortcut: the tablespoons in 1 ounce of an ingredient equal the cups in 1 pound of
            it, because both are 16 to 1.
          </p>
          <p>Vanilla extract. A recipe says 1/2 fl oz. 0.5 × 2 = 1 tablespoon.</p>
          <p>
            Cocoa powder by weight. 1 oz is 28.35 g, and a tablespoon of cocoa is about 5.4 g, so 1 oz
            is about 5.3 tablespoons.
          </p>
        </Prose>
      </Section>

      <Section title="Fluid ounces vs dry ounces" id="fluid-vs-dry">
        <Prose>
          <p>
            A fluid ounce is a volume: 2 tablespoons, whatever you pour into it. A dry ounce is a
            weight: 28.35 g. For water and milk the two are close, so 1 oz is about 2 tablespoons
            either way. For light, airy ingredients like flour or cocoa, an ounce on a scale fills many
            more spoons. For dense ones like honey, it fills fewer.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It uses US tablespoons of 14.8 mL. Weights assume level, spooned tablespoons of typical US
            products, so packing and brands change them a little. For other spoon sizes, see teaspoons
            in a tablespoon.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <FlOzToTbspTable />
          <TbspPerOunceTable />
          <p className="text-small text-muted">
            Butter is 2.00 tbsp per ounce by the US stick convention: a 4 oz stick is 8 tablespoons.
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
            'For butter, 1 ounce is 2 tablespoons. The wrapper lines make it easy.',
            'A shot glass is often 1.5 fl oz, which is 3 tablespoons.',
            'When a dry ingredient is listed in ounces, a scale beats spoons every time.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
