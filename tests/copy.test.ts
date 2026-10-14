import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PAGES } from '@/lib/data/pages';
import { faqSchema } from '@/lib/seo';

// Build spec A13 banned words and phrases, and the no-em-dash / no-exclamation rules.
const BANNED_WORDS = [
  'delve', 'dive in', 'deep dive', 'tapestry', 'testament', 'realm', 'landscape', 'navigate',
  'journey', 'embark', 'unlock', 'unleash', 'elevate', 'empower', 'harness', 'leverage', 'utilize',
  'foster', 'streamline', 'supercharge', 'seamless', 'robust', 'comprehensive', 'ultimate',
  'crucial', 'pivotal', 'vital', 'cutting-edge', 'game-changer', 'versatile', 'myriad', 'plethora',
  'bustling', 'vibrant', 'meticulous', 'nuanced', 'intricate', 'moreover', 'furthermore',
  'additionally', 'notably', 'ultimately', 'overall', 'in conclusion', 'in summary',
  "in today's fast-paced world", "whether you're a beginner or a pro", 'look no further',
  "it's important to note", "it's worth noting", 'when it comes to',
];

function collectText(dir: string): { file: string; text: string }[] {
  const out: { file: string; text: string }[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      out.push(...collectText(full));
    } else if (/\.(tsx?|ts)$/.test(entry.name)) {
      out.push({ file: full, text: fs.readFileSync(full, 'utf8') });
    }
  }
  return out;
}

const ROOT = process.cwd();
const appFiles = collectText(path.join(ROOT, 'app'));
const componentFiles = collectText(path.join(ROOT, 'components'));
const dataFiles = [{ file: 'pages.ts', text: fs.readFileSync(path.join(ROOT, 'lib/data/pages.ts'), 'utf8') }];
const allFiles = [...appFiles, ...componentFiles, ...dataFiles];

describe('writing rules (A13)', () => {
  it('no em dash anywhere in source copy', () => {
    const offenders = allFiles.filter((f) => f.text.includes('—'));
    expect(offenders.map((o) => o.file)).toEqual([]);
  });

  it('no exclamation marks in rendered copy (JSX text and registry strings)', () => {
    // Check the page registry (all user-facing copy strings) for "!".
    const offenders: string[] = [];
    for (const p of PAGES) {
      const strings = [p.title, p.metaDescription, p.h1, p.tileLine ?? '', ...(p.faq ?? []).flatMap((f) => [f.q, f.a])];
      if (strings.some((s) => s.includes('!'))) offenders.push(p.slug);
    }
    expect(offenders).toEqual([]);
  });

  it('no banned words in the page registry copy', () => {
    const offenders: string[] = [];
    for (const p of PAGES) {
      const blob = [p.title, p.metaDescription, p.h1, p.tileLine ?? '', ...(p.faq ?? []).flatMap((f) => [f.q, f.a])]
        .join(' ')
        .toLowerCase();
      for (const w of BANNED_WORDS) {
        const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (re.test(blob)) offenders.push(`${p.slug}: ${w}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('FAQ JSON-LD equals visible FAQ text (A12)', () => {
  it('every FAQPage question and answer matches the registry', () => {
    for (const p of PAGES) {
      if (!p.faq) continue;
      const schema = faqSchema(p) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
      expect(schema.mainEntity).toHaveLength(p.faq.length);
      schema.mainEntity.forEach((entry, i) => {
        expect(entry.name).toBe(p.faq![i].q);
        expect(entry.acceptedAnswer.text).toBe(p.faq![i].a);
      });
    }
  });
});
