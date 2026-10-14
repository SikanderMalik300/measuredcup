# MeasuredCup.com build spec (Part A: coding agent, Part B: browser agent)

Date: 2026-10-14. Written by: browser agent. Owner and public author: Sikander Malik.
Domain: measuredcup.com (registrar Hostinger, DNS will move to Cloudflare).
Market: United States (US cups, tablespoons, teaspoons, ounces; metric shown alongside).
Model: hybrid tool-first site. Kitchen and baking measurement tools backed by a public, sourced ingredient-weight dataset.

Read this file together with `measuredcup-design.md` (all visual rules) and `measuredcup-photos.md` (every photo, credit and alt text).
All visible text below is final copy. Use it word for word. If something must change, ask first.

---

# PART A: CODING AGENT

## A0. Non-negotiables (MUST)

1. Static pre-rendered HTML for every page. All text, tables, FAQ and each tool's default example result must be in the initial HTML (view-source shows them).
2. All maths runs client-side in pure TypeScript functions in `lib/calc/`, each with unit tests (Vitest).
3. Units: US customary first, metric second. Every result shows grams and the US volume.
4. Every number on the site comes from `lib/data/constants.ts` or `lib/data/ingredients.ts`, and every value there has a source comment (name, URL, accessed date).
5. Lighthouse mobile: Performance at least 95 on the homepage, at least 90 on tool pages; Accessibility, Best Practices and SEO 100.
6. No fake reviews, ratings, testimonials, user counts or "as seen on" logos. Never add AggregateRating, Review or HowTo schema.
7. No em dashes (the long dash) anywhere in site copy. No exclamation marks.
8. No pages that differ only by a number or a swapped word (no "50 grams to cups", "150 grams to cups" pages). One tool page handles every amount. Tool state can live in URL parameters, but parameter URLs always canonicalize to the clean URL and are never linked internally.
9. No ad code at launch. Only an empty, height-reserved `AdSlot` component (see A10).

## A1. Stack

- Next.js (App Router) with TypeScript strict, Tailwind CSS, shadcn/ui only where needed, `next/font/google`, Vitest.
- `next.config`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }` (we pre-process images ourselves, see design file).
- Hosting: Cloudflare Pages (Vercel Hobby forbids commercial and ad sites). Build command `npm run build`, output directory `out`.
- Node 22.

## A2. Architecture

- Flat keyword URLs with trailing slash, for example `/grams-to-cups/`.
- `lib/data/pages.ts` is the single page registry: `slug, title, metaDescription, h1, category, related[], lastUpdated, sources[], notCovered, photoId, faq[]`. Sitemaps, hubs, related links, breadcrumbs and llms.txt are generated from it.
- Categories (hubs):
  - `/converters/` "Kitchen converters" (grams-to-cups, cups-to-grams, tablespoons-to-grams, butter-converter)
  - `/recipe-tools/` "Recipe tools" (half-a-measurement, recipe-scaler)
  - `/data/` "Ingredient data" (ingredient-weights)
- Shared conversion engine: `lib/calc/convert.ts` with functions
  - `gramsToCups(grams, ingredientId, source)`
  - `cupsToGrams(cups, ingredientId, source)`
  - `spoonsToGrams(amount, unit, ingredientId, source)`
  - `toKitchenMeasure(cups)` returns the nearest practical combination of cups, tablespoons and teaspoons. Leftover teaspoons round to the nearest 1/4 tsp when the total is 1/4 cup or more, and to the nearest 1/8 tsp below that. Example: 1.6 cups → `1 1/2 cups + 1 tbsp + 1 3/4 tsp`
  - `parseAmount("2 1/4")` accepts whole numbers, decimals, simple fractions, mixed numbers and unicode fractions (½ ⅓ ¼ ¾ ⅔ ⅛)
  - `formatFraction(x)` returns kitchen fractions only: 1/8, 1/4, 1/3, 3/8, 1/2, 5/8, 2/3, 3/4, 7/8
- `source` is `'usda' | 'kingArthur'`. Default `'usda'`. Every ingredient converter shows a small segmented control "Data source: USDA | King Arthur" and a one-line note when the two differ by more than 3%.

## A3. Technical SEO

- Title at most 60 characters, meta description at most 155, self-referencing canonical with trailing slash, `og:title`, `og:description`, `og:image` (1200x630 PNG per page, generated at build from a template: page H1 + logo mark + site name on the brand terracotta band, no photo).
- One H1 per page. Real `<a>` links. Breadcrumbs on every page except home.
- `sitemap.xml` with honest `lastmod` (from registry `lastUpdated`), only canonical 200 URLs. HTML sitemap at `/sitemap/`.
- `robots.txt`: allow all, explicitly allow Googlebot, Bingbot, Mediapartners-Google, OAI-SearchBot, PerplexityBot; reference the sitemap. Do not block or allow GPTBot or Google-Extended (owner decides later).
- `llms.txt` (optional, low priority): site name, one-line description, list of tool URLs.
- Cloudflare `_headers`: HSTS, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (camera, microphone, geolocation off). `_redirects`: none needed for www (handled by Cloudflare rule).
- Custom 404 page that returns a real 404 status.
- No `nosnippet` or `max-snippet:0` anywhere.
- Favicon: `favicon.ico` (48x48), `icon.svg`, `apple-touch-icon.png` (180x180) generated from `favicon-square.svg`. Site name "MeasuredCup" identical everywhere.
- Semantic HTML: `<header> <nav> <main> <article> <footer>`, tables as `<table>` with `<caption>` and `<th scope>`.

## A4. Schema (JSON-LD, must match visible text)

- Site-wide: `Organization` (name MeasuredCup, url, logo `https://measuredcup.com/logo-512.png`, email hello@measuredcup.com, founder `{"@id":"https://measuredcup.com/authors/sikander-malik/#person"}`, sameAs: leave empty array for now) and `WebSite` (name, url).
- Tool pages: `WebApplication` (name = H1, applicationCategory "UtilityApplication", operatingSystem "Any", offers price 0 USD, author = Person @id) + `BreadcrumbList` + `FAQPage` (questions and answers identical to visible FAQ).
- Hubs: `CollectionPage` + `BreadcrumbList`.
- Data page: `Dataset` (name, description, creator Organization, license `https://creativecommons.org/licenses/by/4.0/`, isBasedOn the USDA FoodData Central URL, distribution as the CSV download) + `BreadcrumbList` + `FAQPage`.
- Author page: `ProfilePage` with `Person` (@id above, name Sikander Malik, url, jobTitle "Founder and tool builder").
- Validate every template in Google's Rich Results Test before reporting done.

## A5. Tool page order (every tool page)

1. Breadcrumbs
2. H1
3. Quick answer (exact text given per page)
4. The tool, with a default example already calculated in the HTML, plus "Show the math" (expandable), Copy result, Share (copies clean URL with parameters), Print
5. How to use (steps given per page)
6. The formula and two worked examples
7. "What this tool doesn't cover"
8. Reference tables
9. Tips
10. FAQ (accordion, all text in HTML)
11. Related tools (from registry)
12. Sources (links and access dates)
13. Author box + "Last updated" date + link to Editorial Policy
14. Disclaimer line: "Values are averages for typical US products. Brands vary, so weigh with a kitchen scale when a recipe needs to be exact."

## A6. Constants and ingredient data

### A6.1 Volume constants (exact, `lib/data/constants.ts`)

| Constant | Value | Source |
|---|---|---|
| US customary cup | 236.5882365 mL | NIST Handbook 44 Appendix C (US customary units) |
| US tablespoon | 1/16 cup = 14.78676478 mL | NIST Handbook 44 |
| US teaspoon | 1/48 cup = 4.928921594 mL | NIST Handbook 44 |
| US legal cup (nutrition labels) | 240 mL | FDA, 21 CFR 101.9(b)(5)(viii) |
| US fluid ounce | 29.5735295625 mL | NIST Handbook 44 |
| Avoirdupois ounce | 28.349523125 g | NIST Handbook 44 |
| 1 stick of US butter | 1/2 cup = 8 tbsp = 4 oz = 113.4 g | US butter wrapper convention; 4 oz x 28.3495 g |
| Large egg, without shell | 50 g | USDA FoodData Central SR Legacy, "Egg, whole, raw, fresh", portion "1 large" (VERIFY) |

### A6.2 Ingredients (`lib/data/ingredients.ts`)

Each ingredient: `id, name, group, usdaGramsPerCup, usdaFdcId, usdaPortionText, kaGramsPerCup, kaNote`.
USDA values: from FoodData Central SR Legacy `food_portion.csv` (public domain). Every USDA value below is marked VERIFY: download the SR Legacy CSV release from https://fdc.nal.usda.gov/download-datasets/ , find the listed food, read the portion "1 cup" (or the noted portion) gram weight, and use the file's number if it differs. Record fdc_id and the exact portion text.
King Arthur values: from https://www.kingarthurbaking.com/learn/ingredient-weight-chart (accessed 2026-10-14), already checked by the browser agent. Where King Arthur lists 1/2 cup or 1/4 cup, the per-cup figure below is doubled or quadrupled.

| id | Name shown | USDA g per cup (VERIFY) | USDA food to look up | King Arthur g per cup |
|---|---|---|---|---|
| ap-flour | All-purpose flour | 125 | Wheat flour, white, all-purpose, enriched, bleached; 1 cup | 120 |
| bread-flour | Bread flour | 137 | Wheat flour, white, bread, enriched; 1 cup | 120 |
| cake-flour | Cake flour | 137 | Wheat flour, white, cake, enriched; 1 cup unsifted, dipped | 120 |
| ww-flour | Whole wheat flour | 120 | Flour, whole wheat, unenriched (or whole-grain wheat flour); 1 cup | (not in chart, leave empty) |
| sugar | Granulated sugar | 200 | Sugars, granulated; 1 cup | 198 |
| brown-sugar | Brown sugar (packed) | 220 | Sugars, brown; 1 cup packed | 213 |
| powdered-sugar | Powdered sugar (unsifted) | 120 | Sugars, powdered; 1 cup unsifted | 113 |
| butter | Butter | 227 | Butter, salted; 1 cup | 226 |
| honey | Honey | 339 | Honey; 1 cup | 336 (21 g per tbsp x 16) |
| maple-syrup | Maple syrup | 315 | Syrups, maple; 1 cup | 312 (156 g per 1/2 cup) |
| milk | Whole milk | 244 | Milk, whole, 3.25% milkfat; 1 cup | 227 |
| water | Water | 237 | Water, tap; 1 cup (fallback: 236.6 mL x 0.998 g/mL) | (empty) |
| vegetable-oil | Vegetable oil | 218 | Oil, canola; 1 cup | 198 |
| heavy-cream | Heavy cream | 238 | Cream, fluid, heavy whipping; 1 cup | 227 |
| sour-cream | Sour cream | 230 | Cream, sour, cultured; 1 cup | 227 |
| yogurt | Plain whole-milk yogurt | 245 | Yogurt, plain, whole milk; 1 cup | (empty) |
| cocoa | Unsweetened cocoa powder | 86 | Cocoa, dry powder, unsweetened; 1 cup | 84 (42 g per 1/2 cup) |
| oats | Rolled oats | 81 | Cereals, oats, regular and quick, not fortified, dry; 1 cup | 89 (old-fashioned or quick) |
| rice | Long-grain white rice (uncooked) | 185 | Rice, white, long-grain, regular, raw, enriched; 1 cup | 198 (99 g per 1/2 cup) |
| cornstarch | Cornstarch | 128 | Cornstarch; 1 cup | 112 (28 g per 1/4 cup) |
| peanut-butter | Peanut butter | 258 | Peanut butter, smooth style, with salt; 1 cup | 270 (135 g per 1/2 cup) |
| choc-chips | Semisweet chocolate chips | 168 | Chocolate, semisweet, chips (or morsels); 1 cup | 170 |
| salt | Table salt | 292 | Salt, table; 1 tsp = 6.1 g, so 1 cup = 292 g (use the file's tsp value x 48) | 288 (18 g per tbsp x 16) |

Rules:
- Never show more than 1 decimal for grams under 100 g, and whole grams at 100 g and above.
- If the USDA file value differs from the table, use the file value, update every worked example, table and FAQ number that depends on it, update the tests, and list each change in your report.
- `lib/data/ingredients.ts` header comment: "USDA FoodData Central is in the public domain (catalog.data.gov). King Arthur figures are facts quoted from their published chart with attribution."

## A7. Pages to build at launch (14 pages)

Tools: `/grams-to-cups/`, `/cups-to-grams/`, `/tablespoons-to-grams/`, `/butter-converter/`, `/half-a-measurement/`, `/recipe-scaler/`
Data: `/data/ingredient-weights/`
Hubs: `/converters/`, `/recipe-tools/`, `/data/`
Home: `/`
Trust and legal: `/about/`, `/how-we-calculate/`, `/editorial-policy/`, `/authors/sikander-malik/`, `/contact/`, `/privacy/`, `/terms/`, `/disclaimer/`, `/affiliate-disclosure/`, `/sitemap/`, 404.

Copy for each page follows in A8 and A9.

## A8. Tool pages (final copy)

### A8.1 `/grams-to-cups/`

- Title: `Grams to Cups Converter by Ingredient | MeasuredCup`
- Meta: `Convert grams to US cups for flour, sugar, butter, honey and 20 more ingredients. Uses USDA and King Arthur weights, with tablespoons for leftovers.`
- H1: `Grams to Cups Converter`
- Quick answer:
  "200 grams of all-purpose flour is 1.6 cups using USDA's 125 g per cup, or 1 2/3 cups using King Arthur's 120 g per cup. Sugar is heavier: 200 g of granulated sugar is exactly 1 cup. A cup can weigh anything from 81 g (rolled oats) to 339 g (honey), so pick your ingredient first."
- Tool:
  - Inputs: Grams (number, `inputMode="decimal"`), Ingredient (searchable select, grouped: Flours, Sugars, Fats and dairy, Liquids and syrups, Grains, Other), Data source (USDA | King Arthur).
  - Default: 200 g, All-purpose flour, USDA.
  - Result card: big number "1.6 cups", second line "1 1/2 cups + 1 tbsp + 1 3/4 tsp", third line "Using USDA: 1 cup all-purpose flour = 125 g". If the other source differs by more than 3%: "King Arthur's figure (120 g per cup) gives 1 2/3 cups."
  - Show the math: "200 g ÷ 125 g per cup = 1.6 cups. 0.1 cup left over = 1.6 tbsp = 1 tbsp + 1.8 tsp, rounded to 1 3/4 tsp."
- How to use:
  1. Type the weight in grams from your recipe.
  2. Choose the ingredient. Flour, sugar and butter weigh very differently per cup.
  3. Leave the data source on USDA, or switch to King Arthur if your recipe comes from a King Arthur or similar test kitchen.
  4. Read the cups, plus the leftover in tablespoons and teaspoons.
  5. For flour, spoon it into the cup and level it with a knife. Scooping straight from the bag packs in up to 20% more.
- Formula: `cups = grams ÷ grams per cup for that ingredient`
- Worked example 1: "250 g all-purpose flour. USDA: 250 ÷ 125 = 2 cups exactly. King Arthur: 250 ÷ 120 = 2.08 cups, which is 2 cups + 1 tbsp + 1 tsp. That 10 g gap is about one heaped tablespoon of flour, enough to change how a cookie spreads."
- Worked example 2: "100 g butter. 100 ÷ 227 = 0.44 cups, which is 7 tablespoons. One US stick is 113 g, so 100 g is one stick minus about 1 tablespoon."
- What this tool doesn't cover: "It doesn't know your brand or how you fill the cup. Sifted flour weighs less than spooned flour, and packed brown sugar weighs more than loose. It uses US cups (236.6 mL), not UK or Australian metric cups (250 mL). For liquids measured by volume, use a measuring jug instead."
- Table 1, caption "Grams per US cup, USDA vs King Arthur": all rows of A6.2 with columns Ingredient | USDA g per cup | King Arthur g per cup | Difference (%), where Difference = (USDA - King Arthur) ÷ USDA, shown as a whole percent with sign.
- Table 2, caption "Common gram amounts in cups (USDA)": rows 50 g, 100 g, 125 g, 200 g, 250 g, 500 g; columns All-purpose flour, Granulated sugar, Brown sugar (packed), Butter. Values computed by `gramsToCups`, shown as kitchen fractions (`formatFraction`) to the nearest 1/8 cup, plus tablespoons when under 1/4 cup. Add a test for every cell.
- Tips:
  - "Weigh flour when a recipe gives grams. It's the one ingredient where cup measurements drift the most."
  - "Brown sugar numbers assume packed. If your recipe says light brown sugar, packed, use the same row."
  - "Butter: 1 tablespoon is about 14 g. Counting tablespoon marks on the wrapper is faster than any cup."
  - "Sticky ingredients like honey and peanut butter: spray the cup with oil first so the full amount comes out."
- FAQ:
  1. Q: "How many cups is 100 grams of flour?" A: "100 g of all-purpose flour is 0.8 cups by USDA's 125 g per cup, which is 3/4 cup plus 2 1/2 teaspoons. By King Arthur's 120 g per cup it's 0.83 cups, which is 3/4 cup plus 1 tablespoon and 1 teaspoon."
  2. Q: "How many grams is 1 cup of sugar?" A: "1 cup of granulated white sugar weighs 200 g according to USDA FoodData Central. King Arthur lists 198 g. Packed brown sugar is heavier at 220 g, and powdered sugar is lighter at about 120 g."
  3. Q: "Why do different websites give different gram weights for a cup?" A: "They use different sources and different ways of filling the cup. USDA measures a standard household cup, while test kitchens like King Arthur measure the way their recipes were developed. Flour shows one of the biggest gaps: USDA lists bread flour at 137 g per cup, King Arthur at 120 g."
  4. Q: "Is a cup the same in the US and the UK?" A: "No. A US customary cup is 236.6 mL. UK, Australian and Canadian recipes usually mean a 250 mL metric cup, about 6% larger. This converter uses US cups."
  5. Q: "How many grams of butter is 1 cup?" A: "1 cup of butter is 227 g, which is 2 US sticks. Half a cup, or one stick, is 113 g."
  6. Q: "Can I convert grams to cups without knowing the ingredient?" A: "Only for water and similar liquids, where 1 cup is about 237 g. For dry ingredients the answer changes a lot: 100 g is 1/2 cup of sugar but about 1 1/4 cups of rolled oats."
- Related: cups-to-grams, tablespoons-to-grams, butter-converter, ingredient-weights.
- Sources: USDA FoodData Central SR Legacy (link, accessed date); King Arthur Baking Ingredient Weight Chart (link, accessed 2026-10-14); NIST Handbook 44 Appendix C (link).

Tests: 100 g flour USDA = 0.8 cups = 3/4 cup + 2 1/2 tsp; KA 100 g = 0.833 cups = 3/4 cup + 1 tbsp + 1 tsp; 100 g sugar = 1/2 cup; 100 g oats = 1.23 cups ("about 1 1/4 cups"); 200 g flour = 1.6 cups = 1 1/2 cups + 1 tbsp + 1 3/4 tsp.

### A8.2 `/cups-to-grams/`

- Title: `Cups to Grams Converter for Baking | MeasuredCup`
- Meta: `Convert US cups to grams for 23 baking ingredients. 1 cup flour is 125 g, sugar 200 g, butter 227 g. Fractions like 2/3 and 3/4 cup welcome.`
- H1: `Cups to Grams Converter`
- Quick answer: "1 cup of all-purpose flour weighs 125 g (USDA) or 120 g (King Arthur). 1 cup of granulated sugar is 200 g, packed brown sugar is 220 g, and butter is 227 g. Type any amount, including fractions like 2/3 or 1 1/2, and pick the ingredient."
- Tool: Inputs Cups (text, accepts fractions), Ingredient, Data source. Default 1 1/2 cups, all-purpose flour, USDA. Result "188 g" (187.5 rounds to 188), second line "6.6 oz", third line "Using USDA: 1 cup all-purpose flour = 125 g". Other-source line: "King Arthur's figure gives 180 g."
- How to use:
  1. Type the cup amount. Fractions and mixed numbers work: 3/4, 1 1/3, 2.5.
  2. Choose the ingredient.
  3. Pick the data source if your recipe names one.
  4. Read grams and ounces, then weigh that amount on a kitchen scale.
- Formula: `grams = cups × grams per cup for that ingredient`
- Worked example 1: "1 1/2 cups all-purpose flour. USDA: 1.5 × 125 = 187.5 g, shown as 188 g. King Arthur: 1.5 × 120 = 180 g."
- Worked example 2: "3/4 cup packed brown sugar. USDA: 0.75 × 220 = 165 g. King Arthur: 0.75 × 213 = 159.75 g, shown as 160 g."
- What this tool doesn't cover: same text as A8.1.
- Table 1, caption "Cup fractions in grams (USDA)": rows 1/4, 1/3, 1/2, 2/3, 3/4, 1 cup; columns All-purpose flour, Granulated sugar, Brown sugar (packed), Butter, Whole milk, Honey. Computed, whole grams at 100 g and above, 1 decimal below.
- Table 2: same ingredient comparison table as A8.1 Table 1 (shared component).
- Tips:
  - "If a recipe was written in cups, the writer probably scooped. Spoon-and-level gives you less flour, so expect a slightly softer result."
  - "For 1/3 and 2/3 cup, grams are more accurate than stacking 1/4 cup and tablespoons."
  - "Ounces on this page are weight ounces, not fluid ounces."
- FAQ:
  1. Q: "How many grams is 1 cup of flour?" A: "1 cup of all-purpose flour is 125 g in USDA FoodData Central and 120 g in King Arthur's chart. Bread flour and cake flour are listed at 137 g per cup by USDA."
  2. Q: "How many grams is 3/4 cup of sugar?" A: "3/4 cup of granulated sugar is 150 g using USDA's 200 g per cup."
  3. Q: "How many grams is 1/2 cup of butter?" A: "1/2 cup of butter is one US stick, 113 g or 4 ounces."
  4. Q: "How many grams is 2/3 cup?" A: "It depends on the ingredient: 2/3 cup of all-purpose flour is 83.3 g (USDA), granulated sugar is 133 g, and whole milk is 162.7 g."
  5. Q: "Is a cup of water 250 grams?" A: "Not in the US. A US cup holds 236.6 mL, so water weighs about 237 g. 250 g is a metric cup, used in Australia and often in the UK."
  6. Q: "Should I use USDA or King Arthur numbers?" A: "Use King Arthur figures for King Arthur recipes and similar test-kitchen recipes, since that's how they were written. Use USDA when the recipe doesn't say. Most ingredients differ by less than 5%, but bread and cake flour, cornstarch, oil, oats, milk, rice and powdered sugar differ by 6% to 13%."
- Related: grams-to-cups, tablespoons-to-grams, recipe-scaler, ingredient-weights.
- Sources: as A8.1.

Tests: 2/3 cup flour = 83.3 g; 2/3 cup sugar = 133 g; 2/3 cup milk = 162.7 g; percentage gaps per ingredient computed from ingredients.ts (Difference % = (USDA - King Arthur) ÷ USDA. Expected: all-purpose flour 4.0%, bread flour 12.4%, cornstarch 12.5%, oil 9.2%, oats -9.9%, milk 7.0%, rice -7.0%, powdered sugar 5.8%).

### A8.3 `/tablespoons-to-grams/`

- Title: `Tablespoons to Grams by Ingredient | MeasuredCup`
- Meta: `How many grams in a tablespoon? Water 14.8 g, flour 7.8 g, sugar 12.5 g, butter 14.2 g, honey 21.2 g. Convert tablespoons and teaspoons for 23 ingredients.`
- H1: `Tablespoons to Grams Converter`
- Quick answer: "1 US tablespoon of water weighs 14.8 g. Other ingredients depend on density: 1 tablespoon of all-purpose flour is about 7.8 g, granulated sugar 12.5 g, butter 14.2 g, and honey 21.2 g (USDA FoodData Central). A teaspoon is one third of each."
- Tool: Inputs Amount (fractions ok), Unit (tablespoons | teaspoons), Ingredient, Data source. Default 3 tbsp butter, USDA. Result "42.6 g", second line "3 tbsp = 3/16 cup", third line "Using USDA: 1 tbsp butter = 14.2 g".
- How to use:
  1. Type the number of spoons.
  2. Choose tablespoons or teaspoons.
  3. Choose the ingredient.
  4. Read the grams. Use level spoons, not heaped.
- Formula: `grams = spoons × (grams per cup ÷ 16)` for tablespoons, `÷ 48` for teaspoons.
- Worked example 1: "3 tablespoons of butter. 227 ÷ 16 = 14.19 g per tablespoon. 3 × 14.19 = 42.6 g."
- Worked example 2: "2 tablespoons of honey. 339 ÷ 16 = 21.19 g per tablespoon. 2 × 21.19 = 42.4 g. Honey is the heaviest common baking ingredient per spoon."
- What this tool doesn't cover: "It assumes level US measuring spoons (14.8 mL tablespoon, 4.9 mL teaspoon). Dinner spoons vary from about 7 mL to 14 mL, so they aren't reliable. Australian tablespoons are 20 mL, a third bigger. It doesn't cover leaveners by brand: baking powder and baking soda weights differ slightly by product."
- Table, caption "1 tablespoon and 1 teaspoon in grams (USDA)": every ingredient, columns 1 tbsp, 1 tsp. Computed.
- Tips:
  - "Measure sticky liquids like honey and molasses over a separate bowl so drips don't land in the batter."
  - "For salt, brand matters a lot. Table salt is about 6 g per teaspoon; flaky kosher salt can be half that."
  - "Three teaspoons make one tablespoon, and 16 tablespoons make one cup."
- FAQ:
  1. Q: "How many grams are in a tablespoon?" A: "For water, 14.8 g. For flour about 7.8 g, sugar 12.5 g, butter 14.2 g and honey 21.2 g. The answer always depends on the ingredient."
  2. Q: "How many grams are in a teaspoon of sugar?" A: "About 4.2 g of granulated sugar, using USDA's 200 g per cup divided by 48."
  3. Q: "How many tablespoons are in 100 grams of butter?" A: "About 7 tablespoons, since each level tablespoon of butter weighs 14.2 g."
  4. Q: "Is a tablespoon 15 ml?" A: "Close. A US tablespoon is 14.8 mL, and many nutrition labels round it to 15 mL. A UK tablespoon is 15 mL and an Australian one is 20 mL."
  5. Q: "How many teaspoons are in a tablespoon?" A: "Three US teaspoons make one US tablespoon."
  6. Q: "How many grams of salt is a teaspoon?" A: "About 6 g of fine table salt. Kosher salt is lighter per spoon because the crystals are bigger and trap more air."
- Related: cups-to-grams, grams-to-cups, butter-converter, half-a-measurement.
- Sources: as A8.1.
- VERIFY: salt tsp value from USDA file. If it is not 6.0 to 6.1 g, update quick text, FAQ 6 and tip 2.

### A8.4 `/butter-converter/`

- Title: `Butter Converter: Sticks, Cups, Tbsp and Grams | MeasuredCup`
- Meta: `1 stick of butter is 1/2 cup, 8 tablespoons, 4 ounces or 113 grams. Convert butter between sticks, cups, tablespoons, grams and ounces.`
- H1: `Butter Converter: Sticks, Cups, Tablespoons and Grams`
- Quick answer: "1 US stick of butter is 1/2 cup, 8 tablespoons, 4 ounces or 113 grams. So 3/4 cup is 1 1/2 sticks (170 g), and 1 cup is 2 sticks (227 g). Type any amount in any unit to convert the rest."
- Tool: one amount + "from" unit (sticks, cups, tablespoons, teaspoons, grams, ounces, pounds); results show all other units at once. Default 250 g. Results: "2.2 sticks", "about 2 sticks + 1 1/2 tbsp", "1.1 cups", "17.6 tbsp", "8.8 oz".
  - Math: 250 ÷ 113.4 = 2.205 sticks; 0.205 stick × 8 = 1.64 tbsp, shown as "1 1/2 tbsp" (round to nearest 1/2 tbsp); 250 ÷ 226.8 = 1.10 cups; 250 ÷ 14.175 = 17.6 tbsp; 250 ÷ 28.35 = 8.8 oz.
- How to use:
  1. Pick the unit your recipe uses.
  2. Type the amount.
  3. Read every other unit, including the closest stick-and-tablespoon cut.
- Formula: "1 stick = 113.4 g = 4 oz = 8 tbsp = 1/2 cup. Every result is a multiple of these."
- Worked example 1: "A European recipe asks for 250 g butter. 250 ÷ 113.4 = 2.2 sticks. Use 2 full sticks plus 1 1/2 tablespoons cut from a third stick."
- Worked example 2: "A recipe asks for 6 tablespoons. 6 ÷ 8 = 3/4 stick, which is 85 g or 3 oz."
- What this tool doesn't cover: "It assumes US sticks of 4 oz with 8 tablespoon marks. Some West Coast brands sell short, wide sticks that are the same weight, so the maths still holds. European butter often comes in 250 g blocks, and Irish or European butter has more fat but the same weight per volume. Melted butter loses a little water when browned, so browned butter weighs less."
- Table, caption "Butter amounts": rows 1 tbsp, 2 tbsp, 1/4 cup, 1/3 cup, 1/2 cup, 2/3 cup, 3/4 cup, 1 cup, 1 pound; columns Sticks, Tablespoons, Grams, Ounces. Values: 1 tbsp = 1/8 stick, 14 g, 0.5 oz; 2 tbsp = 1/4 stick, 28 g, 1 oz; 1/4 cup = 1/2 stick, 4 tbsp, 57 g, 2 oz; 1/3 cup = 2/3 stick, 5 1/3 tbsp, 76 g, 2.7 oz; 1/2 cup = 1 stick, 8 tbsp, 113 g, 4 oz; 2/3 cup = 1 1/3 sticks, 10 2/3 tbsp, 151 g, 5.3 oz; 3/4 cup = 1 1/2 sticks, 12 tbsp, 170 g, 6 oz; 1 cup = 2 sticks, 16 tbsp, 227 g, 8 oz; 1 pound = 4 sticks, 32 tbsp, 454 g, 16 oz. Grams column: 1 decimal under 100 g per the global rule (14.2, 28.4, 56.7, 75.6), whole grams at 100 g and above. Use the computed values in the table, the summary above is rounded.
- Tips:
  - "Cut cold butter through the wrapper along the tablespoon lines. It's faster and cleaner than a measuring cup."
  - "Softened butter for creaming should give slightly to a finger press, at about 65°F (18°C)."
  - "Salted and unsalted butter weigh the same per stick. Salted adds roughly 1/4 tsp salt per stick, depending on the brand."
- FAQ:
  1. Q: "How many grams is a stick of butter?" A: "113 grams (4 ounces). That's 1/2 cup or 8 tablespoons."
  2. Q: "How many sticks is 1 cup of butter?" A: "2 sticks."
  3. Q: "How many tablespoons are in a stick of butter?" A: "8 tablespoons. Most US wrappers print a line for each one."
  4. Q: "How much is 250 grams of butter in sticks?" A: "About 2.2 sticks: 2 full sticks plus about 1 1/2 tablespoons."
  5. Q: "How many sticks is 3/4 cup of butter?" A: "1 1/2 sticks, which is 12 tablespoons or 170 g."
  6. Q: "Does melted butter measure the same as solid butter?" A: "By weight, yes. By volume, close enough for most recipes, since butter's density barely changes when melted. Weigh it if the recipe gives grams."
- Related: cups-to-grams, tablespoons-to-grams, half-a-measurement, recipe-scaler.
- Sources: NIST Handbook 44 (ounce to gram); USDA FoodData Central (butter, 1 cup); King Arthur chart (8 tbsp = 113 g).

### A8.5 `/half-a-measurement/`

- Title: `Half of a Measurement Calculator (Cups and Spoons) | MeasuredCup`
- Meta: `Half of 3/4 cup is 1/4 cup plus 2 tablespoons. Halve, third or double any cup, tablespoon or teaspoon amount and get measuring-spoon combinations.`
- H1: `Half of a Measurement Calculator`
- Quick answer: "Half of 3/4 cup is 1/4 cup plus 2 tablespoons (6 tablespoons). Half of 1/3 cup is 2 tablespoons plus 2 teaspoons, and half of 1/4 cup is 2 tablespoons. Type any amount below to halve it, cut it to a third, or double it."
- Tool: Inputs Amount (fractions), Unit (cups | tbsp | tsp), Operation (Half | One third | Double | Custom factor). Default 3/4 cup, Half. Result "1/4 cup + 2 tbsp", second line "= 6 tbsp = 88.7 mL".
- How to use:
  1. Type the amount from your recipe, for example 3/4.
  2. Pick the unit.
  3. Choose half, one third, double, or type your own factor.
  4. Measure the combination shown. It always uses standard US cups and spoons.
- Formula: "Convert to teaspoons (1 cup = 48 tsp, 1 tbsp = 3 tsp), multiply by the factor, then rebuild the largest cups and spoons that fit, down to 1/8 teaspoon."
- Worked example 1: "Half of 1/3 cup. 1/3 cup = 16 tsp. Half = 8 tsp = 2 tbsp (6 tsp) + 2 tsp."
- Worked example 2: "Half of 1 1/4 cups. 1 1/4 cups = 20 tbsp. Half = 10 tbsp = 1/2 cup (8 tbsp) + 2 tbsp."
- What this tool doesn't cover: "It halves volume only. Eggs, pan sizes and baking times don't scale the same way. For half an egg, beat one large egg and use about 25 g. For a full recipe, use the recipe scaler."
- Table, caption "Halves and thirds of common measurements": rows 1 cup, 3/4 cup, 2/3 cup, 1/2 cup, 1/3 cup, 1/4 cup, 1 tbsp, 1 tsp, 1/2 tsp; columns Half, One third. Values: 1 cup → 1/2 cup | 1/3 cup; 3/4 cup → 1/4 cup + 2 tbsp | 1/4 cup; 2/3 cup → 1/3 cup | 3 tbsp + 1 2/3 tsp (round: 3 tbsp + 1 1/2 tsp, note "about"); 1/2 cup → 1/4 cup | 2 tbsp + 2 tsp; 1/3 cup → 2 tbsp + 2 tsp | 1 tbsp + 2 1/3 tsp (about 1 tbsp + 2 1/4 tsp); 1/4 cup → 2 tbsp | 1 tbsp + 1 tsp; 1 tbsp → 1 1/2 tsp | 1 tsp; 1 tsp → 1/2 tsp | 1/3 tsp (about 1/4 tsp + a pinch); 1/2 tsp → 1/4 tsp | 1/6 tsp (about 1/8 tsp + a pinch). Generate with `toKitchenMeasure` and test each cell; where the exact result is not a whole multiple of 1/8 tsp, prefix "about".
- Tips:
  - "Most recipes tolerate small rounding, but leaveners don't. Weigh baking powder and soda when you cut a recipe to a third."
  - "Halving a cake? A 9-inch round pan has about the same area as two 6-inch rounds, not one."
  - "Write the halved amounts on the recipe before you start, so you don't slip back to the full amount mid-way."
- FAQ:
  1. Q: "What is half of 3/4 cup?" A: "1/4 cup plus 2 tablespoons, which is 6 tablespoons."
  2. Q: "What is half of 2/3 cup?" A: "1/3 cup."
  3. Q: "What is half of 1/3 cup?" A: "2 tablespoons plus 2 teaspoons."
  4. Q: "What is half of 1/4 cup?" A: "2 tablespoons."
  5. Q: "What is half of a tablespoon?" A: "1 1/2 teaspoons."
  6. Q: "How do I halve one egg?" A: "Beat one large egg, then use half by weight, about 25 g, which is a little over 1 1/2 tablespoons."
- Related: recipe-scaler, butter-converter, tablespoons-to-grams, cups-to-grams.
- Sources: NIST Handbook 44 (cup = 16 tbsp = 48 tsp); USDA FoodData Central (large egg 50 g).

### A8.6 `/recipe-scaler/`

- Title: `Recipe Scaler: Resize Any Recipe by Servings | MeasuredCup`
- Meta: `Paste a recipe and change the servings. Scales cups, spoons, grams and eggs, then rounds to measuring-cup fractions you can actually use.`
- H1: `Recipe Scaler`
- Quick answer: "Multiply every ingredient by new servings ÷ original servings. Going from 4 servings to 6 is a factor of 1.5, so 2 cups of flour becomes 3 cups and 3/4 cup of sugar becomes 1 cup plus 2 tablespoons. Paste your ingredient list below and the scaler does every line."
- Tool:
  - Inputs: Original servings, New servings (or a factor: 1/2, 1/3, 2, 3, custom), Ingredient list (textarea, one ingredient per line).
  - Parser: reads a leading amount (whole, decimal, fraction, mixed, unicode), an optional unit (cup/cups/c, tablespoon/tbsp/T, teaspoon/tsp/t, g/gram/grams, kg, oz/ounce, lb/pound, ml, l, stick/sticks, egg/eggs, pinch, clove), and the rest of the line as the ingredient. Lines it can't read are copied unchanged and marked "not scaled".
  - Output per line: scaled amount in kitchen fractions (cups and spoons rebuilt with `toKitchenMeasure` for cup/tbsp/tsp units), grams unchanged unit, eggs rounded to the nearest 1/2 with a note when not whole.
  - Default example (pre-filled, result in HTML): servings 4 → 6, lines:
    `2 cups all-purpose flour` → `3 cups all-purpose flour`
    `3/4 cup sugar` → `1 cup + 2 tbsp sugar`
    `1/2 cup butter` → `3/4 cup butter`
    `2 eggs` → `3 eggs`
    `1 tsp baking powder` → `1 1/2 tsp baking powder`
    `1/4 tsp salt` → `1/4 tsp + 1/8 tsp salt`
- How to use:
  1. Enter how many servings the recipe makes now.
  2. Enter how many you want, or pick a factor.
  3. Paste the ingredient list, one item per line.
  4. Copy or print the scaled list. Check any line marked "not scaled".
- Formula: `scale factor = new servings ÷ original servings; new amount = old amount × factor`
- Worked example 1: as the default example above (factor 1.5).
- Worked example 2: "Cutting a 9-serving recipe to 3 servings is a factor of 1/3. 2 1/4 cups flour becomes 3/4 cup, 3 eggs becomes 1 egg, and 1 tsp vanilla becomes 1/3 tsp, about 1/4 tsp plus a pinch."
- What this tool doesn't cover: "Baking time, pan size and oven temperature don't scale with the ingredients. A doubled batter in the same pan bakes much longer, so use two pans or a larger one and check early. Yeast doughs and spices may need less than a straight multiply when you triple or more."
- Tips:
  - "When scaling up a cake, match the pan area, not the pan count. A 9x13-inch pan holds about the batter of two 8-inch rounds."
  - "Start checking doneness at the original time, then every 5 minutes."
  - "Round eggs up for richer, round down for lighter. Or beat the extra egg and add half."
- FAQ:
  1. Q: "How do I scale a recipe?" A: "Divide the servings you want by the servings the recipe makes. Multiply every ingredient by that number."
  2. Q: "How do I double a recipe?" A: "Multiply each ingredient by 2. Keep the oven temperature, use a bigger pan or two pans, and expect a longer bake if the batter is deeper."
  3. Q: "What is 3/4 cup times 1.5?" A: "1 1/8 cups, which is 1 cup plus 2 tablespoons."
  4. Q: "Do I double the baking time when I double a recipe?" A: "No. Baking time depends on batter depth. Keep the depth the same with a larger pan and the time stays close to the original."
  5. Q: "How do I cut a recipe that uses 3 eggs in half?" A: "Use 1 egg plus half of a beaten second egg, about 25 g."
  6. Q: "Can the scaler handle grams?" A: "Yes. Gram, kilogram, ounce and pound amounts are multiplied directly and kept in their original unit."
- Related: half-a-measurement, cups-to-grams, butter-converter, grams-to-cups.
- Sources: NIST Handbook 44.

Tests: 1/4 tsp × 1.5 = 1/4 tsp + 1/8 tsp; 2 1/4 cups × 1/3 = 3/4 cup; 1 tsp × 1/3 = "about 1/4 tsp + a pinch"; 3/4 cup × 1.5 = 1 cup + 2 tbsp.

## A9. Other pages (final copy)

### A9.1 Home `/`

- Title: `MeasuredCup: Kitchen Converters for Baking`
- Meta: `Convert grams to cups, cups to grams, butter sticks and tablespoons by ingredient. Free kitchen tools using USDA and King Arthur weights.`
- H1: `Kitchen converters that know your ingredient`
- Intro (hero, under H1): "A cup of flour and a cup of sugar don't weigh the same. MeasuredCup converts grams, cups and spoons ingredient by ingredient, using public USDA data and the King Arthur Baking weight chart, side by side."
- Search: placeholder "e.g. butter, 200 g flour, half of 3/4 cup"; filters tool and ingredient cards client-side; all cards visible without JS.
- Chips: Grams to cups | Cups to grams | Butter | Half a measurement | Recipe scaler
- Section "Most used" (4 tiles): grams-to-cups, cups-to-grams, butter-converter, recipe-scaler. One muted line each:
  - Grams to cups: "Any weight to US cups, for 23 ingredients"
  - Cups to grams: "Fractions welcome: 2/3 cup, 1 1/2 cups"
  - Butter converter: "Sticks, cups, tablespoons, grams, ounces"
  - Recipe scaler: "Paste a recipe, change the servings"
- Section band 1 "Kitchen converters" + View all → `/converters/`, intro "Weight and volume, converted per ingredient." Tiles: 4 converter tools.
- Section band 2 "Recipe tools" + View all → `/recipe-tools/`, intro "Halve, third, double or resize a whole recipe." Tiles: half-a-measurement, recipe-scaler.
- Section "Popular answers" (3 answer cards):
  - "1 cup all-purpose flour = 125 g" (sentence: "USDA's figure. King Arthur uses 120 g.") link Cups to grams
  - "1 stick of butter = 113 g" ("Also 1/2 cup, 8 tablespoons, 4 ounces.") link Butter converter
  - "Half of 3/4 cup = 6 tbsp" ("That's 1/4 cup plus 2 tablespoons.") link Half a measurement
- Section "Why trust these numbers" (3 columns, no icons):
  - H3 "Public data, shown side by side" text: "Every ingredient shows USDA FoodData Central's weight next to King Arthur Baking's, so you can see when sources disagree and by how much."
  - H3 "Maths you can check" text: "Each tool has a Show the math button with the exact division or multiplication, and every page lists its sources with dates."
  - H3 "Corrected in public" text: "When a number changes, we log the old value and the new one on our editorial policy page." Links to How We Calculate and About.
- Section "Latest updates": rows from registry (title left, date right).
- Photo credits (from photos.ts).

### A9.2 Hubs

- `/converters/` H1 "Kitchen converters". Intro (150 to 250 words): "These converters turn grams into cups and back again, one ingredient at a time. The reason is density. A US cup holds 236.6 mL, but 236.6 mL of all-purpose flour weighs about 125 g while the same cup of honey weighs 339 g. A single 'grams to cups' number can't be right for both. Each converter here uses two published sources: USDA FoodData Central, the US government's food composition database, and King Arthur Baking's ingredient weight chart, which reflects how their test kitchen measures. You can switch between them, and the page tells you when they differ by more than 3%. Not sure which tool to use? If your recipe lists grams and you only own cups, start with grams to cups. If it lists cups and you own a scale, use cups to grams. Butter has its own converter because US recipes count it in sticks and tablespoons." Then table "Which tool do I need?" (Recipe says | You have | Use): grams, cups → Grams to cups; cups, scale → Cups to grams; tablespoons, scale → Tablespoons to grams; sticks or grams of butter, either → Butter converter. Then tiles. Then FAQ (3): "Which is more accurate, cups or grams?" A: "Grams. A cup of flour can vary by 20% depending on how it's filled, while a kitchen scale is accurate to about 1 g." / "Do these converters work for UK recipes?" A: "Yes for grams. For cups, note that UK and Australian recipes often mean a 250 mL cup, about 6% larger than a US cup." / "Where do the ingredient weights come from?" A: "USDA FoodData Central and King Arthur Baking's published chart. Each tool lists the exact sources and access dates."
- `/recipe-tools/` H1 "Recipe tools". Intro: "These tools change the size of a recipe. Halving 3/4 cup or tripling 1/3 cup in your head goes wrong easily, because US measures mix cups, tablespoons and teaspoons. The calculators here convert everything to teaspoons, do the multiplication, then rebuild the amount from standard measuring cups and spoons so you can actually measure it. Two things don't scale with the ingredients. Pan size: a halved cake needs a pan with about half the area, so a 9-inch round becomes roughly a 6 1/2-inch round, and a doubled batter needs twice the area. Baking time: it follows batter depth, not quantity, so keep the depth the same and start checking at the original time. Eggs are the other snag. A large egg weighs about 50 g out of the shell, so half an egg is about 25 g of beaten egg." Then table "Which tool do I need?" (You want to | Use): Halve or double one amount → Half of a measurement calculator; Resize a whole recipe → Recipe scaler. Then tiles. Then FAQ (3): "Can I halve any recipe?" A: "Most recipes, yes. Measure leaveners carefully, use a smaller pan with about half the area, and check doneness early." / "Does baking time change when I halve a recipe?" A: "Only if the batter depth changes. In a pan with half the area, the batter is just as deep and bakes in about the same time." / "How do I halve an egg?" A: "Beat one large egg and use about 25 g, a little over 1 1/2 tablespoons."
- `/data/` H1 "Ingredient data". Intro: "The numbers behind every converter, with their sources." Tile: ingredient-weights.

### A9.3 `/data/ingredient-weights/`

- Title: `Ingredient Weights per Cup: USDA vs King Arthur | MeasuredCup`
- Meta: `Grams per US cup, tablespoon and teaspoon for 23 baking ingredients, comparing USDA FoodData Central and King Arthur Baking. Free CSV download.`
- H1: `Ingredient Weights per Cup: USDA vs King Arthur`
- Quick answer: "Most baking ingredients weigh within 5% of each other in USDA and King Arthur data, but bread and cake flour, cornstarch, oil, oats, milk, rice and powdered sugar differ by 6% to 13%. USDA lists all-purpose flour at 125 g per cup and bread flour at 137 g; King Arthur uses 120 g for both. The full table and a CSV are below."
- Sortable table: Ingredient | USDA g/cup | USDA g/tbsp | USDA g/tsp | King Arthur g/cup | Difference (%) | USDA food description and FDC ID.
- Download button: `/data/ingredient-weights.csv` generated at build from ingredients.ts. License line: "Free to reuse with a link to MeasuredCup (CC BY 4.0). USDA data is public domain."
- Section "How we built this table": "USDA values come from the FoodData Central SR Legacy release, using each food's household portion for 1 cup. King Arthur values come from their published ingredient weight chart; where they list 1/2 cup or 1/4 cup, we multiplied up to a full cup. Tablespoon and teaspoon figures are the cup weight divided by 16 and 48."
- Section "Why the sources disagree": "USDA portions describe a standard household cup. Test kitchens weigh the way their own recipes are written, often spooning flour lightly into the cup. Liquids differ for a different reason: King Arthur rounds milk and cream to 8 ounces per cup, while USDA weighs the liquid itself, which is denser than water."
- What this page doesn't cover: "It doesn't cover individual brands yet. Our next update adds weights from US nutrition labels, which list a serving in both cups and grams."
- FAQ (4): "Is the CSV free to use?" / "How often is the table updated?" (A: "When USDA publishes a new FoodData Central release or a source changes its chart. Changes are logged on the editorial policy page.") / "Why is bread flour heavier than all-purpose in USDA data?" (A: "USDA's portion data lists 137 g per cup for bread flour against 125 g for all-purpose. Bread flour's higher protein and coarser grind can pack more densely in a cup.") VERIFY this explanation is phrased as a possibility, not a fact. / "Can I use these numbers for nutrition labels?" (A: "No. These are kitchen averages. Food labels must follow FDA rules and the product's own tested data.")
- Sources: USDA FoodData Central SR Legacy (download page link, release date), King Arthur chart.

### A9.4 Trust and legal pages (final copy)

`/about/` H1 "About MeasuredCup"
"MeasuredCup is a set of free kitchen converters for people who bake from recipes written in a different system than their kitchen. I'm Sikander Malik, a web developer, and I built it after running into the same problem again and again: a recipe in grams, a drawer full of cups, and conversion charts that disagreed with each other.
Instead of picking one number and hiding the rest, every converter here shows where its number comes from. Ingredient weights come from USDA FoodData Central, the US government's public food database, and from King Arthur Baking's published weight chart. When they disagree, the page says so.
What I don't do: I don't publish recipes, and I don't claim to have tested ingredients in a lab. The tools do arithmetic on published data, and every formula is shown so you can check it.
Found a wrong number? Use the contact page. Corrections are logged publicly on the editorial policy page."
Links: How We Calculate, Editorial Policy, Contact, author page.

`/how-we-calculate/` H1 "How we calculate"
Sections: "Units we use" (table of A6.1 constants with sources); "Ingredient weights" (A6.2 method text, link to the data page); "Rounding" ("Grams are shown to 1 decimal below 100 g and as whole grams above. Cup and spoon results are rebuilt into standard US measures, down to 1/8 teaspoon. When a result falls between spoon sizes we say 'about'."); "What we compare" ("Each converter can switch between USDA and King Arthur figures. We flag differences over 3%."); "Checks" ("Every converter has automated tests for its worked examples, tables and FAQ numbers. We also compare results with King Arthur's published chart before each update."); Sources list with access dates.

`/editorial-policy/` H1 "Editorial policy"
"Who writes: Sikander Malik writes and edits every page.
How tools are built: formulas are written as code with automated tests. Every number comes from a cited source.
AI use: we use AI tools to help draft code and copy. A person checks every number against its source and edits every page before it's published.
Updates: each page shows a Last updated date that changes only when the content changes.
Corrections: we fix errors as soon as we confirm them and log them below with the date, the page, the old value and the new value.
Ads and affiliate links: the site may show ads and may link to kitchen tools through affiliate programs. This never changes a number on the site. Affiliate links are labeled.
Corrections log:" then a table (Date | Page | What was wrong | What it is now) generated from `lib/data/corrections.ts` (empty at launch with the text "No corrections yet.").

`/authors/sikander-malik/` H1 "Sikander Malik"
"Sikander is a web developer and the founder of MeasuredCup. He builds the site's converters and maintains the ingredient dataset, working from USDA FoodData Central and published manufacturer charts. He's not a chef or a nutritionist, which is why every number on the site links to its source." Then list of pages by him (from registry). Initials circle "SM" instead of a photo until the owner supplies one.

`/contact/` H1 "Contact"
"Spotted a number that looks wrong, or a tool you'd like us to build? Send a message below. We read every one and usually reply within 3 business days." Form: Name, Email, Message, honeypot field, Web3Forms access key from `NEXT_PUBLIC_WEB3FORMS_KEY`. Success text: "Thanks. Your message is on its way." Error text: "That didn't send. Please email hello@measuredcup.com instead." Also show "Email: hello@measuredcup.com".

`/privacy/` H1 "Privacy policy": write a plain-language policy naming only real processors: Cloudflare (hosting, CDN and Cloudflare Web Analytics, which doesn't use cookies), Web3Forms (contact form), and a commented-out GA4 section that ships only when `NEXT_PUBLIC_GA_ID` is set (Google Analytics 4, 14-month retention, consent required in the EEA, UK and Switzerland, opt-out link https://tools.google.com/dlpage/gaoptout). Add a commented-out AdSense section for later (Google and partners use cookies to serve ads based on prior visits; opt-out https://adssettings.google.com and https://www.aboutads.info). Contact email. Effective date. Keep A13 style.

`/terms/` H1 "Terms of use": plain-language terms: free use, no warranty, values are averages, no liability for recipe outcomes, CSV license CC BY 4.0, governing contact email. Keep it short.

`/disclaimer/` H1 "Disclaimer": "MeasuredCup's converters give averages for typical US products. Weights vary by brand, humidity and how an ingredient is measured. The site doesn't give nutrition, medical or dietary advice. For allergies or medical diets, follow your doctor or dietitian and the product label."

`/affiliate-disclosure/` H1 "Affiliate disclosure": "Some links on MeasuredCup may be affiliate links. If you buy through them, we may earn a small commission at no extra cost to you. We only link to products relevant to the page, and affiliate relationships never change a number in our tools." (No affiliate links at launch.)

`/sitemap/` H1 "Sitemap": every page grouped by hub, with its meta description as a one-line description.

404 H1 "That page isn't here" + "Try the converters below or search for an ingredient." + search + top 4 tiles.

## A10. Analytics and monetization-ready

- Cloudflare Web Analytics is enabled at the Cloudflare level (no code).
- GA4: only if `NEXT_PUBLIC_GA_ID` is set; load gtag with `next/script` `strategy="lazyOnload"`; Consent Mode v2 default denied for EEA, UK, CH with a small banner shown only there.
- Events: `tool_used` (ingredient, tool), `tool_result_shown`, `copy_result`, `share_link`, `print`, `csv_download`, `outbound_click`.
- `AdSlot` component with a reserved `min-height` (250px mobile, 280px desktop) that renders nothing until `NEXT_PUBLIC_ADSENSE_ID` is set. Allowed positions: after "How to use", after the reference tables, and in the sidebar on desktop. Never between inputs and result, never above the tool on mobile.
- `public/ads.txt`: empty file for now (line added after AdSense approval).
- `AffiliateLink` component: `rel="sponsored nofollow noopener"` + label "Affiliate link".

## A11. Performance

- LCP at most 2.5 s, INP at most 200 ms, CLS 0 (target), measured on mobile.
- At most 100 KB gzipped JS per tool page. Total page weight at most 1 MB.
- H1 and quick answer render server-side, outside the client tool component.
- `prefetch={false}` on related, hub, footer and breadcrumb links.
- Debounce tool recalculation to 150 ms; no long tasks over 50 ms.
- `next/font` with at most 3 weights. Reserved heights for all images and ad slots.
- Shared helper for any count round-up: `ceilCount = x => Math.ceil(Math.round(x*1e6)/1e6)`.

## A12. Tests (minimum)

At least 10 known-answer tests per tool, including: both worked examples; every reference table cell; every number in the FAQ and quick answer; fractions (1/3, 2/3, 1 1/2, ½, ⅔); decimals; zero and empty input (no NaN, show a friendly message); very large input (10 000 g); unit edge cases (1/8 tsp rounding, "about" labels); USDA vs King Arthur switching; `toKitchenMeasure` combinations listed in A8.5; parser lines in A8.6 including an unreadable line.
Also: a build check that fails if any page copy contains the long dash character or any word from the banned list in A13, and a test that every FAQ in JSON-LD equals the visible text.

## A13. Writing rules (all copy, including copy the coding agent drafts)

- Answer first. Real numbers. Plain verbs, contractions, mixed sentence length.
- No em dashes. No exclamation marks.
- Banned words and phrases: delve, dive in, deep dive, tapestry, testament, realm, landscape, navigate, journey, embark, unlock, unleash, elevate, empower, harness, leverage, utilize, foster, streamline, supercharge, seamless, robust, comprehensive, ultimate, crucial, pivotal, vital, cutting-edge, game-changer, versatile, myriad, plethora, bustling, vibrant, meticulous, nuanced, intricate, Indeed, Moreover, Furthermore, Additionally, Notably, Ultimately, Overall, In conclusion, In summary, "In today's fast-paced world", "Whether you're a beginner or a pro", "Look no further", "It's important to note", "It's worth noting", "When it comes to".
- Sentence case headings. No "What is X?" warm-up intros. No moral at the end of sections.

## A14. Definition of done

- [ ] All pages in A7 exist with the exact copy above.
- [ ] Every VERIFY value checked against the USDA SR Legacy CSV; changes listed in the report with fdc_id.
- [ ] All tests pass (report the count); `next build` clean; no console errors.
- [ ] Rich Results Test passes for one page of each template.
- [ ] Lighthouse mobile: home at least 95, tools at least 90, A11y/BP/SEO 100; CLS 0; LCP element is the H1 or intro text.
- [ ] view-source shows all copy, tables, FAQ and default results.
- [ ] 404 returns 404; canonical tags correct; sitemap valid.
- [ ] Design QA in `measuredcup-design.md` section 11 passes at 360, 390, 768, 1280 px.
- [ ] Image weight report and contrast ratios included in the report.
- [ ] Report: commit hash, test count, Lighthouse scores, VERIFY changes, image weights, contrast ratios.

---

# PART B: BROWSER AGENT TASKS (for this push)

1. Owner logs in to Cloudflare. Add zone measuredcup.com (Free plan). Owner changes Hostinger nameservers to Cloudflare's two. Log both in DNS & settings.
2. After the coding agent's first push: connect the GitHub repo to Cloudflare Pages (build `npm run build`, output `out`, env `NODE_VERSION=22`, `NEXT_PUBLIC_WEB3FORMS_KEY`). Add custom domains apex + www.
3. Cloudflare settings: SSL Full (strict), Always Use HTTPS, redirect rule www → apex 301 keeping query string, Web Analytics on, Crawler Hints on, Email Address Obfuscation OFF, Bot Fight Mode OFF, Email Routing hello@measuredcup.com → owner's Gmail.
4. Web3Forms key for hello@measuredcup.com; set env var; send a live test.
5. Verify the live site (manual section 10), recompute every number, run Design QA, PageSpeed mobile.
6. Search Console (domain property via DNS TXT), submit sitemap, request indexing for home + 6 tools + data page. Bing Webmaster Tools import from GSC. IndexNow workflow (separate fix file after launch).
7. Log everything in the Project Memory sheet.
