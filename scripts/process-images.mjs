// Download each Unsplash photo and generate AVIF, WebP and JPEG at the required widths, cropped to
// the focal point (measuredcup-design.md section 7). Originals must be at least 1600px on the long
// side; if smaller, the slot is reported and skipped (no upscaling).

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'photos');
const CACHE = path.join(ROOT, '.cache', 'photos');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

// Kept in sync with lib/data/photos.ts. role: 'hero' or 'tile+inline'.
const PHOTOS = [
  { id: 'hero-flour-cup', file: 'hero-flour-cup', url: 'https://unsplash.com/photos/O-WdR304HnM/download?force=true', fx: 0.5, fy: 0.45, role: 'hero' },
  { id: 'scale-flour', file: 'scale-flour', url: 'https://unsplash.com/photos/u3gMcNvqrnI/download?force=true', fx: 0.5, fy: 0.55, role: 'tile+inline' },
  { id: 'four-cups', file: 'four-cups', url: 'https://unsplash.com/photos/mLlM83CsG3I/download?force=true', fx: 0.5, fy: 0.45, role: 'tile+inline' },
  { id: 'nested-spoons', file: 'nested-spoons', url: 'https://unsplash.com/photos/yvRG4QXsIIY/download?force=true', fx: 0.45, fy: 0.5, role: 'tile+inline' },
  { id: 'butter-flour-eggs', file: 'butter-flour-eggs', url: 'https://unsplash.com/photos/Zqh5l1JWs5M/download?force=true', fx: 0.7, fy: 0.75, role: 'tile+inline' },
  { id: 'copper-cups-paper', file: 'copper-cups-paper', url: 'https://unsplash.com/photos/AemWnTSPxoE/download?force=true', fx: 0.35, fy: 0.4, role: 'tile+inline' },
  { id: 'cookbooks-counter', file: 'cookbooks-counter', url: 'https://unsplash.com/photos/yjYxtxLOiF4/download?force=true', fx: 0.55, fy: 0.6, role: 'tile+inline' },
  { id: 'scale-brown-sugar', file: 'scale-brown-sugar', url: 'https://unsplash.com/photos/zfom3V5vnhg/download?force=true', fx: 0.5, fy: 0.4, role: 'tile+inline' },
];

// width -> aspect (w/h)
const TILE_WIDTHS = [300, 600]; // square
const INLINE_WIDTHS = [720]; // 16:9
const HERO_WIDTHS = [640, 1280]; // 3:2

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return fs.readFileSync(dest);
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`download ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf;
}

function cropRect(W, H, aspect, fx, fy) {
  const srcAspect = W / H;
  let cw, ch;
  if (srcAspect > aspect) {
    ch = H;
    cw = Math.round(H * aspect);
  } else {
    cw = W;
    ch = Math.round(W / aspect);
  }
  let left = Math.round(fx * W - cw / 2);
  let top = Math.round(fy * H - ch / 2);
  left = Math.max(0, Math.min(left, W - cw));
  top = Math.max(0, Math.min(top, H - ch));
  return { left, top, width: cw, height: ch };
}

async function emit(srcBuf, meta, photo, width, aspect, report, maxKb) {
  const height = Math.round(width / aspect);
  const rect = cropRect(meta.width, meta.height, aspect, photo.fx, photo.fy);
  const base = sharp(srcBuf).extract(rect).resize(width, height, { fit: 'cover' });

  const avifPath = path.join(OUT, `${photo.file}-${width}.avif`);
  const webpPath = path.join(OUT, `${photo.file}-${width}.webp`);
  const jpgPath = path.join(OUT, `${photo.file}-${width}.jpg`);

  // Step AVIF quality down until the file meets its byte budget.
  let avifKb = Infinity;
  for (const q of [60, 55, 50, 45, 40, 35]) {
    await base.clone().avif({ quality: q }).toFile(avifPath);
    avifKb = Math.round(fs.statSync(avifPath).size / 1024);
    if (!maxKb || avifKb <= maxKb) break;
  }
  await base.clone().webp({ quality: 75 }).toFile(webpPath);
  await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(jpgPath);

  report.push({ file: `${photo.file}-${width}`, avifKb });
  return avifKb;
}

async function main() {
  const report = [];
  const warnings = [];
  for (const photo of PHOTOS) {
    const orig = path.join(CACHE, `${photo.file}.orig`);
    const buf = await download(photo.url, orig);
    const meta = await sharp(buf).metadata();
    const longSide = Math.max(meta.width, meta.height);
    if (longSide < 1600) {
      warnings.push(`SKIP ${photo.id}: original long side ${longSide}px < 1600px`);
      continue;
    }
    if (photo.role === 'hero') {
      for (const w of HERO_WIDTHS) {
        const kb = await emit(buf, meta, photo, w, 3 / 2, report, w === 1280 ? 120 : 0);
        if (w === 1280 && kb > 120) warnings.push(`${photo.id} hero 1280 AVIF ${kb}KB > 120KB`);
      }
    } else {
      for (const w of TILE_WIDTHS) {
        const kb = await emit(buf, meta, photo, w, 1, report, w === 600 ? 35 : 0);
        if (w === 600 && kb > 35) warnings.push(`${photo.id} tile 600 AVIF ${kb}KB > 35KB`);
      }
      for (const w of INLINE_WIDTHS) {
        await emit(buf, meta, photo, w, 16 / 9, report, 60);
      }
    }
    console.log(`processed ${photo.id} (${meta.width}x${meta.height})`);
  }

  console.log('\nAVIF sizes:');
  for (const r of report) console.log(`  ${r.file}.avif  ${r.avifKb} KB`);
  if (warnings.length) {
    console.log('\nWARNINGS:');
    for (const w of warnings) console.log('  ' + w);
  } else {
    console.log('\nAll image budgets met.');
  }
  // Write a small report file for the build summary.
  fs.writeFileSync(
    path.join(ROOT, '.cache', 'image-report.json'),
    JSON.stringify({ report, warnings }, null, 2),
  );
}

main().catch((e) => {
  console.error('process-images failed:', e);
  process.exit(1);
});
