import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/data/site';
import { sitemapPages } from '@/lib/data/pages';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPages().map((p) => ({
    url: SITE_URL + p.slug,
    lastModified: p.lastUpdated,
    changeFrequency: p.kind === 'home' ? 'weekly' : 'monthly',
    priority: p.kind === 'home' ? 1 : p.kind === 'tool' || p.kind === 'data' ? 0.8 : 0.5,
  }));
}
