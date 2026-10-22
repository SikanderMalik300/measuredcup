import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';

const SLUG = '/about/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustFrame slug={SLUG} showUpdated>
      <p>
        MeasuredCup is a set of free kitchen converters for people who bake from recipes written in a
        different system than their kitchen. I&apos;m Sikander Malik, a web developer, and I built it
        after running into the same problem again and again: a recipe in grams, a drawer full of cups,
        and conversion charts that disagreed with each other.
      </p>
      <p>
        Instead of picking one number and hiding the rest, every converter here shows where its number
        comes from. Ingredient weights come from USDA FoodData Central, the US government&apos;s public
        food database, and from King Arthur Baking&apos;s published weight chart. When they disagree,
        the page says so.
      </p>
      <p>
        What I don&apos;t do: I don&apos;t publish recipes, and I don&apos;t claim to have tested
        ingredients in a lab. The tools do arithmetic on published data, and every formula is shown so
        you can check it.
      </p>
      <p>
        Found a wrong number? Use the contact page. Corrections are logged publicly on the editorial
        policy page.
      </p>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-small">
        <Link href="/how-we-calculate/" prefetch={false} className="link">How we calculate</Link>
        <Link href="/editorial-policy/" prefetch={false} className="link">Editorial policy</Link>
        <Link href="/contact/" prefetch={false} className="link">Contact</Link>
        <Link href="/authors/sikander-malik/" prefetch={false} className="link">Sikander Malik</Link>
      </p>
    </TrustFrame>
  );
}
