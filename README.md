# MeasuredCup

Kitchen and baking measurement tools backed by a public, sourced ingredient-weight dataset
(USDA FoodData Central SR Legacy and the King Arthur Baking ingredient weight chart).

Static, pre-rendered site. All maths runs client-side in pure TypeScript in `lib/calc/`, each function
covered by Vitest tests. Every number comes from `lib/data/constants.ts` or `lib/data/ingredients.ts`
with a source comment.

## Stack

- Next.js 15 (App Router), TypeScript strict, Tailwind CSS, Vitest.
- `next.config.mjs`: `output: 'export'`, `trailingSlash: true`, `images.unoptimized`.
- Node 22+ (built on Node 24). Host: Cloudflare Pages. Build `npm run build`, output `out`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm test` | Vitest (calc engine, tables, copy rules, FAQ/JSON-LD parity) |
| `npm run build` | Static export to `out/` |
| `npm run assets` | Regenerate favicons, `logo-512.png`, per-page OG images (needs network for the font) |
| `npm run images` | Download and process the Unsplash photos into AVIF/WebP/JPEG |

Generated assets in `public/` (photos, OG images, favicons) are committed so the Cloudflare build is
deterministic and offline. Re-run `npm run assets` / `npm run images` to refresh them.

## Structure

- `lib/calc/` conversion engine: `convert.ts`, `kitchen.ts` (`toKitchenMeasure`), `fraction.ts`
  (`parseAmount`, `formatFraction`), `round.ts`, `scale.ts`, `tables.ts`.
- `lib/data/` single sources of truth: `constants.ts`, `ingredients.ts` (23 ingredients, each with
  `usdaFdcId` and the exact portion text), `pages.ts` (page registry; drives sitemap, hubs, related
  links, breadcrumbs, llms.txt, FAQ), `photos.ts`, `corrections.ts`, `site.ts`.
- `app/` one route per page; tool UIs are small client islands under `components/tools/`.
- `scripts/` build-time asset generation.

## Data provenance

USDA values are verified against the FoodData Central SR Legacy 2018-04 CSV (public domain). King
Arthur values are facts quoted from their published chart with attribution. See `BUILD-REPORT.md`.

## Environment variables

- `NEXT_PUBLIC_WEB3FORMS_KEY` — contact form.
- `NEXT_PUBLIC_GA_ID` — optional GA4 (ships only when set).
- `NEXT_PUBLIC_ADSENSE_ID` — optional AdSense (ad slots stay empty and height-reserved until set).
