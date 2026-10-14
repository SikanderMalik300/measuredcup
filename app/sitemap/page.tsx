import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';
import { PAGES, type PageEntry } from '@/lib/data/pages';

const SLUG = '/sitemap/';
export const metadata: Metadata = buildMetadata(SLUG);

function Group({ title, pages }: { title: string; pages: PageEntry[] }) {
  if (pages.length === 0) return null;
  return (
    <div>
      <h2>{title}</h2>
      <ul className="mt-3 space-y-3">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link href={p.slug} prefetch={false} className="link">{p.h1}</Link>
            <p className="text-small text-muted">{p.metaDescription}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Page() {
  const home = PAGES.filter((p) => p.kind === 'home');
  const converters = PAGES.filter((p) => p.category === 'converters');
  const recipeTools = PAGES.filter((p) => p.category === 'recipe-tools');
  const data = PAGES.filter((p) => p.category === 'data');
  const trust = PAGES.filter((p) => p.kind === 'trust');

  return (
    <TrustFrame slug={SLUG}>
      <div className="space-y-8">
        <Group title="Home" pages={home} />
        <Group title="Kitchen converters" pages={converters} />
        <Group title="Recipe tools" pages={recipeTools} />
        <Group title="Ingredient data" pages={data} />
        <Group title="Trust and legal" pages={trust} />
      </div>
    </TrustFrame>
  );
}
