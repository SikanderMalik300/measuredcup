import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { buildMetadata, buildPageGraph } from '@/lib/seo';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { Section, Prose, UpdatedLine } from '@/components/content';
import { EmbedPreview } from '@/components/embed/EmbedPreview';
import { getPage } from '@/lib/data/pages';
import { EMBEDS } from '@/lib/data/embeds';

const SLUG = '/free-kitchen-calculators-for-your-site/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  const page = getPage(SLUG);

  return (
    <div className="mx-auto max-w-container px-4 py-8 md:px-10">
      <JsonLd data={buildPageGraph(SLUG)} />
      <Breadcrumbs slug={SLUG} />
      <h1 className="mt-4">{page.h1}</h1>
      <UpdatedLine date={page.lastUpdated} />
      <Prose>
        <p className="mt-4">
          Run a baking blog, a cooking class page or a recipe site? Add any of these converters to
          your pages for free. Each one uses the same sourced USDA and King Arthur data as
          MeasuredCup, loads fast, and has no ads or tracking.
        </p>
      </Prose>

      {EMBEDS.map((e) => {
        const tool = getPage(e.slug);
        return (
          <Section key={e.slug} title={e.title} id={e.slug.replace(/\//g, '') || 'tool'}>
            <p className="text-muted">{tool.tileLine}</p>
            <EmbedPreview slug={e.slug} />
            <p className="mt-3">
              <Link href={e.slug} prefetch={false} className="link">
                Open the full {tool.h1} tool
              </Link>
            </p>
          </Section>
        );
      })}

      <Section title="Terms" id="terms">
        <Prose>
          <p>
            Free for personal and commercial sites. Please keep the credit line under the calculator.
            Don&apos;t put the calculator behind a paywall, and don&apos;t change the numbers it
            shows. If something breaks, email hello@measuredcup.com.
          </p>
        </Prose>
      </Section>

      <Script src="/embed.js" strategy="afterInteractive" />
    </div>
  );
}
