// Build-time asset generation: favicons, logo-512, and per-page OG images.
// Runs as `prebuild`. Network is used once to fetch the Figtree font (cached).

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import opentype from 'opentype.js';
import pngToIco from 'png-to-ico';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const OG_DIR = path.join(PUBLIC, 'og');
const CACHE = path.join(ROOT, '.cache');
const LOGO_DIR = path.join(ROOT, 'measuredcup-logo');

const FONT_URL = 'https://raw.githubusercontent.com/google/fonts/main/ofl/figtree/Figtree%5Bwght%5D.ttf';
const BRAND = '#9A4A2E';

fs.mkdirSync(OG_DIR, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

function stripMeta(svg) {
  return svg.replace(/<metadata>[\s\S]*?<\/metadata>/g, '');
}

// Mark paths from measuredcup-logo/logo-mark.svg (viewBox 0 0 48 48).
const MARK_PATHS = [
  'M7 11 H33 L30 40 H12 Z',
  'M7 11 L4.5 8.5',
  'M33 14 H39 Q42 14 41.6 17 L40.4 25 Q40 28 37 28 H31.6',
  'M14.5 19 H21',
  'M15 25.5 H21',
  'M15.5 32 H21',
];

function markGroup(x, y, scale, color) {
  const paths = MARK_PATHS.map((d) => `<path d="${d}" />`).join('');
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
}

async function getFont() {
  const cached = path.join(CACHE, 'figtree.ttf');
  if (!fs.existsSync(cached)) {
    const res = await fetch(FONT_URL);
    if (!res.ok) throw new Error(`Font download failed: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(cached, buf);
  }
  const buf = fs.readFileSync(cached);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

function textPath(font, text, x, y, size, color) {
  const p = font.getPath(text, x, y, size);
  p.fill = color;
  return `<path d="${p.toPathData(2)}" fill="${color}" />`;
}

function textWidth(font, text, size) {
  return font.getAdvanceWidth(text, size);
}

function wrap(font, text, size, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (textWidth(font, test, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Pages to generate OG images for (slug, H1). Kept in sync with lib/data/pages.ts.
const PAGES = [
  ['/', 'Kitchen converters that know your ingredient'],
  ['/grams-to-cups/', 'Grams to Cups Converter'],
  ['/cups-to-grams/', 'Cups to Grams Converter'],
  ['/tablespoons-to-grams/', 'Tablespoons to Grams Converter'],
  ['/butter-converter/', 'Butter Converter: Sticks, Cups, Tablespoons and Grams'],
  ['/half-a-measurement/', 'Half of a Measurement Calculator'],
  ['/recipe-scaler/', 'Recipe Scaler'],
  ['/data/ingredient-weights/', 'Ingredient Weights per Cup: USDA vs King Arthur'],
  ['/converters/', 'Kitchen converters'],
  ['/recipe-tools/', 'Recipe tools'],
  ['/data/', 'Ingredient data'],
  ['/about/', 'About MeasuredCup'],
  ['/how-we-calculate/', 'How we calculate'],
  ['/editorial-policy/', 'Editorial policy'],
  ['/authors/sikander-malik/', 'Sikander Malik'],
  ['/contact/', 'Contact'],
  ['/privacy/', 'Privacy policy'],
  ['/terms/', 'Terms of use'],
  ['/disclaimer/', 'Disclaimer'],
  ['/affiliate-disclosure/', 'Affiliate disclosure'],
  ['/sitemap/', 'Sitemap'],
];

function ogName(slug) {
  return slug === '/' ? 'home' : slug.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-');
}

async function genFavicons() {
  const squareRaw = fs.readFileSync(path.join(LOGO_DIR, 'favicon-square.svg'), 'utf8');
  const square = stripMeta(squareRaw);
  const svgBuf = Buffer.from(square);

  await sharp(svgBuf, { density: 384 }).resize(512, 512).png().toFile(path.join(PUBLIC, 'logo-512.png'));
  await sharp(svgBuf, { density: 384 }).resize(180, 180).png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'));
  const png48 = await sharp(svgBuf, { density: 192 }).resize(48, 48).png().toBuffer();
  const ico = await pngToIco([png48]);
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), ico);

  // icon.svg from favicon-square.svg (metadata stripped).
  fs.writeFileSync(path.join(PUBLIC, 'icon.svg'), square.trim() + '\n');
  console.log('favicons: logo-512.png, apple-touch-icon.png, favicon.ico, icon.svg');
}

async function genOg(font) {
  for (const [slug, h1] of PAGES) {
    const mark = markGroup(80, 70, 1.4, '#ffffff');
    const wordmark = textPath(font, 'MeasuredCup', 160, 122, 44, '#ffffff');
    const lines = wrap(font, h1, 64, 1040);
    const startY = 300;
    const lineH = 78;
    const h1Paths = lines
      .map((ln, i) => textPath(font, ln, 80, startY + i * lineH, 64, '#ffffff'))
      .join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="${BRAND}"/>
      ${mark}
      ${wordmark}
      ${h1Paths}
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(OG_DIR, `${ogName(slug)}.png`));
  }
  console.log(`og: ${PAGES.length} images`);
}

async function main() {
  await genFavicons();
  const font = await getFont();
  await genOg(font);
}

main().catch((e) => {
  console.error('gen-assets failed:', e);
  process.exit(1);
});
