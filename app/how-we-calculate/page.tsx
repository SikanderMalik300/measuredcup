import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';
import { Sources } from '@/components/Sources';
import { getPage } from '@/lib/data/pages';

const SLUG = '/how-we-calculate/';
export const metadata: Metadata = buildMetadata(SLUG);

const CONSTANTS: [string, string, string][] = [
  ['US customary cup', '236.5882365 mL', 'NIST Handbook 44 Appendix C'],
  ['US tablespoon', '1/16 cup = 14.78676478 mL', 'NIST Handbook 44'],
  ['US teaspoon', '1/48 cup = 4.928921594 mL', 'NIST Handbook 44'],
  ['US legal cup (nutrition labels)', '240 mL', 'FDA, 21 CFR 101.9(b)(5)(viii)'],
  ['US fluid ounce', '29.5735295625 mL', 'NIST Handbook 44'],
  ['Avoirdupois ounce', '28.349523125 g', 'NIST Handbook 44'],
  ['1 stick of US butter', '1/2 cup = 8 tbsp = 4 oz = 113.4 g', 'US butter wrapper convention; 4 oz x 28.3495 g'],
  ['Large egg, without shell', '50 g', 'USDA FoodData Central SR Legacy, "Egg, whole, raw, fresh", 1 large'],
];

export default function Page() {
  const page = getPage(SLUG);
  return (
    <TrustFrame slug={SLUG} showUpdated>
      <h2>Units we use</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="pb-2 text-left text-small text-muted">Volume and weight constants</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">Constant</th>
              <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">Value</th>
              <th scope="col" className="px-3 py-2 text-left text-small font-medium text-muted">Source</th>
            </tr>
          </thead>
          <tbody>
            {CONSTANTS.map((c) => (
              <tr key={c[0]} className="border-b border-line">
                <th scope="row" className="px-3 py-2 text-left font-normal text-ink">{c[0]}</th>
                <td className="px-3 py-2 tabular text-ink">{c[1]}</td>
                <td className="px-3 py-2 text-small text-muted">{c[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Ingredient weights</h2>
      <p>
        USDA values come from the FoodData Central SR Legacy release, using each food&apos;s household
        portion for 1 cup. King Arthur values come from their published ingredient weight chart; where
        they list 1/2 cup or 1/4 cup, we multiplied up to a full cup. Tablespoon and teaspoon figures
        are the cup weight divided by 16 and 48. The full table is on the{' '}
        <Link href="/data/ingredient-weights/" prefetch={false} className="link">ingredient weights</Link>{' '}
        page.
      </p>

      <h2>Rounding</h2>
      <p>
        Grams are shown to 1 decimal below 100 g and as whole grams above. Cup and spoon results are
        rebuilt into standard US measures, down to 1/8 teaspoon. When a result falls between spoon
        sizes we say &quot;about&quot;.
      </p>

      <h2>What we compare</h2>
      <p>Each converter can switch between USDA and King Arthur figures. We flag differences over 3%.</p>

      <h2>Checks</h2>
      <p>
        Every converter has automated tests for its worked examples, tables and FAQ numbers. We also
        compare results with King Arthur&apos;s published chart before each update.
      </p>

      <div className="mt-4">
        <Sources sources={page.sources} />
      </div>
    </TrustFrame>
  );
}
