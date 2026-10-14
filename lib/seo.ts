import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, ORG_LOGO, SITE_EMAIL, AUTHOR } from './data/site';
import { CATEGORIES, findPage, type PageEntry } from './data/pages';

export function ogImagePath(slug: string): string {
  const name = slug === '/' ? 'home' : slug.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-');
  return `/og/${name}.png`;
}

export function canonical(slug: string): string {
  return SITE_URL + slug;
}

export function buildMetadata(slug: string): Metadata {
  const page = findPage(slug);
  if (!page) throw new Error(`No page for ${slug}`);
  const url = canonical(slug);
  const og = SITE_URL + ogImagePath(slug);
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: og, width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.metaDescription,
      images: [og],
    },
  };
}

export interface Crumb {
  name: string;
  slug: string;
}

/** Breadcrumb trail (excludes nothing; the component hides it on home). */
export function getBreadcrumbs(slug: string): Crumb[] {
  const crumbs: Crumb[] = [{ name: 'Home', slug: '/' }];
  const page = findPage(slug);
  if (!page || slug === '/') return crumbs;

  if ((page.kind === 'tool' || page.kind === 'data') && page.category) {
    const hub = CATEGORIES[page.category];
    crumbs.push({ name: hub.title, slug: hub.slug });
    crumbs.push({ name: page.h1, slug });
  } else {
    crumbs.push({ name: page.h1, slug });
  }
  return crumbs;
}

// ---- JSON-LD builders ----

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: ORG_LOGO,
    email: SITE_EMAIL,
    founder: { '@id': AUTHOR.id },
    sameAs: [] as string[],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function breadcrumbSchema(slug: string) {
  const crumbs = getBreadcrumbs(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: SITE_URL + c.slug,
    })),
  };
}

export function faqSchema(page: PageEntry) {
  if (!page.faq || page.faq.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function webApplicationSchema(page: PageEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.h1,
    url: canonical(page.slug),
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@id': AUTHOR.id },
  };
}

export function collectionPageSchema(page: PageEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.h1,
    url: canonical(page.slug),
    description: page.metaDescription,
  };
}

export function datasetSchema(page: PageEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Ingredient weights per cup: USDA vs King Arthur',
    description: page.metaDescription,
    creator: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isBasedOn: 'https://fdc.nal.usda.gov/download-datasets/',
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/csv',
        contentUrl: SITE_URL + '/data/ingredient-weights.csv',
      },
    ],
  };
}

export function profilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': AUTHOR.id,
      name: AUTHOR.name,
      url: AUTHOR.url,
      jobTitle: AUTHOR.jobTitle,
    },
  };
}
