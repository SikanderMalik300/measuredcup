import Link from 'next/link';
import { getBreadcrumbs } from '@/lib/seo';

export function Breadcrumbs({ slug }: { slug: string }) {
  const crumbs = getBreadcrumbs(slug);
  if (slug === '/' || crumbs.length <= 1) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-small text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.slug} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <>
                  <Link href={c.slug} prefetch={false} className="hover:text-brand">
                    {c.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
