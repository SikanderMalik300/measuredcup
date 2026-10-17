# MeasuredCup daily work: 2026-10-17

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit eb4edbb).

Today:
- **Part A:** 3 title fixes.
- **Part B:** 2 new pages.

All rules in `measuredcup-build-spec.md` still apply:
- A5 page order;
- A13 writing rules (no em dashes, no banned words);
- design system;
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow.

No number-variant pages.

---

## PART A: Fixes (today's audit)

All 25 pages return 200, with 0 broken links and 0 orphans. Three titles are over 60 characters, so Google truncates them. Replace the registry titles exactly:

| Page | Old (length) | New (length) |
|---|---|---|
| `/half-a-measurement/` | Half of a Measurement Calculator (Cups and Spoons) \| MeasuredCup (64) | `Half a Measurement Calculator (Cups & Spoons) \| MeasuredCup` (59) |
| `/tablespoons-to-cups/` | Tablespoons to Cups Converter (Chart + Fractions) \| MeasuredCup (63) | `Tablespoons to Cups Converter + Chart \| MeasuredCup` (51) |
| `/data/ingredient-weights/` | Ingredient Weights per Cup: USDA vs King Arthur \| MeasuredCup (61) | `Cup Weights by Ingredient: USDA vs King Arthur \| MeasuredCup` (60) |

H1s stay unchanged. Add a test that every registry title is 60 characters or less, so this can't happen again.

Do NOT change `lastUpdated` for these three; a title change isn't a content update.

---

## PART B: New pages

| # | Slug | Main keyword | US vol | Why |
|---|---|---|---|---|
| 1 | `/tablespoons-in-1-3-cup/` | how many tablespoons in 1/3 cup | high (same family as 1/4 cup) | Page 1 includes tablespoontoteaspoon.com (DA 4, 0 traffic), Quora, Pinterest and YouTube. "People also search for" asks for 1/3 cup of butter, flour, sugar and water in grams |
| 2 | `/cups-in-a-quart/` | how many cups in a quart | 74,000 (KD 30) | #1 is a DA 61 blog; the rest are DA 34-76 blogs, school sites and Quora. Our angle is the liquid vs dry quart, which the top pages barely explain, and that matters because berries are sold by the dry quart |

---

## B1. `/tablespoons-in-1-3-cup/`

Built on `CupFractionTool` / `CupFractionTable` with `fraction = 1/3`. 1/3 cup is not a whole number of tablespoons, so tablespoon counts in the equivalents and line 2 must display as **"5 tbsp + 1 tsp"**: whole tablespoons plus whole teaspoons, from 16 tsp. Add a helper (`tbspTspLabel(totalTsp)`) and test it:
- 16 → `5 tbsp + 1 tsp`
- 8 → `2 tbsp + 2 tsp`
- 32 → `10 tbsp + 2 tsp`
- 12 → `4 tbsp`
- 6 → `2 tbsp`

The 1/8 and 1/4 pages must render exactly as now.

### Registry entry
- title: `How Many Tablespoons in 1/3 Cup? Plus Grams | MeasuredCup` (57)
- metaDescription: `1/3 cup is 5 tablespoons plus 1 teaspoon (16 teaspoons, 78.9 mL). See what 1/3 cup of flour, sugar, butter, water and 19 more ingredients weighs in grams.`
- h1: `How Many Tablespoons in 1/3 Cup?`
- kind `tool`, category `converters`, tileLine `5 tbsp + 1 tsp, plus grams`
- related: `['/tablespoons-in-1-4-cup/', '/tablespoons-to-cups/', '/half-a-measurement/', '/tablespoons-to-grams/']`
- sources: nist, usda, kingArthur
- photoId: `copper-cups-paper`
- lastUpdated `2026-10-17`

### Quick answer (exact)
"1/3 cup is 5 tablespoons plus 1 teaspoon, which is 16 teaspoons, about 2.67 US fluid ounces or 78.9 mL. By weight it depends on the ingredient: 1/3 cup of all-purpose flour is about 41.7 g, granulated sugar 66.7 g and butter 75.7 g (USDA FoodData Central)."

### Tool
`CupFractionTool fraction={1/3}`.

Result card:
- big number = grams in 1/3 cup;
- line 2 = "5 tbsp + 1 tsp · 16 tsp · 2.67 fl oz · 78.9 mL";
- line 3 = "Per tablespoon: X g".

Default: All-purpose flour, USDA → **41.7 g**; King Arthur → **40.0 g**. "Show the math": `125 ÷ 3 = 41.7 g`.

"Need a different amount?" links to `/tablespoons-to-cups/` and `/half-a-measurement/`.

### How to use (exact)
1. Pick the ingredient.
2. Choose USDA, or King Arthur if your recipe comes from their kitchen.
3. Read the grams in 1/3 cup, or measure 5 level tablespoons plus 1 level teaspoon.

### The formula and two worked examples (exact)
Formula box: `1/3 cup = 16 ÷ 3 = 5 1/3 tablespoons = 5 tbsp + 1 tsp` and `grams in 1/3 cup = grams per cup ÷ 3`

- "Why the extra teaspoon: a tablespoon is 3 teaspoons, so the leftover 1/3 tablespoon is exactly 1 teaspoon. That's why 1/3 cup never comes out to a whole number of tablespoons."
- "Granulated sugar. 200 g per cup ÷ 3 = 66.7 g. Five level tablespoons of sugar are 62.5 g, and the extra teaspoon adds the last 4.2 g."

### Section: "How to measure 1/3 cup without a 1/3 cup measure" (exact)
"Missing the 1/3 cup? These all land on the same amount:"
- "5 level tablespoons plus 1 level teaspoon."
- "16 level teaspoons, if you're patient."
- "1/4 cup plus 1 tablespoon plus 1 teaspoon."
- "Half of a 2/3 cup measure, poured off by eye. Fine for liquids, less exact for flour."
- "For liquids, a little under the 3 fl oz line on a measuring cup (1/3 cup is 2.67 fl oz)."

### What this tool doesn't cover (exact)
"It covers US measures only. A UK or Australian 1/3 metric cup is about 83.3 mL, a bit more than the US 78.9 mL. Weights assume level, spooned measures and typical US products, so packing and brands change them a little."

### Reference tables
Table 1, caption "1/3 cup equivalents (US)":
- Tablespoons | 5 tbsp + 1 tsp (5 1/3)
- Teaspoons | 16
- Fluid ounces | 2.67
- Milliliters | 78.9
- Cups (decimal) | 0.333
- Half of 1/3 cup | 2 tbsp + 2 tsp
- Double 1/3 cup | 2/3 cup (10 tbsp + 2 tsp)
- Butter | 5 tbsp + 1 tsp, about 2/3 of a stick

Table 2, caption "1/3 cup in grams by ingredient": all 23 ingredients, same columns as the 1/4 cup page.

VERIFY (`gramsCell`; per-tablespoon values are unchanged from the 1/4 cup page):

| Ingredient | USDA | KA | per tbsp |
|---|---|---|---|
| All-purpose flour | 41.7 | 40.0 | 7.8 |
| Bread flour | 45.7 | 40.0 | 8.6 |
| Cake flour | 45.7 | 40.0 | 8.6 |
| Whole wheat flour | 40.0 | - | 7.5 |
| Granulated sugar | 66.7 | 66.0 | 12.5 |
| Brown sugar (packed) | 73.3 | 71.0 | 13.8 |
| Powdered sugar | 40.0 | 37.7 | 7.5 |
| Butter | 75.7 | 75.3 | 14.2 |
| Honey | 113 | 112 | 21.2 |
| Maple syrup | 105 | 104 | 19.7 |
| Whole milk | 81.3 | 75.7 | 15.3 |
| Water | 79.0 | - | 14.8 |
| Vegetable oil | 72.7 | 66.0 | 13.6 |
| Heavy cream | 79.3 | 75.7 | 14.9 |
| Sour cream | 76.7 | 75.7 | 14.4 |
| Yogurt | 81.7 | - | 15.3 |
| Cocoa | 28.7 | 28.0 | 5.4 |
| Rolled oats | 27.0 | 29.7 | 5.1 |
| Rice | 61.7 | 66.0 | 11.6 |
| Cornstarch | 42.7 | 37.3 | 8.0 |
| Peanut butter | 86.0 | 90.0 | 16.1 |
| Chocolate chips | 56.0 | 56.7 | 10.5 |
| Table salt | 97.3 | 96.0 | 18.3 |

### Photo
`InPagePhoto` with `copper-cups-paper`.

### Tips (exact)
- "2/3 cup is double: 10 tablespoons plus 2 teaspoons."
- "For butter, 1/3 cup is 5 tablespoon marks plus a thin slice, about 75 g."
- "When a recipe uses 1/3 cup of flour three times, use one full cup instead. It's faster and more accurate."

### FAQ (registry `faq`, exact)
1. Q: "How many tablespoons are in 1/3 cup?" A: "5 tablespoons plus 1 teaspoon, which is 5 1/3 tablespoons. A cup holds 16 tablespoons, and 16 ÷ 3 leaves one third of a tablespoon, which is exactly 1 teaspoon."
2. Q: "Is 5 tablespoons a third of a cup?" A: "Almost. 5 tablespoons is 1 teaspoon short of 1/3 cup. Add one level teaspoon to make it exact."
3. Q: "Is 6 tablespoons equal to 1/3 cup?" A: "No. 6 tablespoons is 3/8 cup, which is 2 teaspoons more than 1/3 cup."
4. Q: "How many grams is 1/3 cup of flour?" A: "About 41.7 g of all-purpose flour using USDA's 125 g per cup, or 40 g using King Arthur's 120 g per cup."
5. Q: "How much butter is 1/3 cup?" A: "5 tablespoons plus 1 teaspoon, about 2/3 of a US stick. By weight that's about 75.7 g."
6. Q: "How many tablespoons are in 2/3 cup?" A: "10 tablespoons plus 2 teaspoons. It's double the 1/3 cup amount."

Tests: every VERIFY value; FAQ numbers; 5 tbsp sugar = 62.5 g and 1 tsp sugar = 4.2 g (200 ÷ 48 = 4.17).

---

## B2. `/cups-in-a-quart/`

### New constants (`lib/data/constants.ts`, NIST Handbook 44 Appendix C)
- `ML_PER_PINT = 473.176473`
- `ML_PER_QUART = 946.352946`
- `ML_PER_GALLON = 3785.411784`
- `ML_PER_DRY_QUART = 1101.220942715` (67.2006 cubic inches)
- `ML_PER_IMPERIAL_QUART = 1136.5225` (UK, for one sentence only)

### New tool: `LiquidVolumeTool`
Inputs:
- **Amount:** text, fractions allowed via `parseAmount`. Default `1`.
- **From unit:** native select of gallons, quarts, pints, cups, fluid ounces, tablespoons, milliliters, liters. Default quarts.

Results show every other unit at once:
- cups (prominent big number);
- gallons, quarts, pints, fl oz, tbsp, mL, liters.

Number formats:
- cups, pints, quarts and gallons: `trimDecimal(x, 3)`;
- fl oz: `trimDecimal(x, 2)`;
- tbsp: `trimDecimal(x, 1)`;
- mL: 1 decimal under 1,000, otherwise whole with a thousands comma;
- L: `trimDecimal(x, 2)`.

Default result: **4 cups**, 0.25 gal, 2 pints, 32 fl oz, 64 tbsp, 946.4 mL, 0.95 L.

"Show the math": `1 × 4 = 4 cups`.

Fire `tool_used` `{tool:'cups-in-a-quart'}`.

### Registry entry
- title: `How Many Cups in a Quart? 4, Plus Dry Quarts | MeasuredCup` (58)
- metaDescription: `A US quart is 4 cups, 2 pints or 32 fluid ounces (946 mL). See the quarts to cups chart, plus why a dry quart of berries holds about 4.65 cups.`
- h1: `How Many Cups in a Quart?`
- kind `tool`, category `converters`, tileLine `4 cups, plus pints, gallons and mL`
- related: `['/tablespoons-to-cups/', '/cups-to-grams/', '/recipe-scaler/', '/half-a-measurement/']`
- sources: nist, usda
- photoId: `four-cups`
- lastUpdated `2026-10-17`

### Quick answer (exact)
"There are 4 cups in a US quart. A quart is also 2 pints, 32 fluid ounces or 946 mL, and 4 quarts make a gallon. One exception: a dry quart, the basket berries are sold in, is bigger and holds about 4.65 cups."

### How to use (exact)
1. Type the amount. Fractions like 1 1/2 work.
2. Choose the unit you're starting from.
3. Read cups first, then every other unit underneath.

### The formula and two worked examples (exact)
Formula box: `cups = quarts × 4` and `quarts = cups ÷ 4`

- "1 1/2 quarts of stock. 1.5 × 4 = 6 cups, which is also 48 fluid ounces."
- "A recipe needs 10 cups of water and your pitcher is marked in quarts. 10 ÷ 4 = 2.5 quarts, so fill it to 2 quarts and add 2 more cups."

### Section: "Liquid quart vs dry quart" (new section, after the formula; exact)
"US recipes almost always mean the liquid quart: 4 cups, 32 fl oz, 946 mL. The dry quart is a separate, larger unit used for produce like strawberries, blueberries and cherry tomatoes. It's 1,101 mL, which is about 4.65 US cups. The British imperial quart is larger again at about 1,137 mL, or 4.8 US cups."

Table, caption "Three kinds of quart": columns Quart | mL | US cups. Rows:
- US liquid quart | 946.4 | 4
- US dry quart | 1,101 | 4.65
- UK imperial quart | 1,137 | 4.8

Generate the values from the constants.

### What this tool doesn't cover (exact)
"It converts US liquid volume only. Dry quarts and imperial quarts are explained above but aren't in the converter. A quart of flour or berries doesn't have a fixed weight; for weights, use cups to grams with the ingredient."

### Reference tables
Table 1, caption "Quarts to cups chart (US liquid)": columns Quarts | Cups | Pints | Fluid ounces | mL. Rows:

| Quarts | Cups | Pints | fl oz | mL |
|---|---|---|---|---|
| 1/4 | 1 | 1/2 | 8 | 236.6 |
| 1/2 | 2 | 1 | 16 | 473.2 |
| 3/4 | 3 | 1 1/2 | 24 | 709.8 |
| 1 | 4 | 2 | 32 | 946.4 |
| 1 1/2 | 6 | 3 | 48 | 1,420 |
| 2 | 8 | 4 | 64 | 1,893 |
| 3 | 12 | 6 | 96 | 2,839 |
| 4 (1 gallon) | 16 | 8 | 128 | 3,785 |

Table 2, caption "What a quart weighs (USDA)": columns Liquid | Grams | Pounds. Grams = 4 × USDA grams per cup, whole grams with a comma; pounds = g ÷ 453.59237, 2 dp.

| Liquid | g | lb |
|---|---|---|
| Water | 948 | 2.09 |
| Whole milk | 976 | 2.15 |
| Heavy cream | 952 | 2.10 |
| Vegetable oil | 872 | 1.92 |
| Maple syrup | 1,260 | 2.78 |
| Honey | 1,356 | 2.99 |

### Photo
`InPagePhoto` with `four-cups`.

### Tips (exact)
- "A pint is half a quart, so 2 cups. A gallon is 4 quarts, so 16 cups."
- "The quart line on a large liquid measuring cup is at 4 cups. Use the cup marks for anything in between."
- "A quart is a little smaller than a liter: 946 mL vs 1,000 mL. In a pinch you can swap them in soups, but not in baking."

### FAQ (registry `faq`, exact)
1. Q: "How many cups are in a quart?" A: "4 cups in a US liquid quart. That's the same as 2 pints or 32 fluid ounces."
2. Q: "Is 2 cups a quart?" A: "No. 2 cups is a pint, which is half a quart. You need 4 cups for a full quart."
3. Q: "How many cups are in 2 quarts?" A: "8 cups. Multiply quarts by 4."
4. Q: "How many ounces are in a quart?" A: "32 US fluid ounces. By weight, a quart of water is about 948 g, or 2.09 pounds."
5. Q: "How many cups are in a quart of strawberries?" A: "Berries are sold by the dry quart, which is about 4.65 US cups by volume. That's larger than a liquid quart, so expect a little more than 4 cups of whole berries."
6. Q: "Is a quart bigger than a liter?" A: "No, slightly smaller. A US quart is 946 mL, about 95% of a liter. A liter is about 4.23 US cups."
7. Q: "How many cups are in a gallon?" A: "16 cups. A gallon is 4 quarts, and each quart is 4 cups."

Tests: every chart cell; the three-quart table; the weight table; FAQ numbers (1 L = 4.23 cups; quart/liter = 94.6%, written "about 95%"); tool default outputs.

---

## C. Wiring
- `/converters/` "Which tool do I need?" table, add:
  - "My recipe says 1/3 cup" → Tablespoons in 1/3 cup
  - "I need cups, pints or quarts" → Cups in a quart
- Related lists, keep 4 items each:
  - add `/tablespoons-in-1-3-cup/` to `/tablespoons-in-1-4-cup/` and `/half-a-measurement/`;
  - add `/cups-in-a-quart/` to `/cups-to-grams/` and `/recipe-scaler/`.
- Sitemap should list 27 URLs.
- Schema on both: WebApplication + BreadcrumbList + FAQPage, no rating.

## D. Definition of done
- `npm test` passes, including the new title-length test. Report the count.
- `npm run build` is clean. Lighthouse mobile ≥95 and CLS 0 on both new pages; the 1/8 and 1/4 pages are unchanged.
- No em dashes or banned words.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse for both new pages;
  - the IndexNow status line;
  - any VERIFY value changed, and why.
