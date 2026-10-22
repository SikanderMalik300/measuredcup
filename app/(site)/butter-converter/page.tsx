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
import { ButterConverterTool } from '@/components/tools/ButterConverterTool';
import { ButterTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/butter-converter/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        1 US stick of butter is 1/2 cup, 8 tablespoons, 4 ounces or 113 grams. So 3/4 cup is 1 1/2
        sticks (170 g), and 1 cup is 2 sticks (227 g). Type any amount in any unit to convert the
        rest.
      </QuickAnswer>

      <div className="mt-6">
        <ButterConverterTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Pick the unit your recipe uses.',
            'Type the amount.',
            'Read every other unit, including the closest stick-and-tablespoon cut.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>1 stick = 113.4 g = 4 oz = 8 tbsp = 1/2 cup. Every result is a multiple of these.</Formula>
        <Prose>
          <p>
            A European recipe asks for 250 g butter. 250 ÷ 113.4 = 2.2 sticks. Use 2 full sticks plus
            1 1/2 tablespoons cut from a third stick.
          </p>
          <p>A recipe asks for 6 tablespoons. 6 ÷ 8 = 3/4 stick, which is 85 g or 3 oz.</p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It assumes US sticks of 4 oz with 8 tablespoon marks. Some West Coast brands sell short,
            wide sticks that are the same weight, so the maths still holds. European butter often
            comes in 250 g blocks, and Irish or European butter has more fat but the same weight per
            volume. Melted butter loses a little water when browned, so browned butter weighs less.
          </p>
        </Prose>
      </Section>

      <EmbedBox slug={SLUG} />

      <Section title="Reference table" id="tables">
        <ButterTable />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            "Cut cold butter through the wrapper along the tablespoon lines. It's faster and cleaner than a measuring cup.",
            'Softened butter for creaming should give slightly to a finger press, at about 65°F (18°C).',
            'Salted and unsalted butter weigh the same per stick. Salted adds roughly 1/4 tsp salt per stick, depending on the brand.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
