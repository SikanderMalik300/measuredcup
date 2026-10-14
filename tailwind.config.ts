import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens (measuredcup-design.md section 3). Backed by CSS vars.
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        brand: 'var(--brand)',
        'brand-hover': 'var(--brand-hover)',
        'band-1': 'var(--band-1)',
        'band-2': 'var(--band-2)',
        'band-3': 'var(--band-3)',
        paper: 'var(--paper)',
      },
      fontFamily: {
        sans: ['var(--font-figtree)', 'system-ui', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
        prose: '70ch',
        main: '760px',
        trust: '720px',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(0,0,0,.04)',
      },
      borderRadius: {
        photo: '4px',
        card: '16px',
        pill: '999px',
      },
      fontSize: {
        // scale from design section 2
        h1: ['40px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '500' }],
        'h1-m': ['30px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '500' }],
        h2: ['28px', { lineHeight: '1.2', fontWeight: '500' }],
        'h2-m': ['24px', { lineHeight: '1.25', fontWeight: '500' }],
        h3: ['20px', { lineHeight: '1.3', fontWeight: '500' }],
        body: ['16px', { lineHeight: '1.6' }],
        small: ['14px', { lineHeight: '1.5' }],
        result: ['34px', { lineHeight: '1.1', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};

export default config;
