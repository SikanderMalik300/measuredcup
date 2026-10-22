import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PAGES, sitemapPages } from '@/lib/data/pages';
import { EMBEDS, getEmbed, embedMetadata } from '@/lib/data/embeds';
import { embedSnippet } from '@/lib/embed-snippet';
import { SITE_URL } from '@/lib/data/site';

const ROOT = process.cwd();
const LANDING = '/free-kitchen-calculators-for-your-site/';

// The exact snippet shape from the spec (slug, title and height filled in).
function expectedSnippet(slug: string): string {
  const { title, height } = getEmbed(slug);
  return `<iframe src="${SITE_URL}/embed${slug}" title="${title}" data-measuredcup width="100%" height="${height}" style="border:0;max-width:640px;width:100%" loading="lazy"></iframe>
<p style="font:13px/1.4 sans-serif;margin:4px 0 0">${title} by <a href="${SITE_URL}${slug}">MeasuredCup</a></p>
<script src="${SITE_URL}/embed.js" async></script>`;
}

describe('embed pages (E1)', () => {
  for (const e of EMBEDS) {
    it(`${e.slug} embed is noindex`, () => {
      const robots = embedMetadata(e.slug).robots as { index: boolean; follow: boolean };
      expect(robots.index).toBe(false);
      expect(robots.follow).toBe(true);
    });

    it(`${e.slug} embed canonical points to its tool page`, () => {
      const alt = embedMetadata(e.slug).alternates as { canonical: string };
      expect(alt.canonical).toBe(`${SITE_URL}${e.slug}`);
    });

    it(`${e.slug} embed page file exists`, () => {
      const file = path.join(ROOT, 'app/embed', e.slug.replace(/^\/|\/$/g, ''), 'page.tsx');
      expect(fs.existsSync(file)).toBe(true);
    });
  }

  it('no /embed/ route is in the sitemap', () => {
    const offenders = sitemapPages().filter((p) => p.slug.startsWith('/embed/'));
    expect(offenders).toEqual([]);
  });

  it('embed tools are not registered as normal pages', () => {
    const slugs = new Set(PAGES.map((p) => p.slug));
    for (const e of EMBEDS) expect(slugs.has(`/embed${e.slug}`)).toBe(false);
  });

  it('the embed route tree loads no analytics (no gtag)', () => {
    const files = ['app/embed/layout.tsx', ...EMBEDS.map((e) => `app/embed${e.slug}page.tsx`)];
    for (const f of files) {
      const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
      expect(text).not.toMatch(/Analytics|gtag|googletagmanager/);
    }
  });
});

describe('embed snippet (E3)', () => {
  for (const e of EMBEDS) {
    it(`${e.slug} snippet matches the exact shape and slug`, () => {
      const snippet = embedSnippet(e.slug);
      expect(snippet).toBe(expectedSnippet(e.slug));
      expect(snippet).toContain(`src="${SITE_URL}/embed${e.slug}"`);
      expect(snippet).toContain(`href="${SITE_URL}${e.slug}"`);
      expect(snippet).toContain(`${SITE_URL}/embed.js`);
    });
  }

  it('every tool page with an embed shows the Get-this-calculator box', () => {
    for (const e of EMBEDS) {
      const file = path.join(ROOT, 'app/(site)', e.slug.replace(/^\/|\/$/g, ''), 'page.tsx');
      const text = fs.readFileSync(file, 'utf8');
      expect(text).toContain('<EmbedBox slug={SLUG} />');
    }
  });
});

describe('landing page (E4)', () => {
  it('is in the sitemap', () => {
    expect(sitemapPages().some((p) => p.slug === LANDING)).toBe(true);
  });

  it('is linked from /converters/', () => {
    const text = fs.readFileSync(path.join(ROOT, 'app/(site)/converters/page.tsx'), 'utf8');
    expect(text).toContain(LANDING);
  });

  it('is linked from the footer Tools column', () => {
    const text = fs.readFileSync(path.join(ROOT, 'components/Footer.tsx'), 'utf8');
    expect(text).toContain(LANDING);
  });
});
