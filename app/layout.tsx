import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Analytics } from '@/components/Analytics';
import { organizationSchema, websiteSchema } from '@/lib/seo';
import { SITE_NAME, SITE_URL, SITE_TAGLINE } from '@/lib/data/site';

const figtree = localFont({
  src: [
    { path: './fonts/figtree-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/figtree-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/figtree-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${SITE_TAGLINE}`,
    template: `%s`,
  },
  description:
    'Free kitchen converters that work ingredient by ingredient, using public USDA data and the King Arthur Baking weight chart.',
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
