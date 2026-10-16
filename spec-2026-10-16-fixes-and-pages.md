# MeasuredCup daily work: 2026-10-16

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit 432c510).

Today has two parts:
- **Part A:** small fixes to live pages, found in today's site audit.
- **Part B:** two new pages.

Every rule in `measuredcup-build-spec.md` still applies:
- A5 tool page order;
- A13 writing rules (no em dashes, no banned words);
- the design system;
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow.

Do NOT create number-variant pages.

---

## PART A: Fixes to existing pages

### A1. Shorten the 1/8 cup page title (it is 67 characters, so Google truncates it)
`/tablespoons-in-1-8-cup/` title → `How Many Tablespoons in 1/8 Cup? 2, Plus Grams | MeasuredCup` (60 characters). Keep the H1 unchanged.

### A2. Sort "Latest updates" on the home page
In `app/page.tsx` the list is in registry order, so the October 15 pages sit in the middle.
- Sort by `lastUpdated` descending. On a tie, keep registry order.
- Show at most 8 rows.
- Include every tool page and the data page, so new pages appear at the top automatically.

Test: after this deploy, the first rows are today's two new pages (2026-10-16).

### A3. Butter rounding note on `/tablespoons-to-cups/`
Table 2 shows 8 tbsp butter = 114 g (USDA 227 g per cup ÷ 2 = 113.5 g, rounded). Other pages say a stick is 113 g, so a reader could see a conflict.
- Do not change the data.
- Add one muted line directly under Table 2 (14px, `--muted`), exact text: "USDA lists 227 g for a cup of butter, so 8 tablespoons work out to 113.5 g. A US stick is labeled 113 g. The 0.5 g gap is rounding."

### A4. Dates
Set `lastUpdated: '2026-10-16'` on `/tablespoons-in-1-8-cup/` and `/tablespoons-to-cups/` (both changed today).

---

## PART B: New pages

| # | Slug | Main keyword | US vol | KD | Why |
|---|---|---|---|---|---|
| 1 | `/tablespoons-in-1-4-cup/` | how many tablespoons in 1/4 cup | 90,500 | 36 | #1 today is Kitchen Serf (DA 33) with a page published 2026-10-07, so new pages are ranking. The rest of page 1 is Reddit, Pinterest, YouTube and thin answer pages. "People also search for" asks for 1/4 cup of sugar, butter, flour, oil and water, which no top page answers in grams |
| 2 | `/grams-to-tablespoons/` | grams to tablespoons | high (P1 in keyword map) | mid | Calculator sites (DA 57-68) lead, but gramstocups.io (DA 10, 0 ref domains) ranks #5 and recipemeasurements.com (DA 3) ranks #9. It's the reverse of our live `/tablespoons-to-grams/`, so they support each other |

### B0. Shared refactor: `CupFractionTool`
Generalize `EighthCupTool` into `CupFractionTool({ fraction })` with `fraction` = `1/8` or `1/4`.

Also generalize the table helpers in `lib/calc/tables.ts`:
- `eighthCupEquivalents` → `cupFractionEquivalents(fraction)`;
- `eighthCupByIngredient` → `cupFractionByIngredient(fraction)`;
- `eighthCupGrams` → `cupFractionGrams(id, source, fraction)`.

The 1/8 cup page must render exactly as it does now. All existing tests must keep passing unchanged. Grams use the existing `gramsCell` rule.

---

## B1. `/tablespoons-in-1-4-cup/`

### Registry entry
- title: `How Many Tablespoons in 1/4 Cup? 4, Plus Grams | MeasuredCup` (60 characters)
- metaDescription: `1/4 cup is 4 tablespoons, 12 teaspoons or 2 fluid ounces (59.1 mL). See what 1/4 cup of flour, sugar, butter, oil and 19 more ingredients weighs in grams.`
- h1: `How Many Tablespoons in 1/4 Cup?`
- kind `tool`, category `converters`, tileLine `4 tbsp, plus grams for 23 ingredients`
- related: `['/tablespoons-in-1-8-cup/', '/tablespoons-to-cups/', '/tablespoons-to-grams/', '/butter-converter/']`
- sources: nist, usda, kingArthur
- photoId: `butter-flour-eggs`
- lastUpdated `2026-10-16`

### Quick answer (exact)
"1/4 cup is 4 tablespoons. That's also 12 teaspoons, 2 US fluid ounces or 59.1 mL. By weight it depends on the ingredient: 1/4 cup of all-purpose flour is about 31.3 g, granulated sugar 50 g and butter 56.8 g (USDA FoodData Central)."

### Tool
`CupFractionTool fraction={1/4}`.

Result card:
- big number = grams in 1/4 cup;
- line 2 = "4 tbsp · 12 tsp · 2 fl oz · 59.1 mL";
- line 3 = "Per tablespoon: X g".

Default: All-purpose flour, USDA → **31.3 g**; King Arthur → **30.0 g**.

"Show the math": `125 ÷ 4 = 31.3 g`.

"Need a different amount?" links to `/tablespoons-to-cups/` and `/tablespoons-to-grams/`.

### How to use (exact)
1. Pick the ingredient.
2. Choose USDA, or King Arthur if your recipe comes from their kitchen.
3. Read the grams in 1/4 cup, or measure 4 level tablespoons.

### The formula and two worked examples (exact)
Formula box: `1/4 cup = 16 ÷ 4 = 4 tablespoons` and `grams in 1/4 cup = grams per cup ÷ 4`

- "Granulated sugar. 200 g per cup ÷ 4 = 50 g. So 4 level tablespoons of sugar weigh 50 g."
- "Butter. 227 g per cup ÷ 4 = 56.8 g. That's half of a US stick, and 4 tablespoon marks on the wrapper."

### Section: "How to measure 1/4 cup without a 1/4 cup measure" (exact)
"No 1/4 cup in the drawer? Any of these work:"
- "4 level tablespoons, the most accurate swap."
- "12 level teaspoons, if your tablespoon is missing."
- "Two 1/8 cup measures, if your set has one."
- "The 2 fl oz line on a liquid measuring cup, for liquids only."
- "Half of a 1/2 cup, poured off by eye. Fine for liquids, less exact for flour."

### What this tool doesn't cover (exact)
"It covers US measures only. A UK or Australian 1/4 metric cup is 62.5 mL, a little more than the US 59.1 mL. Weights assume level, spooned measures and typical US products, so packing and brands change them a little."

### Reference tables
Table 1, caption "1/4 cup equivalents (US)":
- Tablespoons | 4
- Teaspoons | 12
- Fluid ounces | 2
- Milliliters | 59.1
- Cups (decimal) | 0.25
- Half of 1/4 cup | 2 tbsp (1/8 cup)
- Double 1/4 cup | 1/2 cup
- Butter | 1/2 stick

Table 2, caption "1/4 cup in grams by ingredient": all 23 ingredients, columns Ingredient | USDA (g) | King Arthur (g, "-" if null) | Per tablespoon, USDA (g). Sortable, generated.

VERIFY (grams in 1/4 cup, `gramsCell`):

| Ingredient | USDA | KA | per tbsp |
|---|---|---|---|
| All-purpose flour | 31.3 | 30.0 | 7.8 |
| Bread flour | 34.3 | 30.0 | 8.6 |
| Cake flour | 34.3 | 30.0 | 8.6 |
| Whole wheat flour | 30.0 | - | 7.5 |
| Granulated sugar | 50.0 | 49.5 | 12.5 |
| Brown sugar (packed) | 55.0 | 53.3 | 13.8 |
| Powdered sugar | 30.0 | 28.3 | 7.5 |
| Butter | 56.8 | 56.5 | 14.2 |
| Honey | 84.8 | 84.0 | 21.2 |
| Maple syrup | 78.8 | 78.0 | 19.7 |
| Whole milk | 61.0 | 56.8 | 15.3 |
| Water | 59.3 | - | 14.8 |
| Vegetable oil | 54.5 | 49.5 | 13.6 |
| Heavy cream | 59.5 | 56.8 | 14.9 |
| Sour cream | 57.5 | 56.8 | 14.4 |
| Yogurt | 61.3 | - | 15.3 |
| Cocoa | 21.5 | 21.0 | 5.4 |
| Rolled oats | 20.3 | 22.3 | 5.1 |
| Rice | 46.3 | 49.5 | 11.6 |
| Cornstarch | 32.0 | 28.0 | 8.0 |
| Peanut butter | 64.5 | 67.5 | 16.1 |
| Chocolate chips | 42.0 | 42.5 | 10.5 |
| Table salt | 73.0 | 72.0 | 18.3 |

### Photo
`InPagePhoto` with `butter-flour-eggs`.

### Tips (exact)
- "1/3 cup is 1/4 cup + 1 tbsp + 1 tsp. That's handy when the 1/3 cup is missing."
- "For butter, 1/4 cup is half a stick. Cut at the 4 tablespoon mark on the wrapper."
- "Spoon flour into the cup and level it with a knife. Scooping straight from the bag packs in up to 20% more."

### FAQ (registry `faq`, exact)
1. Q: "How many tablespoons are in 1/4 cup?" A: "4. A US cup holds 16 tablespoons, and a quarter of 16 is 4. That's the same for dry and liquid ingredients, because both are volume measures."
2. Q: "How many teaspoons are in 1/4 cup?" A: "12 teaspoons. There are 3 teaspoons in a tablespoon, and 1/4 cup is 4 tablespoons."
3. Q: "How many grams is 1/4 cup of flour?" A: "About 31.3 g of all-purpose flour using USDA's 125 g per cup, or 30 g using King Arthur's 120 g per cup."
4. Q: "How many grams is 1/4 cup of sugar?" A: "50 g of granulated sugar using USDA's 200 g per cup. Packed brown sugar is about 55 g, and powdered sugar about 30 g."
5. Q: "How much butter is 1/4 cup?" A: "4 tablespoons, which is half a US stick. By weight that's about 57 g."
6. Q: "Is 1/4 cup the same as 2 ounces?" A: "For volume, yes: 1/4 cup is 2 US fluid ounces. By weight it depends on the ingredient. 1/4 cup of flour is about 1.1 oz (31.3 g), while 1/4 cup of honey is about 3 oz (84.8 g)."

Tests for every VERIFY value and every FAQ number (1.1 oz = 31.25 ÷ 28.3495, 1 dp; 3 oz = 84.75 ÷ 28.3495 = 2.99, written as "about 3").

---

## B2. `/grams-to-tablespoons/`

### Registry entry
- title: `Grams to Tablespoons Converter by Ingredient | MeasuredCup` (58 characters)
- metaDescription: `Convert grams to tablespoons and teaspoons for 23 ingredients. 10 g of flour is 1.3 tbsp, sugar 0.8 tbsp and butter 0.7 tbsp, using USDA and King Arthur data.`
- h1: `Grams to Tablespoons Converter`
- kind `tool`, category `converters`, tileLine `Grams to spoons for 23 ingredients`
- related: `['/tablespoons-to-grams/', '/grams-to-cups/', '/tablespoons-to-cups/', '/butter-converter/']`
- sources: usda, kingArthur, nist
- photoId: `scale-flour`
- lastUpdated `2026-10-16`

### Quick answer (exact)
"Grams to tablespoons depends on the ingredient, because a spoonful of honey weighs almost three times as much as a spoonful of flour. Using USDA data, 1 tablespoon holds about 7.8 g of all-purpose flour, 12.5 g of sugar, 14.2 g of butter and 14.8 g of water. Divide your grams by that number."

### Tool: `GramsToTablespoonsTool`
Inputs:
- **Grams:** decimal input. Default `20`.
- **Ingredient:** grouped select. Default Granulated sugar.
- **Data source:** USDA | King Arthur.

Result card:
- big number = tablespoons, `trimDecimal(x, 2)` + "tbsp";
- line 2 = `toKitchenMeasure(grams ÷ gramsPerCup)` (existing function, unchanged);
- line 3 = teaspoons, `trimDecimal(x, 2)` + "tsp";
- line 4 = "1 tbsp of [ingredient] = X g" (`gramsCell`).

Default HTML result: 20 g sugar (USDA) → **1.6 tbsp**, line 3 **4.8 tsp**. Line 2 is whatever `toKitchenMeasure(0.1)` returns; the expected value is "about 1 tbsp + 1 3/4 tsp". Add a test with the actual output and report it.

"Show the math": `200 ÷ 16 = 12.5 g per tbsp · 20 ÷ 12.5 = 1.6 tbsp`.

Fire `tool_used` `{tool:'grams-to-tablespoons'}`.

### How to use (exact)
1. Type the weight in grams.
2. Choose the ingredient. Flour, sugar and butter all weigh differently per spoon.
3. Leave the source on USDA, or switch to King Arthur for their recipes.
4. Read the tablespoons, then the spoon combination to measure with.

### The formula and two worked examples (exact)
Formula box: `tablespoons = grams ÷ (grams per cup ÷ 16)` and `teaspoons = grams ÷ (grams per cup ÷ 48)`

- "25 g of sugar. 200 ÷ 16 = 12.5 g per tablespoon. 25 ÷ 12.5 = 2 tablespoons exactly, which is also 1/8 cup."
- "100 g of butter. 227 ÷ 16 = 14.19 g per tablespoon. 100 ÷ 14.19 = 7.05 tablespoons, so about 7 tablespoons, one less than a full stick."

### What this tool doesn't cover (exact)
"It assumes level US measuring spoons (14.8 mL tablespoon, 4.9 mL teaspoon). Heaped spoons can hold half as much again. It covers the 23 ingredients in our dataset only, so spices, ground coffee, yeast and baking powder aren't included yet. Australian tablespoons are 20 mL, a third bigger."

### Reference tables
Table 1, caption "Grams to tablespoons (USDA)": rows 5, 10, 15, 20, 25, 30, 50, 100 g; columns All-purpose flour, Granulated sugar, Butter, Honey, Cocoa powder. Values = tablespoons, `trimDecimal(x, 2)`.

VERIFY:

| g | Flour | Sugar | Butter | Honey | Cocoa |
|---|---|---|---|---|---|
| 5 | 0.64 | 0.4 | 0.35 | 0.24 | 0.93 |
| 10 | 1.28 | 0.8 | 0.7 | 0.47 | 1.86 |
| 15 | 1.92 | 1.2 | 1.06 | 0.71 | 2.79 |
| 20 | 2.56 | 1.6 | 1.41 | 0.94 | 3.72 |
| 25 | 3.2 | 2 | 1.76 | 1.18 | 4.65 |
| 30 | 3.84 | 2.4 | 2.11 | 1.42 | 5.58 |
| 50 | 6.4 | 4 | 3.52 | 2.36 | 9.3 |
| 100 | 12.8 | 8 | 7.05 | 4.72 | 18.6 |

Table 2: reuse the existing `SpoonGramsTable` (grams in 1 tablespoon and 1 teaspoon, all 23 ingredients), same caption as on `/tablespoons-to-grams/`.

### Photo
`InPagePhoto` with `scale-flour`.

### Tips (exact)
- "Under 5 g, a scale that reads in 0.1 g steps beats any spoon. Most kitchen scales only read whole grams."
- "Level dry ingredients with a knife. A heaped tablespoon of flour can weigh 12 g instead of 7.8 g."
- "For butter, skip the spoon. The wrapper marks tablespoons, and each one is about 14 g."

### FAQ (registry `faq`, exact)
1. Q: "How many grams is 1 tablespoon?" A: "It depends on the ingredient. 1 tablespoon of water is 14.8 g, all-purpose flour about 7.8 g, sugar 12.5 g, butter 14.2 g and honey 21.2 g (USDA FoodData Central)."
2. Q: "Is 1 tablespoon 15 grams?" A: "Only for water and similar liquids, which weigh about 14.8 g per tablespoon. Flour is about half that, and honey is about 21 g."
3. Q: "How many tablespoons is 10 grams of sugar?" A: "0.8 tablespoons, which is 2.4 teaspoons, using USDA's 12.5 g per tablespoon."
4. Q: "How many tablespoons is 100 grams of butter?" A: "About 7 tablespoons (7.05), one less than a US stick of 8 tablespoons."
5. Q: "How many tablespoons is 20 grams of flour?" A: "About 2 1/2 tablespoons: 2.56 using USDA's 125 g per cup, or 2.67 using King Arthur's 120 g per cup."
6. Q: "How do I convert grams to teaspoons?" A: "Divide grams by the grams in one teaspoon, which is the grams per cup ÷ 48. For sugar that's 4.2 g per teaspoon, so 10 g is 2.4 teaspoons."

Tests for every VERIFY cell and FAQ number. The King Arthur 20 g flour value is 20 ÷ 7.5 = 2.67.

---

## C. Wiring

- `/converters/` hub "Which tool do I need?" table, add:
  - "I have grams and need tablespoons" → Grams to tablespoons
  - "My recipe says 1/4 cup" → Tablespoons in 1/4 cup
- Related lists, keep 4 items each:
  - add `/tablespoons-in-1-4-cup/` to `/tablespoons-in-1-8-cup/` and `/tablespoons-to-cups/`;
  - add `/grams-to-tablespoons/` to `/tablespoons-to-grams/` and `/grams-to-cups/`.
- Confirm 25 URLs in `out/sitemap.xml`.
- Schema on both new pages: WebApplication + BreadcrumbList + FAQPage, no rating.

## D. Definition of done
- `npm test` passes, including all VERIFY values and FAQ numbers. Report the count.
- `npm run build` is clean. Lighthouse mobile ≥95 on both new pages and on the 1/8 cup page after the refactor; CLS 0.
- No em dashes or banned words in any new or changed copy.
- The home "Latest updates" list starts with today's pages.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse scores for the 3 pages;
  - the IndexNow status line;
  - the actual `toKitchenMeasure(0.1)` string;
  - any VERIFY value changed, and why.
