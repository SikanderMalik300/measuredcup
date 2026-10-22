// The 4 tools offered as iframe embeds. `height` is the default iframe height:
// each tool's default state measured at 390px wide, +24px, rounded up to a multiple of 20.
// embed.js resizes past this; the number is the no-JS fallback height.
import type { Metadata } from 'next';
import { SITE_URL } from './site';

export type EmbedTool = {
  slug: string;
  title: string;
  height: number;
};

export const EMBEDS: EmbedTool[] = [
  { slug: '/grams-to-cups/', title: 'Grams to cups converter', height: 640 },
  { slug: '/tablespoons-to-grams/', title: 'Tablespoons to grams converter', height: 700 },
  { slug: '/butter-converter/', title: 'Butter converter', height: 620 },
  { slug: '/recipe-scaler/', title: 'Recipe scaler', height: 900 },
];

export function getEmbed(slug: string): EmbedTool {
  const e = EMBEDS.find((x) => x.slug === slug);
  if (!e) throw new Error(`No embed registered for ${slug}`);
  return e;
}

// Metadata for an /embed/<slug>/ page: noindex (but followable), canonical to the full tool page.
export function embedMetadata(slug: string): Metadata {
  const { title } = getEmbed(slug);
  return {
    title,
    alternates: { canonical: `${SITE_URL}${slug}` },
    robots: { index: false, follow: true },
  };
}
