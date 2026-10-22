import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { TrustFrame } from '@/components/TrustFrame';
import { AuthorPhoto } from '@/components/AuthorPhoto';
import { AUTHOR } from '@/lib/data/site';
import { toolPages, getPage } from '@/lib/data/pages';

const SLUG = '/authors/sikander-malik/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const byHim = [...toolPages(), getPage('/data/ingredient-weights/')];
  return (
    <TrustFrame slug={SLUG}>
      <div className="flex items-center gap-4">
        <AuthorPhoto size={96} />
        <p className="text-small text-muted">Founder and tool builder</p>
      </div>
      <p>
        Sikander is a web developer and the founder of MeasuredCup. He builds the site&apos;s
        converters and maintains the ingredient dataset, working from USDA FoodData Central and the
        King Arthur Baking weight chart. He&apos;s not a chef or a nutritionist, which is why every
        number on the site links to its source.
      </p>
      <p>
        <a href={AUTHOR.linkedin} rel="me noopener" target="_blank" className="link">
          LinkedIn
        </a>
      </p>
      <h2>Pages by Sikander</h2>
      <ul className="list-disc space-y-1 pl-5">
        {byHim.map((p) => (
          <li key={p.slug}>
            <Link href={p.slug} prefetch={false} className="link">{p.h1}</Link>
          </li>
        ))}
      </ul>
    </TrustFrame>
  );
}
