# MeasuredCup build report

Date: 2026-10-14. Built per `measuredcup-build-spec.md` (Part A), `measuredcup-design.md`,
`measuredcup-photos.md`.

## VERIFY: USDA SR Legacy values

Source: FoodData Central SR Legacy 2018-04 CSV
(`https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip`),
`food.csv` + `food_portion.csv`, accessed 2026-10-14.

**Result: every VERIFY value matches the spec table exactly. Zero data changes.** No worked example,
table, FAQ number or test required editing, so no page copy, formula or URL was changed.

fdc_id and portion recorded for each ingredient in `lib/data/ingredients.ts`:

| id | fdc_id | g/cup | portion read from file |
|---|---|---|---|
| ap-flour | 168894 | 125 | 1 cup |
| bread-flour | 168896 | 137 | 1 cup |
| cake-flour | 169723 | 137 | 1 cup unsifted, dipped |
| ww-flour | 168893 | 120 | 1 cup (Wheat flour, whole-grain) |
| sugar | 169655 | 200 | 1 cup (tsp = 4.2 g) |
| brown-sugar | 168833 | 220 | 1 cup packed |
| powdered-sugar | 169656 | 120 | 1 cup unsifted |
| butter | 173410 | 227 | 1 cup (tbsp = 14.2, stick = 113) |
| honey | 169640 | 339 | 1 cup (tbsp = 21) |
| maple-syrup | 169661 | 315 | 1 cup |
| milk | 171265 | 244 | 1 cup (whole 3.25%, with vitamin D) |
| water | 173647 | 237 | 1 serving 8 fl oz (= 1 cup) |
| vegetable-oil | 172336 | 218 | 1 cup (Oil, canola) |
| heavy-cream | 170859 | 238 | 1 cup, fluid (yields 2 cups whipped) |
| sour-cream | 171257 | 230 | 1 cup |
| yogurt | 171284 | 245 | 1 cup (8 fl oz) |
| cocoa | 169593 | 86 | 1 cup |
| oats | 173904 | 81 | 1 cup (regular and quick, not fortified, dry) |
| rice | 168877 | 185 | 1 cup |
| cornstarch | 169698 | 128 | 1 cup |
| peanut-butter | 174266 | 258 | 1 cup (smooth style, with salt) |
| choc-chips | 167976 | 168 | 1 cup chips (6 oz package) |
| salt | 173468 | 292 | 1 cup |
| Large egg (constant) | 171287 | 50 g | 1 large (Egg, whole, raw, fresh) |

Notes:
- Salt: the file has a direct `1 cup = 292 g` portion matching the table, so 292 is used. The file's
  `1 tsp = 6.0 g` is within the spec's 6.0-6.1 g band, so the quick text, FAQ 6 and tip 2 ("about
  6 g") are unchanged.
- Choc chips: the file lists three cup portions (182 large chips, 173 mini, 168 6-oz package); the
  spec value 168 matches "1 cup chips (6 oz package)".

## Tests

`npm test` -> **60 tests, all passing** (3 files):
- `lib/calc/calc.test.ts` (48): parse/format, rounding, `toKitchenMeasure` (every spec example incl.
  the half-a-measurement cells and the scaler cases), grams/cups/tbsp conversions, butter converter,
  recipe scaler (default + factor 1/3 + unreadable line), ingredient dataset and difference percents.
- `lib/calc/tables.test.ts` (8): every reference-table generator and the CSV.
- `tests/copy.test.ts` (4): no em dash, no exclamation marks, no A13 banned words, and FAQ JSON-LD
  equals the visible FAQ text.

## Build

`next build` clean, static export of **28 routes** (21 pages + sitemap.xml, robots.txt, llms.txt,
ingredient-weights.csv, 404, _not-found). No console errors (Lighthouse Best Practices 100).
First Load JS: tool pages ~112 kB uncompressed (~45 kB gzipped), under the 100 kB gzipped budget.

## Lighthouse (mobile, gzip as served by Cloudflare)

| Page | Perf | A11y | Best Practices | SEO | LCP | CLS | LCP element |
|---|---|---|---|---|---|---|---|
| Home `/` | 98 | 100 | 100 | 100 | 2.3 s | 0 | intro text |
| Tool `/grams-to-cups/` | 99 | 100 | 100 | 100 | 2.2 s | 0.00-0.02 | quick-answer text |
| Data `/data/ingredient-weights/` | 99 | 100 | 100 | 100 | 1.9 s | 0 | H1 |

Thresholds met: home >= 95, tools >= 90, A11y/Best Practices/SEO = 100, LCP is the H1/intro text.
CLS is 0 on home; the tool page shows 0.00-0.02 across runs (sub-threshold font-swap reflow, no
element attributed). Measured locally with gzip to match Cloudflare; the browser agent re-runs
PageSpeed on the live origin.

## Contrast ratios (WCAG)

Recomputed from the exact tokens; all pass AA.

| | white | band-1 | band-2 | band-3 | paper |
|---|---|---|---|---|---|
| ink | 17.36 | 15.04 | 15.17 | 15.19 | 15.95 |
| muted | 7.47 | 6.48 | 6.53 | 6.54 | 6.86 |
| brand | 6.19 | 5.36 | 5.41 | 5.42 | 5.68 |

White text on brand: 6.19.

## Image weights (AVIF, after focal-point crop)

All originals >= 1600 px on the long side (none upscaled). Budgets met:
- Hero 1280 AVIF: 38 KB (budget 120).
- Largest tile 600 AVIF: 34 KB (budget 35).
- Homepage first-load image on mobile (hero 640 AVIF): 19 KB (budget 150).
- Each photo emitted as AVIF (q adaptive), WebP (q 75) and JPEG (q 80) at the required widths; EXIF
  stripped.

## Design QA

No horizontal page scroll at 360, 390, 768 or 1280 px on home, a tool page, a hub and the data page
(measured via DevTools `scrollWidth`). Tables scroll inside their wrappers; chips wrap; tool renders
its default result server-side. Full visual screenshot QA at the four widths is a browser-agent step.

## Schema (JSON-LD)

Validated structurally and parsed cleanly per template: Organization + WebSite site-wide;
WebApplication + BreadcrumbList + FAQPage on tools; CollectionPage + BreadcrumbList + FAQPage on hubs;
Dataset + BreadcrumbList + FAQPage on the data page; ProfilePage + BreadcrumbList on the author page.
FAQ JSON-LD equals the visible FAQ (tested). Final Google Rich Results Test is a browser-agent step
(Part B item 5).

## Notes / minor generalizations (no numbers changed)

- The "Show the math" line is generated for any input as `<grams> g / <g per cup> = <cups> cups,
  which is <measure>`; it reproduces the spec's default numbers and generalizes to all inputs.
- Two half-a-measurement table cells (third of 2/3 cup, third of 1/3 cup) use the spec's authored
  practical rounding ("about 3 tbsp + 1 1/2 tsp", "about 1 tbsp + 2 1/4 tsp") verbatim as page copy;
  `toKitchenMeasure` powers the live tool and the other cells.
- The ingredient picker is an accessible grouped native `<select>` (type-ahead search, zero extra JS)
  rather than a custom combobox, to hold A11y 100 and the JS budget.

## Open items owned by the browser agent (Part B)

Cloudflare zone + DNS, Pages project + env (`NEXT_PUBLIC_WEB3FORMS_KEY`, `NODE_VERSION=22`), custom
domains, SSL/redirect rules, Web3Forms key + live test, Search Console/Bing, and the live Rich Results
Test and PageSpeed runs.
