# MeasuredCup daily work: 2026-10-23

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit 6ffd407).

**Today's check:**
- All 34 live pages verified after da9b119 and 6ffd407.
- Search Console, last 28 days: 2.4k impressions, average position 51.
- Landing page submitted for indexing.

**No fixes to existing pages today.** Just two new pages.

All rules in `measuredcup-build-spec.md` still apply:
- A5 page order;
- A13 writing rules (no em dashes, no banned words);
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow;
- titles 30–60 and descriptions 110–160;
- `datePublished` and `lastUpdated` = `2026-10-23`, with the WebPage node (F1) on both pages.

No number-variant pages.

| # | Slug | Main keyword | Why |
|---|---|---|---|
| 1 | `/tablespoons-in-1-2-cup/` | how many tablespoons in 1/2 cup | Biggest missing piece of the 1/8, 1/4, 1/3, 2/3 set. Page 1 is blogs, parasite pages and calculator sites, and none of them give grams per ingredient |
| 2 | `/ounces-in-a-cup/` | how many ounces in a cup | Very high volume. Searchers mix up fluid ounces (volume) and ounces (weight). We answer both, with weight ounces for all 23 ingredients from our own data, which most results don't have |

---

## B1. `/tablespoons-in-1-2-cup/`

Built on `CupFractionTool` / `CupFractionTable` with `fraction = 1/2`. `tbspTspLabel(24)` = **"8 tbsp"**. The 1/8, 1/4, 1/3 and 2/3 pages must render exactly as now.

### Registry entry
- title: `How Many Tablespoons in 1/2 Cup? Plus Grams | MeasuredCup` (57)
- metaDescription: `1/2 cup is 8 tablespoons (24 teaspoons, 4 fl oz, 118.3 mL). See what 1/2 cup of flour, sugar, butter, milk and 19 more ingredients weighs in grams.` (147)
- h1: `How Many Tablespoons in 1/2 Cup?`
- kind `tool`, category `converters`, tileLine `8 tbsp, plus grams for 23 ingredients`
- related: `['/tablespoons-in-1-4-cup/', '/tablespoons-in-2-3-cup/', '/butter-converter/', '/cups-to-grams/']`
- sources: nist, usda, kingArthur
- photoId: `butter-flour-eggs`

### Quick answer (exact)
"1/2 cup is 8 tablespoons, which is 24 teaspoons, 4 US fluid ounces or about 118.3 mL. By weight it depends on the ingredient: 1/2 cup of all-purpose flour is about 62.5 g, granulated sugar 100 g and butter about 113 g, one US stick (USDA FoodData Central)."

### Tool
`CupFractionTool fraction={1/2}`.

Result card:
- big number = grams in 1/2 cup;
- line 2 = "8 tbsp · 24 tsp · 4 fl oz · 118.3 mL";
- line 3 = "Per tablespoon: X g".

Default: All-purpose flour, USDA → **62.5 g**; King Arthur → **60.0 g**. "Show the math": `125 × 1 ÷ 2 = 62.5 g`.

"Need a different amount?" links to `/tablespoons-in-1-4-cup/` and `/cups-to-grams/`.

### How to use (exact)
1. Pick the ingredient.
2. Choose USDA, or King Arthur if your recipe comes from their kitchen.
3. Read the grams in 1/2 cup, or count out 8 level tablespoons.

### The formula and two worked examples (exact)
Formula box: `1/2 cup = 16 ÷ 2 = 8 tablespoons` and `grams in 1/2 cup = grams per cup ÷ 2`

- "Butter. 1/2 cup is 8 tablespoons, which is exactly one US stick. USDA's 227 g per cup gives 113.5 g; the stick wrapper says 113 g (4 oz)."
- "Whole milk. 244 g per cup ÷ 2 = 122 g, which matches the cups to grams converter for 1/2 cup."

### Section: "How to measure 1/2 cup without a 1/2 cup measure" (exact)
"No 1/2 cup? Use any of these:"
- "Two level 1/4 cup scoops. The easiest swap."
- "8 level tablespoons."
- "1/3 cup plus 2 tablespoons plus 2 teaspoons."
- "For liquids, the 4 fl oz line on a measuring cup."
- "For butter, one US stick. The wrapper marks all 8 tablespoons."

### What this tool doesn't cover (exact)
"It covers US measures only. A UK or Australian 1/2 metric cup is 125 mL, a little more than the US 118.3 mL. Weights assume level, spooned measures and typical US products, so packing and brands change them a little."

### Reference tables
Table 1, caption "1/2 cup equivalents (US)":
- Tablespoons | 8
- Teaspoons | 24
- Fluid ounces | 4
- Milliliters | 118.3
- Cups (decimal) | 0.5
- Half of 1/2 cup | 1/4 cup (4 tbsp)
- Double 1/2 cup | 1 cup (16 tbsp)
- Butter | 8 tbsp, 1 stick

Table 2, caption "1/2 cup in grams by ingredient": all 23 ingredients, same columns as the 2/3 cup page.

VERIFY (`gramsCell`, from `ingredients.ts`):

| Ingredient | USDA | KA | per tbsp |
|---|---|---|---|
| All-purpose flour | 62.5 | 60.0 | 7.8 |
| Bread flour | 68.5 | 60.0 | 8.6 |
| Cake flour | 68.5 | 60.0 | 8.6 |
| Whole wheat flour | 60.0 | - | 7.5 |
| Granulated sugar | 100 | 99.0 | 12.5 |
| Brown sugar (packed) | 110 | 107 | 13.8 |
| Powdered sugar (unsifted) | 60.0 | 56.5 | 7.5 |
| Butter | 114 | 113 | 14.2 |
| Honey | 170 | 168 | 21.2 |
| Maple syrup | 158 | 156 | 19.7 |
| Whole milk | 122 | 114 | 15.3 |
| Water | 119 | - | 14.8 |
| Vegetable oil | 109 | 99.0 | 13.6 |
| Heavy cream | 119 | 114 | 14.9 |
| Sour cream | 115 | 114 | 14.4 |
| Plain whole-milk yogurt | 123 | - | 15.3 |
| Unsweetened cocoa powder | 43.0 | 42.0 | 5.4 |
| Rolled oats | 40.5 | 44.5 | 5.1 |
| Long-grain white rice (uncooked) | 92.5 | 99.0 | 11.6 |
| Cornstarch | 64.0 | 56.0 | 8.0 |
| Peanut butter | 129 | 135 | 16.1 |
| Semisweet chocolate chips | 84.0 | 85.0 | 10.5 |
| Table salt | 146 | 144 | 18.3 |

Under Table 2, one muted line (exact): "Butter shows 114 g because USDA lists 227 g per cup. A US stick is labeled 113 g (4 oz); the 1 g gap is rounding."

### Photo
`InPagePhoto` with `butter-flour-eggs`.

### Tips (exact)
- "1/2 cup of butter is one stick. No measuring cup needed."
- "Halving a recipe that calls for 1 cup? Use 1/2 cup, or 8 tablespoons."
- "Halving 1/2 cup gives 1/4 cup, which is 4 tablespoons."

### FAQ (registry `faq`, exact)
1. Q: "How many tablespoons are in 1/2 cup?" A: "8 tablespoons. A US cup holds 16, and half of 16 is 8. It's the same for dry and liquid ingredients."
2. Q: "How many teaspoons are in 1/2 cup?" A: "24 teaspoons. There are 3 teaspoons in each of the 8 tablespoons."
3. Q: "Is 1/2 cup of butter one stick?" A: "Yes. A US stick of butter is 1/2 cup, 8 tablespoons or about 113 g (4 oz)."
4. Q: "How many grams is 1/2 cup of flour?" A: "About 62.5 g of all-purpose flour using USDA's 125 g per cup, or 60 g using King Arthur's 120 g per cup."
5. Q: "How many grams is 1/2 cup of sugar?" A: "100 g of granulated sugar using USDA's 200 g per cup. Packed brown sugar is about 110 g."
6. Q: "Is 1/2 cup 4 ounces?" A: "For liquids, yes: 1/2 cup is 4 US fluid ounces. By weight it depends on the ingredient. 1/2 cup of flour is about 2.2 oz, while 1/2 cup of butter is about 4 oz."

Tests:
- every VERIFY value and FAQ number;
- `tbspTspLabel(24)` = "8 tbsp";
- the 1/8, 1/4, 1/3 and 2/3 pages are unchanged.

---

## B2. `/ounces-in-a-cup/`

### New constant
Add to `constants.ts`: `ML_PER_IMPERIAL_FL_OZ = 28.4130625`. Source comment: UK imperial fluid ounce, NIST Handbook 44 Appendix C, accessed 2026-10-23.

### New tool: `CupOuncesTool`
Put it in `components/tools/`, reusing the existing ingredient select and the USDA / King Arthur toggle.

**Inputs:**
- Cups (default `1`; accepts fractions like 1/2 and 3/4);
- Ingredient (default All-purpose flour);
- Data source (default USDA).

**Result card:**
- Big line: **"8 fl oz"**, the volume: `cups × 8`, trimmed to 2 dp.
- Line 2: "By weight: 4.41 oz (125 g) of all-purpose flour". The weight is `grams per cup × cups ÷ G_PER_OZ`, shown to 2 dp, with grams from `gramsCell`.
- Line 3, muted (exact): "Fluid ounces measure space. Ounces on a scale measure weight. They only match for water-like liquids."

**"Show the math":** `1 cup × 8 = 8 fl oz` and `125 g ÷ 28.35 = 4.41 oz`.

Default (1 cup, AP flour): USDA **8 fl oz, 4.41 oz (125 g)**; King Arthur **8 fl oz, 4.23 oz (120 g)**.

Fire `tool_used` with `{tool:'ounces-in-a-cup'}`.

### Registry entry
- title: `How Many Ounces in a Cup? Fluid vs Weight | MeasuredCup` (55)
- metaDescription: `A US cup is 8 fluid ounces. By weight it depends on the food: a cup of flour is about 4.4 oz, sugar 7 oz, butter 8 oz. See all 23 ingredients.` (142)
- h1: `How Many Ounces in a Cup?`
- kind `tool`, category `converters`, tileLine `8 fl oz, plus weight ounces for 23 ingredients`
- related: `['/cups-to-ml/', '/cups-to-grams/', '/tablespoons-in-1-2-cup/', '/cups-in-a-quart/']`
- sources: nist, usda, kingArthur
- photoId: `four-cups`

### Quick answer (exact)
"A US cup holds 8 fluid ounces. That's a volume measure, so it's the same for any liquid. By weight, a cup is 8 oz only for water-like liquids: a cup of all-purpose flour weighs about 4.4 oz, granulated sugar about 7.1 oz and butter about 8 oz (USDA FoodData Central)."

### How to use (exact)
1. Type the number of cups. Fractions like 1/2 work.
2. Pick the ingredient, and USDA or King Arthur.
3. Read fluid ounces for a measuring jug, or ounces by weight for a kitchen scale.

### The formula and two worked examples (exact)
Formula box: `fluid ounces = cups × 8` and `ounces by weight = grams per cup × cups ÷ 28.35`

- "Milk for a sauce. 1 1/2 cups × 8 = 12 fl oz. On a scale that's about 12.9 oz (366 g), because milk is a little heavier than water."
- "Flour by weight. A recipe calls for 2 cups of all-purpose flour. 2 × 125 g = 250 g, and 250 ÷ 28.35 = 8.82 oz. Weighing 8 oz would leave you short by almost a quarter cup."

### Section: "Fluid ounces vs ounces" (exact)
"A fluid ounce is a unit of volume: 1/8 of a US cup, about 29.6 mL. An ounce (avoirdupois) is a unit of weight: 28.35 g. Measuring cups and jugs are marked in fluid ounces; kitchen scales show ounces. For water, 8 fl oz weighs about 8.35 oz, so the two are close. For flour they're far apart: 8 fl oz of flour weighs only about 4.4 oz."

### Section: "Cups in other countries" (exact)
"US recipes use the US cup of 236.6 mL, which is exactly 8 US fluid ounces. Nutrition labels use a 240 mL cup, about 8.1 fl oz. A metric cup (UK, Australia, Canada) is 250 mL, which is about 8.45 US fl oz or 8.8 UK imperial fl oz."

Table, caption "Cup sizes in fluid ounces": columns Cup | mL | US fl oz | UK fl oz. Rows:
- US customary cup | 236.6 | 8 | 8.33
- US legal cup (nutrition labels) | 240 | 8.12 | 8.45
- Metric cup | 250 | 8.45 | 8.8
- Japanese cup | 200 | 6.76 | 7.04

Generate the rows from the constants (2 dp, trimmed).

### What this tool doesn't cover (exact)
"It works in US cups. Weight ounces use average figures for level, spooned measures of typical US products, so packing and brands change them a little. For other cup sizes, use the table above."

### Reference tables
Table 1, caption "Cups to fluid ounces (US)": columns Cups | Fluid ounces | Tablespoons | mL.

| Cups | fl oz | tbsp | mL |
|---|---|---|---|
| 1/8 | 1 | 2 | 29.6 |
| 1/4 | 2 | 4 | 59.1 |
| 1/3 | 2.67 | 5 1/3 | 78.9 |
| 1/2 | 4 | 8 | 118.3 |
| 2/3 | 5.33 | 10 2/3 | 157.7 |
| 3/4 | 6 | 12 | 177.4 |
| 1 | 8 | 16 | 236.6 |
| 1 1/2 | 12 | 24 | 354.9 |
| 2 | 16 | 32 | 473.2 |
| 4 | 32 | 64 | 946.4 |

Table 2, caption "How many ounces 1 cup weighs, by ingredient": columns Ingredient | Grams (USDA) | Ounces (USDA) | Ounces (King Arthur).

VERIFY (oz = g ÷ 28.349523125, 2 dp):

| Ingredient | g USDA | oz USDA | oz KA |
|---|---|---|---|
| All-purpose flour | 125 | 4.41 | 4.23 |
| Bread flour | 137 | 4.83 | 4.23 |
| Cake flour | 137 | 4.83 | 4.23 |
| Whole wheat flour | 120 | 4.23 | - |
| Granulated sugar | 200 | 7.05 | 6.98 |
| Brown sugar (packed) | 220 | 7.76 | 7.51 |
| Powdered sugar (unsifted) | 120 | 4.23 | 3.99 |
| Butter | 227 | 8.01 | 7.97 |
| Honey | 339 | 11.96 | 11.85 |
| Maple syrup | 315 | 11.11 | 11.01 |
| Whole milk | 244 | 8.61 | 8.01 |
| Water | 237 | 8.36 | - |
| Vegetable oil | 218 | 7.69 | 6.98 |
| Heavy cream | 238 | 8.40 | 8.01 |
| Sour cream | 230 | 8.11 | 8.01 |
| Plain whole-milk yogurt | 245 | 8.64 | - |
| Unsweetened cocoa powder | 86 | 3.03 | 2.96 |
| Rolled oats | 81 | 2.86 | 3.14 |
| Long-grain white rice (uncooked) | 185 | 6.53 | 6.98 |
| Cornstarch | 128 | 4.52 | 3.95 |
| Peanut butter | 258 | 9.10 | 9.52 |
| Semisweet chocolate chips | 168 | 5.93 | 6.00 |
| Table salt | 292 | 10.30 | 10.16 |

Under Table 2, one muted line (exact): "King Arthur's chart lists all-purpose flour as 4 1/4 oz (120 g). We convert from grams, so it shows 4.23 oz."

### Photo
`InPagePhoto` with `four-cups`.

### Tips (exact)
- "If a recipe gives ounces for a dry ingredient, it means weight. Use a scale, not a measuring cup."
- "For water, milk and juice, 1 cup is about 8 oz on a scale too, so either works."
- "A standard US coffee mug holds 10 to 12 fl oz, not 8. Don't use one as a measuring cup."

### FAQ (registry `faq`, exact)
1. Q: "How many ounces are in a cup?" A: "8 US fluid ounces. By weight it depends on the ingredient: about 4.4 oz for all-purpose flour, 7.1 oz for sugar and 8 oz for butter."
2. Q: "Is a cup 8 oz dry?" A: "No. 8 oz is the volume of a cup. A cup of dry flour weighs only about 4.4 oz, and a cup of sugar about 7 oz."
3. Q: "How many ounces is a cup of flour?" A: "About 4.41 oz (125 g) of all-purpose flour using USDA, or 4.23 oz (120 g) using King Arthur."
4. Q: "How many ounces are in 1/2 cup?" A: "4 US fluid ounces. By weight, 1/2 cup of butter is about 4 oz, which is one stick."
5. Q: "How many fluid ounces is a metric cup?" A: "A 250 mL metric cup is about 8.45 US fluid ounces, or 8.8 UK imperial fluid ounces."
6. Q: "How many cups is 16 ounces?" A: "2 cups if it's 16 fluid ounces. If it's 16 oz by weight, it depends on the ingredient: 16 oz of flour is about 3.6 cups, while 16 oz of sugar is about 2.3 cups."

Check FAQ 6: 453.6 ÷ 125 = 3.63 cups and 453.6 ÷ 200 = 2.27 cups. Test both.

Tests:
- both chart tables;
- the cup-sizes table;
- the default tool outputs (USDA and King Arthur);
- the FAQ numbers;
- `ML_PER_IMPERIAL_FL_OZ` is used for the UK fl oz column.

---

## C. Wiring
- `/converters/` "Which tool do I need?" table, add:
  - "My recipe says 1/2 cup" → Tablespoons in 1/2 cup
  - "I need ounces in a cup" → Ounces in a cup
- Related lists, 4 items each:
  - add `/tablespoons-in-1-2-cup/` to `/tablespoons-in-1-4-cup/` (replace `/tablespoons-to-grams/`);
  - add `/ounces-in-a-cup/` to `/cups-to-ml/` (replace its last item).
- Sitemap should list **36** URLs.
- Schema on both: WebPage (F1) + WebApplication + BreadcrumbList + FAQPage, no rating.
- Both pages appear on `/authors/sikander-malik/` "Pages by Sikander" (registry-driven).

## D. Definition of done
- `npm test` passes. Report the count.
- `npm run build` is clean. Lighthouse mobile ≥95 and CLS 0 on both new pages.
- The 1/8, 1/4, 1/3 and 2/3 pages are unchanged.
- No em dashes or banned words.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse for both new pages;
  - the IndexNow status line;
  - any VERIFY value changed, and why.
