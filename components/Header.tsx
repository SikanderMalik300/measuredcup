'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { Logo } from './Logo';

const NAV = [
  { href: '/converters/', label: 'Converters' },
  { href: '/recipe-tools/', label: 'Recipe tools' },
  { href: '/data/', label: 'Ingredient data' },
  { href: '/about/', label: 'About' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full border-b border-line bg-surface">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3 md:px-10">
        <Link href="/" prefetch={false} aria-label="MeasuredCup home" className="shrink-0">
          <span className="md:hidden">
            <Logo height={28} />
          </span>
          <span className="hidden md:inline-flex">
            <Logo height={32} />
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              prefetch={false}
              className="text-small text-ink hover:text-brand"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/#site-search"
            prefetch={false}
            aria-label="Search tools and ingredients"
            className="inline-flex h-11 w-11 items-center justify-center"
          >
            <Search size={20} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line md:hidden">
          <ul className="mx-auto max-w-container px-4 py-2">
            {NAV.map((n) => (
              <li key={n.href} className="border-b border-line last:border-b-0">
                <Link
                  href={n.href}
                  prefetch={false}
                  className="block py-3 text-ink hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li className="border-b border-line last:border-b-0">
              <Link
                href="/#site-search"
                prefetch={false}
                className="block py-3 text-ink hover:text-brand"
                onClick={() => setOpen(false)}
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
