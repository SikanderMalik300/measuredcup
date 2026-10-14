import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { PhotoTile } from '@/components/PhotoTile';
import { AnswerCard } from '@/components/AnswerCard';
import { Picture } from '@/components/Picture';
import { SiteSearch, type SearchItem } from '@/components/SiteSearch';
import { getPage, toolPages } from '@/lib/data/pages';
import { INGREDIENTS } from '@/lib/data/ingredients';
import { getPhoto } from '@/lib/data/photos';

const SLUG = '/';
export const metadata: Metadata = buildMetadata(SLUG);

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

const MOST_USED = ['/grams-to-cups/', '/cups-to-grams/', '/butter-converter/', '/recipe-scaler/'];
const CONVERTERS = ['/grams-to-cups/', '/cups-to-grams/', '/tablespoons-to-grams/', '/butter-converter/'];
const RECIPE_TOOLS = ['/half-a-measurement/', '/recipe-scaler/'];

export default function Home() {
  const page = getPage(SLUG);
  const hero = getPhoto('hero-flour-cup');

  const searchItems: SearchItem[] = [
    ...toolPages().map((t) => ({ label: t.h1, href: t.slug, kind: 'Tool' as const })),
    ...INGREDIENTS.map((i) => ({ label: i.name, href: '/grams-to-cups/', kind: 'Ingredient' as const })),
  ];

  const latest = [...toolPages(), getPage('/data/ingredient-weights/')];

  return (
    <div>
      {/* Hero */}
      <section className="w-full">
        <div className="mx-auto grid max-w-container grid-cols-1 items-stretch md:grid-cols-[55%_45%]">
          <div
            style={{ background: 'var(--band-1)' }}
            className="flex flex-col justify-center px-4 py-12 md:min-h-[440px] md:px-10 md:py-16"
          >
            <h1>{page.h1}</h1>
            <p className="prose-measure mt-4 text-[18px] text-ink">
              A cup of flour and a cup of sugar don&apos;t weigh the same. MeasuredCup converts grams,
              cups and spoons ingredient by ingredient, using public USDA data and the King Arthur
              Baking weight chart, side by side.
            </p>
            <div className="mt-6 max-w-xl">
              <SiteSearch items={searchItems} />
            </div>
          </div>
          <figure className="relative">
            {/* Mobile: 4:3 strip below the color block. Desktop: fills the right 45% edge to edge at
                the full hero height. */}
            <div className="h-[220px] w-full md:absolute md:inset-0 md:h-full">
              <Picture
                photo={hero}
                variant="hero"
                width={1280}
                height={853}
                sizes="(max-width: 767px) 100vw, 45vw"
                className="h-full w-full"
              />
            </div>
            <figcaption className="px-4 py-1 text-[12px] text-muted md:absolute md:inset-x-0 md:bottom-0 md:bg-gradient-to-t md:from-black/55 md:to-transparent md:px-4 md:py-2 md:text-white">
              Photo: {hero.photographer} / {hero.source}
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="mx-auto max-w-container px-4 md:px-10">
        {/* Most used */}
        <section className="py-12 md:py-16" aria-labelledby="most-used">
          <h2 id="most-used">Most used</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {MOST_USED.map((slug) => {
              const t = getPage(slug);
              return <PhotoTile key={slug} href={slug} name={t.h1} line={t.tileLine} photoId={t.photoId} />;
            })}
          </div>
        </section>
      </div>

      {/* Kitchen converters band */}
      <section style={{ background: 'var(--band-1)' }} aria-labelledby="band-converters">
        <div className="mx-auto max-w-container px-4 py-12 md:px-10 md:py-16">
          <div className="flex items-baseline justify-between">
            <h2 id="band-converters">Kitchen converters</h2>
            <Link href="/converters/" prefetch={false} className="inline-flex items-center gap-1 text-brand hover:text-brand-hover">
              View all <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-2 text-muted">Weight and volume, converted per ingredient.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CONVERTERS.map((slug) => {
              const t = getPage(slug);
              return <PhotoTile key={slug} href={slug} name={t.h1} line={t.tileLine} photoId={t.photoId} />;
            })}
          </div>
        </div>
      </section>

      {/* Recipe tools band */}
      <section style={{ background: 'var(--band-2)' }} aria-labelledby="band-recipe">
        <div className="mx-auto max-w-container px-4 py-12 md:px-10 md:py-16">
          <div className="flex items-baseline justify-between">
            <h2 id="band-recipe">Recipe tools</h2>
            <Link href="/recipe-tools/" prefetch={false} className="inline-flex items-center gap-1 text-brand hover:text-brand-hover">
              View all <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-2 text-muted">Halve, third, double or resize a whole recipe.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {RECIPE_TOOLS.map((slug) => {
              const t = getPage(slug);
              return <PhotoTile key={slug} href={slug} name={t.h1} line={t.tileLine} photoId={t.photoId} />;
            })}
          </div>
        </div>
      </section>

      {/* Popular answers */}
      <section style={{ background: 'var(--paper)' }} aria-labelledby="popular">
        <div className="mx-auto max-w-container px-4 py-12 md:px-10 md:py-16">
          <h2 id="popular">Popular answers</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <AnswerCard
              value="1 cup all-purpose flour = 125 g"
              sentence="USDA's figure. King Arthur uses 120 g."
              href="/cups-to-grams/"
              linkLabel="Cups to grams"
            />
            <AnswerCard
              value="1 stick of butter = 113 g"
              sentence="Also 1/2 cup, 8 tablespoons, 4 ounces."
              href="/butter-converter/"
              linkLabel="Butter converter"
            />
            <AnswerCard
              value="Half of 3/4 cup = 6 tbsp"
              sentence="That's 1/4 cup plus 2 tablespoons."
              href="/half-a-measurement/"
              linkLabel="Half a measurement"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-container px-4 md:px-10">
        {/* Why trust these numbers */}
        <section className="py-12 md:py-16" aria-labelledby="why-trust">
          <h2 id="why-trust">Why trust these numbers</h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3>Public data, shown side by side</h3>
              <p className="mt-2 text-ink">
                Every ingredient shows USDA FoodData Central&apos;s weight next to King Arthur
                Baking&apos;s, so you can see when sources disagree and by how much.
              </p>
            </div>
            <div>
              <h3>Maths you can check</h3>
              <p className="mt-2 text-ink">
                Each tool has a Show the math button with the exact division or multiplication, and
                every page lists its sources with dates.
              </p>
            </div>
            <div>
              <h3>Corrected in public</h3>
              <p className="mt-2 text-ink">
                When a number changes, we log the old value and the new one on our{' '}
                <Link href="/editorial-policy/" prefetch={false} className="link">editorial policy</Link>{' '}
                page. Read more in{' '}
                <Link href="/how-we-calculate/" prefetch={false} className="link">How we calculate</Link>{' '}
                and <Link href="/about/" prefetch={false} className="link">About</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Latest updates */}
        <section className="pb-12 md:pb-16" aria-labelledby="latest">
          <h2 id="latest">Latest updates</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {latest.map((p) => (
              <li key={p.slug} className="flex items-center justify-between py-3">
                <Link href={p.slug} prefetch={false} className="text-ink hover:text-brand">
                  {p.h1}
                </Link>
                <span className="text-small text-muted tabular">{formatDate(p.lastUpdated)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Photo credits */}
        <section className="pb-12 md:pb-16" aria-labelledby="credits">
          <h2 id="credits">Photo credits</h2>
          <ul className="mt-4 space-y-1 text-small text-muted">
            <li>
              <a href={hero.sourceUrl} className="link" rel="noopener">
                Measuring cup of flour
              </a>{' '}
              by{' '}
              <a href={hero.photographerUrl} className="link" rel="noopener">
                {hero.photographer}
              </a>{' '}
              on Unsplash
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
