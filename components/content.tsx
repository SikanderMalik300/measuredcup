import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { Faq } from './Faq';
import { Sources } from './Sources';
import { AuthorBox } from './AuthorBox';
import { AdSlot } from './AdSlot';
import { Picture } from './Picture';
import { JsonLd } from './JsonLd';
import { DISCLAIMER } from '@/lib/data/site';
import { getPage, findPage, type PageEntry } from '@/lib/data/pages';
import { findPhoto } from '@/lib/data/photos';
import {
  breadcrumbSchema,
  faqSchema,
  webApplicationSchema,
} from '@/lib/seo';

export function Section({
  title,
  id,
  children,
  className,
}: {
  title?: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mt-10 ${className ?? ''}`} aria-labelledby={title ? `${id ?? ''}-h` : undefined}>
      {title && (
        <h2 id={id ? `${id}-h` : undefined}>{title}</h2>
      )}
      <div className={title ? 'mt-3' : ''}>{children}</div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose-measure space-y-3 text-ink">{children}</div>;
}

export function QuickAnswer({ children }: { children: React.ReactNode }) {
  return (
    <p className="prose-measure mt-4 text-[18px] leading-relaxed text-ink">{children}</p>
  );
}

export function Steps({ items }: { items: string[] }) {
  return (
    <ol className="prose-measure mt-3 list-decimal space-y-2 pl-5 text-ink">
      {items.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  );
}

export function Tips({ items }: { items: string[] }) {
  return (
    <ul className="prose-measure mt-3 list-disc space-y-2 pl-5 text-ink">
      {items.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>
  );
}

export function Formula({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 rounded-card border border-line bg-paper px-4 py-3 font-medium tabular text-ink">
      {children}
    </p>
  );
}

export function InPagePhoto({ photoId }: { photoId?: string }) {
  const photo = findPhoto(photoId);
  if (!photo) return null;
  return (
    <figure className="mt-10">
      <div className="overflow-hidden rounded-photo">
        <Picture
          photo={photo}
          variant="inline"
          width={720}
          height={405}
          sizes="(max-width: 767px) 100vw, 720px"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-2 text-small text-muted">
        Photo: {photo.photographer} / {photo.source}
      </figcaption>
    </figure>
  );
}

export function RelatedTools({ slugs }: { slugs: string[] }) {
  const pages = slugs.map((s) => findPage(s)).filter(Boolean) as PageEntry[];
  if (pages.length === 0) return null;
  return (
    <section aria-labelledby="related-h" className="card p-5">
      <h2 id="related-h" className="text-h3">Related tools</h2>
      <ul className="mt-3 space-y-2">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.slug}
              prefetch={false}
              className="inline-flex items-center gap-1 text-brand hover:text-brand-hover"
            >
              {p.h1}
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Shared frame for the six tool pages (build spec A5 order). */
export function ToolPageFrame({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const page = getPage(slug);
  const schema: object[] = [
    webApplicationSchema(page),
    breadcrumbSchema(slug),
  ];
  const faq = faqSchema(page);
  if (faq) schema.push(faq);

  return (
    <div className="mx-auto max-w-container px-4 py-8 md:px-10">
      <JsonLd data={schema} />
      <Breadcrumbs slug={slug} />
      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,760px)_300px]">
        <article>
          <h1>{page.h1}</h1>
          {children}
          {page.faq && (
            <Section>
              <Faq items={page.faq} />
            </Section>
          )}
          <Section>
            <Sources sources={page.sources} />
          </Section>
          <Section>
            <AuthorBox lastUpdated={page.lastUpdated} />
          </Section>
          <p className="mt-6 text-small text-muted">{DISCLAIMER}</p>
        </article>
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <RelatedTools slugs={page.related} />
          <AdSlot position="sidebar" />
        </aside>
      </div>
    </div>
  );
}
