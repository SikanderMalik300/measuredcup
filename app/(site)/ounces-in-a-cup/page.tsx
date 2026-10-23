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
import { CupOuncesTool } from '@/components/tools/CupOuncesTool';
import { CupsToFlOzTable, CupSizesInFlOzTable, OuncesPerCupTable } from '@/components/tables/Tables';
import { getPage } from '@/lib/data/pages';

const SLUG = '/ounces-in-a-cup/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);
  return (
    <ToolPageFrame slug={SLUG}>
      <QuickAnswer>
        A US cup holds 8 fluid ounces. That&apos;s a volume measure, so it&apos;s the same for any
        liquid. By weight, a cup is 8 oz only for water-like liquids: a cup of all-purpose flour
        weighs about 4.4 oz, granulated sugar about 7.1 oz and butter about 8 oz (USDA FoodData
        Central).
      </QuickAnswer>

      <div className="mt-6">
        <CupOuncesTool />
      </div>

      <Section title="How to use" id="how-to">
        <Steps
          items={[
            'Type the number of cups. Fractions like 1/2 work.',
            'Pick the ingredient, and USDA or King Arthur.',
            'Read fluid ounces for a measuring jug, or ounces by weight for a kitchen scale.',
          ]}
        />
      </Section>

      <div className="mt-10">
        <AdSlot position="content" />
      </div>

      <Section title="The formula and two worked examples" id="formula">
        <Formula>
          fluid ounces = cups × 8 and ounces by weight = grams per cup × cups ÷ 28.35
        </Formula>
        <Prose>
          <p>
            Milk for a sauce. 1 1/2 cups × 8 = 12 fl oz. On a scale that&apos;s about 12.9 oz (366 g),
            because milk is a little heavier than water.
          </p>
          <p>
            Flour by weight. A recipe calls for 2 cups of all-purpose flour. 2 × 125 g = 250 g, and
            250 ÷ 28.35 = 8.82 oz. Weighing 8 oz would leave you short by almost a quarter cup.
          </p>
        </Prose>
      </Section>

      <Section title="Fluid ounces vs ounces" id="fluid-vs-weight">
        <Prose>
          <p>
            A fluid ounce is a unit of volume: 1/8 of a US cup, about 29.6 mL. An ounce (avoirdupois)
            is a unit of weight: 28.35 g. Measuring cups and jugs are marked in fluid ounces; kitchen
            scales show ounces. For water, 8 fl oz weighs about 8.35 oz, so the two are close. For
            flour they&apos;re far apart: 8 fl oz of flour weighs only about 4.4 oz.
          </p>
        </Prose>
      </Section>

      <Section title="Cups in other countries" id="cups-abroad">
        <Prose>
          <p>
            US recipes use the US cup of 236.6 mL, which is exactly 8 US fluid ounces. Nutrition
            labels use a 240 mL cup, about 8.1 fl oz. A metric cup (UK, Australia, Canada) is 250 mL,
            which is about 8.45 US fl oz or 8.8 UK imperial fl oz.
          </p>
        </Prose>
        <div className="mt-6">
          <CupSizesInFlOzTable />
        </div>
      </Section>

      <Section title="What this tool doesn't cover" id="not-covered">
        <Prose>
          <p>
            It works in US cups. Weight ounces use average figures for level, spooned measures of
            typical US products, so packing and brands change them a little. For other cup sizes, use
            the table above.
          </p>
        </Prose>
      </Section>

      <Section title="Reference tables" id="tables">
        <div className="space-y-8">
          <CupsToFlOzTable />
          <OuncesPerCupTable />
          <p className="text-small text-muted">
            King Arthur&apos;s chart lists all-purpose flour as 4 1/4 oz (120 g). We convert from
            grams, so it shows 4.23 oz.
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
            'If a recipe gives ounces for a dry ingredient, it means weight. Use a scale, not a measuring cup.',
            'For water, milk and juice, 1 cup is about 8 oz on a scale too, so either works.',
            "A standard US coffee mug holds 10 to 12 fl oz, not 8. Don't use one as a measuring cup.",
          ]}
        />
      </Section>
    </ToolPageFrame>
  );
}
