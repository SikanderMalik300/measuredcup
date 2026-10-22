import Link from 'next/link';
import { SITE_EMAIL } from '@/lib/data/site';

const TOOLS = [
  { href: '/grams-to-cups/', label: 'Grams to cups' },
  { href: '/cups-to-grams/', label: 'Cups to grams' },
  { href: '/tablespoons-to-grams/', label: 'Tablespoons to grams' },
  { href: '/butter-converter/', label: 'Butter converter' },
  { href: '/half-a-measurement/', label: 'Half a measurement' },
  { href: '/recipe-scaler/', label: 'Recipe scaler' },
  { href: '/data/ingredient-weights/', label: 'Ingredient weights' },
  { href: '/free-kitchen-calculators-for-your-site/', label: 'Calculators for your site' },
];
const TRUST = [
  { href: '/about/', label: 'About' },
  { href: '/how-we-calculate/', label: 'How we calculate' },
  { href: '/editorial-policy/', label: 'Editorial policy' },
  { href: '/contact/', label: 'Contact' },
];
const LEGAL = [
  { href: '/privacy/', label: 'Privacy' },
  { href: '/terms/', label: 'Terms' },
  { href: '/disclaimer/', label: 'Disclaimer' },
  { href: '/affiliate-disclosure/', label: 'Affiliate disclosure' },
  { href: '/sitemap/', label: 'Sitemap' },
];

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-small font-medium text-ink">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} prefetch={false} className="text-small text-muted hover:text-brand">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <div className="mx-auto max-w-container px-4 py-12 md:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Column title="Tools" links={TOOLS} />
          <Column title="Trust" links={TRUST} />
          <Column title="Legal" links={LEGAL} />
        </div>
        <div className="mt-10 space-y-1 text-small text-muted">
          <p>
            MeasuredCup by Sikander Malik ·{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="hover:text-brand">
              {SITE_EMAIL}
            </a>
          </p>
          <p>Values are averages for typical US products.</p>
          <p>
            <a
              href="https://www.pinterest.com/measuredcup/"
              rel="me noopener"
              target="_blank"
              className="hover:text-brand"
            >
              Pinterest
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
