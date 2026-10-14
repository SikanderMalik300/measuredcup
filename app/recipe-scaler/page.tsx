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
import { RecipeScalerTool } from '@/components/tools/RecipeScalerTool';
import { getPage } from '@/lib/data/pages';

const SLUG = '/recipe-scaler/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        Multiply every ingredient by new servings ÷ original servings. Going from 4 servings to 6 is
        a factor of 1.5, so 2 cups of flour becomes 3 cups and 3/4 cup of sugar becomes 1 cup plus 2
        tablespoons. Paste your ingredient list below and the scaler does every line.
      </QuickAnswer>

      <div className="mt-6">
        <RecipeScalerTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Enter how many servings the recipe makes now.',
            'Enter how many you want, or pick a factor.',
            'Paste the ingredient list, one item per line.',
            'Copy or print the scaled list. Check any line marked "not scaled".',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>scale factor = new servings ÷ original servings; new amount = old amount × factor</Formula>
        <Prose>
          <p>
            Going from 4 servings to 6 is a factor of 1.5. 2 cups flour becomes 3 cups, 3/4 cup sugar
            becomes 1 cup + 2 tbsp, 1/2 cup butter becomes 3/4 cup, 2 eggs becomes 3 eggs, 1 tsp
            baking powder becomes 1 1/2 tsp, and 1/4 tsp salt becomes 1/4 tsp + 1/8 tsp.
          </p>
          <p>
            Cutting a 9-serving recipe to 3 servings is a factor of 1/3. 2 1/4 cups flour becomes 3/4
            cup, 3 eggs becomes 1 egg, and 1 tsp vanilla becomes 1/3 tsp, about 1/4 tsp plus a pinch.
          </p>
        </Prose>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            Baking time, pan size and oven temperature don&apos;t scale with the ingredients. A
            doubled batter in the same pan bakes much longer, so use two pans or a larger one and
            check early. Yeast doughs and spices may need less than a straight multiply when you
            triple or more.
          </p>
        </Prose>
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <InPagePhoto photoId={page.photoId} />

      <Section title="Tips" id="tips">
        <Tips
          items={[
            'When scaling up a cake, match the pan area, not the pan count. A 9x13-inch pan holds about the batter of two 8-inch rounds.',
            'Start checking doneness at the original time, then every 5 minutes.',
            'Round eggs up for richer, round down for lighter. Or beat the extra egg and add half.',
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
