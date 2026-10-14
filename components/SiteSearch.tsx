'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export interface SearchItem {
  label: string;
  href: string;
  kind: 'Tool' | 'Ingredient';
}

const CHIPS = [
  { label: 'Grams to cups', href: '/grams-to-cups/' },
  { label: 'Cups to grams', href: '/cups-to-grams/' },
  { label: 'Butter', href: '/butter-converter/' },
  { label: 'Half a measurement', href: '/half-a-measurement/' },
  { label: 'Recipe scaler', href: '/recipe-scaler/' },
];

export function SiteSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const matches = useMemo(() => {
    if (query === '') return [];
    return items.filter((i) => i.label.toLowerCase().includes(query)).slice(0, 8);
  }, [query, items]);

  return (
    <div id="site-search">
      <div className="relative">
        <Search
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search tools and ingredients"
          placeholder="e.g. butter, 200 g flour, half of 3/4 cup"
          className="h-12 w-full rounded-pill border border-line bg-surface pl-11 pr-4 text-[16px] text-ink"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            prefetch={false}
            className="inline-flex min-h-[44px] items-center rounded-pill border border-line bg-surface px-4 text-small"
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div aria-live="polite" className="mt-3">
        {query !== '' && (
          matches.length > 0 ? (
            <ul className="card divide-y divide-line">
              {matches.map((m) => (
                <li key={m.href + m.label}>
                  <Link
                    href={m.href}
                    prefetch={false}
                    className="flex items-center justify-between px-4 py-3 hover:text-brand"
                  >
                    <span>{m.label}</span>
                    <span className="text-small text-muted">{m.kind}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-small text-muted">No matches. Try an ingredient or a tool name.</p>
          )
        )}
      </div>
    </div>
  );
}
