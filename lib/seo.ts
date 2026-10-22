import type { Metadata } from 'next';
import {
  SITE_NAME,
  SITE_URL,
  ORG_LOGO,
  ORG_ID,
  ORG_SAMEAS,
  WEBSITE_ID,
  SITE_EMAIL,
  AUTHOR,
} from './data/site';
import { CATEGORIES, findPage, getPage, type PageEntry } from './data/pages';

const AUTHOR_SLUG = '/authors/sikander-malik/';
const DATA_SLUG = '/data/ingredient-weights/';

/** Page title without the " | MeasuredCup" suffix, for schema names. */
function pageName(title: string): string {
  return title.replace(/\s*\|\s*MeasuredCup$/, '');
}

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
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: ORG_LOGO,
    email: SITE_EMAIL,
    founder: { '@id': AUTHOR.id },
    sameAs: ORG_SAMEAS,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
  };
}

/** Full Person node for the author (emitted on the author page). */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': AUTHOR.id,
    name: AUTHOR.name,
    url: AUTHOR.url,
    jobTitle: AUTHOR.jobTitle,
    image: AUTHOR.image,
    sameAs: [AUTHOR.linkedin],
    worksFor: { '@id': ORG_ID },
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
    '@id': canonical(page.slug) + '#app',
    name: page.h1,
    url: canonical(page.slug),
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@id': AUTHOR.id },
  };
}

export function datasetSchema(page: PageEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': canonical(page.slug) + '#dataset',
    name: 'Ingredient weights per cup: USDA vs King Arthur',
    description: page.metaDescription,
    creator: { '@id': ORG_ID },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isBasedOn: 'https://fdc.nal.usda.gov/download-datasets/',
    datePublished: page.datePublished,
    dateModified: page.lastUpdated,
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/csv',
        contentUrl: SITE_URL + '/data/ingredient-weights.csv',
      },
    ],
  };
}

/**
 * One page node per page: ProfilePage on the author page, CollectionPage on hubs, WebPage elsewhere.
 * Carries author, publisher, datePublished and dateModified (build spec addendum F1).
 */
export function pageNode(page: PageEntry) {
  const url = canonical(page.slug);
  const type =
    page.slug === AUTHOR_SLUG ? 'ProfilePage' : page.kind === 'hub' ? 'CollectionPage' : 'WebPage';
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': url + '#webpage',
    url,
    name: pageName(page.title),
    description: page.metaDescription,
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': AUTHOR.id },
    publisher: { '@id': ORG_ID },
    datePublished: page.datePublished,
    dateModified: page.lastUpdated,
  };
  if (page.kind === 'tool') node.mainEntity = { '@id': url + '#app' };
  else if (page.slug === DATA_SLUG) node.mainEntity = { '@id': url + '#dataset' };
  else if (type === 'ProfilePage') node.mainEntity = { '@id': AUTHOR.id };
  return node;
}

/** The full JSON-LD graph for a page: page node + its main entity + breadcrumb + FAQ (+ Person on author). */
export function buildPageGraph(slug: string): object[] {
  const page = getPage(slug);
  const nodes: object[] = [pageNode(page)];
  if (page.kind === 'tool') nodes.push(webApplicationSchema(page));
  if (slug === DATA_SLUG) nodes.push(datasetSchema(page));
  if (slug === AUTHOR_SLUG) nodes.push(personSchema());
  if (slug !== '/') nodes.push(breadcrumbSchema(slug));
  const faq = faqSchema(page);
  if (faq) nodes.push(faq);
  return nodes;
}
