# MeasuredCup daily work: 2026-11-09

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit 4306837).

**Today's check:**
- Live: 40 pages in the sitemap.
- Search Console, 7 days to Nov 6: 3.86k impressions (up from 3.3k), average position 51.2.
- Semrush: 1.4k organic keywords (+30%), ChatGPT cites 6 pages (up from 2).

**Two small fixes (section A) and two new pages (section B).**

All rules in `measuredcup-build-spec.md` still apply:
- A5 page order;
- A13 writing rules (no em dashes, no banned words);
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow;
- titles 30–60, descriptions 110–160;
- WebPage node with `datePublished` and `lastUpdated` = `2026-11-09` on new pages; bump `lastUpdated` to `2026-11-09` on the two fixed pages.

| # | Slug | Main keyword (US volume, KD) | Also targets | Why |
|---|---|---|---|---|
| 1 | `/grams-to-teaspoons/` | grams to teaspoons (18,100, KD 30) | 5 grams to teaspoons (4,400, KD 36), how many grams to 1 teaspoon (4,400, KD 39), teaspoon to grams (4,400, KD 40), 10 grams to teaspoons (3,600, KD 27). 4,054 variations, 192k total volume | Positions 3, 4, 6, 7, 8 and 9 have 0–20 referring domains (gramtoteaspoon.com 1, calctypes 20, livelytable 4, gramstocups.io 0, Pinterest, Quora). Ingredient weights per spoon are our data |
| 2 | `/tablespoons-in-3-4-cup/` | how many tablespoons in 3/4 cup (12,100, KD 37) | tablespoons in 3/4 a cup (8,100, KD 35), tablespoons in 3/4 cup (3,600, KD 32), 3/4 cup in tablespoons (3,600, KD 37), tablespoons are in 3/4 cup (2,900, KD 38) | Completes the cup-fraction set. #1 is theharvestkitchen.com with 6 referring domains; the rest of the top 10 has 0–26 (inchcalculator 3, samsungfood 3, study.com 0, Quora, Facebook, Pinterest) |

---

## A. Fixes to existing pages (from Search Console queries, 28 days)

### A1. `/half-a-measurement/` (position 15.7, 1.64k impressions, our only clicks)

The queries are long-tail "half of X" searches, and a group of them is about **teaspoons**, where we rank lower: "what is half of 1 teaspoon" (pos 25.8), "half of 1/2 tsp" (17.2), "half of 1 tsp" (15.5), "half of 1/8 tsp" (24.7). There are also cup queries: "how much is half a cup" (13.5), "half of 1 1/2 cup" (66).

1. **metaDescription** (156, exact): `Half of 3/4 cup is 1/4 cup plus 2 tbsp, and half of 1 tsp is 1/2 tsp. Halve, third or double any cup, tablespoon or teaspoon amount with spoon combinations.`
   Keep the title as it is.
2. **Quick answer:** add one sentence at the end (exact): "Half of 1 teaspoon is 1/2 teaspoon, and half of 1/2 teaspoon is 1/4 teaspoon."
3. **`HALF_THIRD_ROWS`:** add these rows. Keep the existing rows and keep the order from largest to smallest amount.
   - after `1 cup`: `{ amount: '1 1/2 cups', half: '3/4 cup', third: '1/2 cup' }`
   - after `1 tbsp`: `{ amount: '1 1/2 tsp', half: '3/4 tsp', third: '1/2 tsp' }`
   - after `1/2 tsp`: `{ amount: '1/4 tsp', half: '1/8 tsp', third: 'about 2/3 of a 1/8 tsp' }`
   - last row: `{ amount: '1/8 tsp', half: '1/16 tsp (half a 1/8 tsp)', third: 'about 1/3 of a 1/8 tsp' }`

   Check that the tool gives the same answer for each new row. The formula text says it rebuilds "down to 1/8 teaspoon", so check what the tool shows for half of 1/8 tsp. If it shows 0 or something misleading, make it show "1/16 tsp (fill a 1/8 tsp halfway)". Tell me what you changed.
4. **FAQ:** add these 5 after the existing 6 (exact):
   - Q: "What is half of 1 teaspoon?" A: "1/2 teaspoon. A third of 1 teaspoon is a little over 1/4 teaspoon."
   - Q: "What is half of 1/2 teaspoon?" A: "1/4 teaspoon."
   - Q: "What is half of 1/8 teaspoon?" A: "1/16 teaspoon. Fill a 1/8 teaspoon about halfway and level it by eye."
   - Q: "How much is half a cup?" A: "8 tablespoons, which is 4 US fluid ounces or 118.3 mL."
   - Q: "What is half of 1 1/2 cups?" A: "3/4 cup, which is 12 tablespoons."
5. Tests: the new table rows, the new FAQ numbers, and the tool output for half of 1 tsp, 1/2 tsp, 1/8 tsp and 1 1/2 cups.

### A2. `/grams-to-tablespoons/` (position 27, 1.6k impressions)

The head terms ("grams to tablespoons", "grams to tbsp") sit at positions 70 to 76. The pages that rank are for specific amounts: "48 grams of sugar to tablespoons" (pos 10), "2 grams to tbsp" (40), "7 grams to tablespoons" (46), "12 grams to tbsp" (49), "40 grams to tablespoons" (59). Our chart has no rows for 2, 7, 12 or 40 g. We don't make a page per number (A13), so we add the amounts to the chart instead.

1. `G2TBSP_ROWS` becomes `[2, 5, 7, 10, 12, 15, 20, 25, 30, 40, 50, 100]`.

   VERIFY (USDA, `trimDecimal(…, 2)`):

   | Grams | AP flour | Sugar | Butter | Honey | Cocoa |
   |---|---|---|---|---|---|
   | 2 g | 0.26 | 0.16 | 0.14 | 0.09 | 0.37 |
   | 5 g | 0.64 | 0.4 | 0.35 | 0.24 | 0.93 |
   | 7 g | 0.9 | 0.56 | 0.49 | 0.33 | 1.3 |
   | 10 g | 1.28 | 0.8 | 0.7 | 0.47 | 1.86 |
   | 12 g | 1.54 | 0.96 | 0.85 | 0.57 | 2.23 |
   | 15 g | 1.92 | 1.2 | 1.06 | 0.71 | 2.79 |
   | 20 g | 2.56 | 1.6 | 1.41 | 0.94 | 3.72 |
   | 25 g | 3.2 | 2 | 1.76 | 1.18 | 4.65 |
   | 30 g | 3.84 | 2.4 | 2.11 | 1.42 | 5.58 |
   | 40 g | 5.12 | 3.2 | 2.82 | 1.89 | 7.44 |
   | 50 g | 6.4 | 4 | 3.52 | 2.36 | 9.3 |
   | 100 g | 12.8 | 8 | 7.05 | 4.72 | 18.6 |

2. **FAQ:** add these 2 (exact):
   - Q: "How many tablespoons is 15 grams?" A: "It depends on the ingredient: about 1.9 tablespoons of all-purpose flour, 1.2 of sugar or 1.1 of butter (USDA). Only water-like liquids are close to 1 tablespoon."
   - Q: "How many tablespoons is 48 grams of sugar?" A: "About 3.84 tablespoons of granulated sugar, just under 1/4 cup, using USDA's 12.5 g per tablespoon."
3. Add `/grams-to-teaspoons/` to its related list, replacing the last item (`/tablespoons-to-cups/`).
4. Tests: the new rows and the FAQ numbers.

---

## B1. `/grams-to-teaspoons/`

### New tool: `GramsToTeaspoonsTool`

Build it on the same pattern as `GramsToTablespoonsTool`, with a direction toggle.

**Inputs:**
- Direction: pill toggle, **Grams → teaspoons** (default) / **Teaspoons → grams**.
- Amount (default `5`; decimals OK; fractions OK in tsp mode).
- Ingredient (default **Granulated sugar**).
- Data source (default USDA).

**Result card, grams → tsp:**
- Big line: teaspoons = `grams ÷ (grams per cup ÷ 48)`, trimmed to 2 dp. Default: **"1.2 teaspoons"**.
- Line 2: the nearest spoon combination from `toKitchenMeasure`.
- Line 3: "1 tsp of granulated sugar = 4.2 g".

**Result card, tsp → grams:** big line is grams = `tsp × grams per cup ÷ 48`, shown with `formatGrams`. Line 3 is the same.

**"Show the math":** `5 g ÷ 4.17 g per tsp = 1.2 tsp`.

Fire `tool_used` with `{tool:'grams-to-teaspoons'}`.

**Defaults:**
- sugar, 5 g: USDA **1.2 tsp**, King Arthur **1.21 tsp**;
- all-purpose flour, 5 g: USDA **1.92**, King Arthur **2**.

### Registry entry
- title: `Grams to Teaspoons Converter by Ingredient | MeasuredCup` (56)
- metaDescription: `Convert grams to teaspoons and back for 23 ingredients. 5 g of sugar is 1.2 tsp, 5 g of flour 1.9 tsp and 5 g of salt 0.8 tsp, using USDA and King Arthur data.` (159)
- h1: `Grams to Teaspoons Converter`
- kind `tool`, category `converters`, tileLine `Grams to teaspoons and back, 23 ingredients`
- related: `['/grams-to-tablespoons/', '/teaspoons-in-a-tablespoon/', '/tablespoons-to-grams/', '/grams-to-cups/']`
- sources: usda, kingArthur, nist
- photoId: `scale-flour`

### Quick answer (exact)
"Grams to teaspoons depends on the ingredient, because a teaspoon of salt weighs more than twice as much as a teaspoon of flour. Using USDA data, 1 US teaspoon holds about 2.6 g of all-purpose flour, 4.2 g of granulated sugar, 4.7 g of butter, 6.1 g of table salt and 4.9 g of water. Divide your grams by that number. So 5 g of sugar is 1.2 teaspoons."

### How to use (exact)
1. Type the weight in grams, or switch to teaspoons to go the other way.
2. Choose the ingredient. Sugar, flour and salt all weigh differently per spoon.
3. Leave the source on USDA, or switch to King Arthur for their recipes.
4. Read the teaspoons, then the spoon combination to measure with.

### The formula and two worked examples (exact)
Formula box: `teaspoons = grams ÷ (grams per cup ÷ 48)` and `grams = teaspoons × grams per cup ÷ 48`

- "10 g of sugar. 200 ÷ 48 = 4.17 g per teaspoon. 10 ÷ 4.17 = 2.4 teaspoons, so 2 teaspoons plus a scant 1/2 teaspoon."
- "1 teaspoon of table salt. 292 ÷ 48 = 6.08 g. That's why recipes that list salt in grams use small numbers."

### Section: "Is 1 teaspoon 5 grams?" (exact)
"Only for water-like liquids. A US teaspoon holds 4.93 mL, so a teaspoon of water weighs about 4.9 g, close to 5. Flour weighs about half that, and honey about 7 g. The 5 g figure is a good guess for liquids and a poor one for dry ingredients."

### What this tool doesn't cover (exact)
"It assumes level US measuring spoons (4.93 mL per teaspoon). Heaped spoons can hold half as much again. It covers the 23 ingredients in our dataset only, so baking powder, yeast and spices aren't included yet. Kosher salt is lighter per spoon than table salt."

### Reference tables
Table 1, caption "Grams to teaspoons (USDA)": columns Grams | All-purpose flour | Granulated sugar | Butter | Honey | Cocoa | Table salt. Values = `grams ÷ (g per cup ÷ 48)`, `trimDecimal(…, 2)`.

VERIFY:

| Grams | AP flour | Sugar | Butter | Honey | Cocoa | Salt |
|---|---|---|---|---|---|---|
| 1 g | 0.38 | 0.24 | 0.21 | 0.14 | 0.56 | 0.16 |
| 2 g | 0.77 | 0.48 | 0.42 | 0.28 | 1.12 | 0.33 |
| 3 g | 1.15 | 0.72 | 0.63 | 0.42 | 1.67 | 0.49 |
| 4 g | 1.54 | 0.96 | 0.85 | 0.57 | 2.23 | 0.66 |
| 5 g | 1.92 | 1.2 | 1.06 | 0.71 | 2.79 | 0.82 |
| 10 g | 3.84 | 2.4 | 2.11 | 1.42 | 5.58 | 1.64 |
| 15 g | 5.76 | 3.6 | 3.17 | 2.12 | 8.37 | 2.47 |
| 20 g | 7.68 | 4.8 | 4.23 | 2.83 | 11.16 | 3.29 |
| 25 g | 9.6 | 6 | 5.29 | 3.54 | 13.95 | 4.11 |
| 50 g | 19.2 | 12 | 10.57 | 7.08 | 27.91 | 8.22 |

Table 2, caption "Teaspoons to grams (USDA)": columns Teaspoons | the same 6 ingredients. Values = `gramsCell(tsp × g per cup ÷ 48)`.

VERIFY:

| Tsp | AP flour | Sugar | Butter | Honey | Cocoa | Salt |
|---|---|---|---|---|---|---|
| 1/4 | 0.7 | 1.0 | 1.2 | 1.8 | 0.4 | 1.5 |
| 1/2 | 1.3 | 2.1 | 2.4 | 3.5 | 0.9 | 3.0 |
| 1 | 2.6 | 4.2 | 4.7 | 7.1 | 1.8 | 6.1 |
| 2 | 5.2 | 8.3 | 9.5 | 14.1 | 3.6 | 12.2 |
| 3 (1 tbsp) | 7.8 | 12.5 | 14.2 | 21.2 | 5.4 | 18.3 |

Table 3, caption "Grams in 1 teaspoon, by ingredient": all 23 ingredients, columns Ingredient | USDA | King Arthur. Values = `gramsCell(g per cup ÷ 48)`.

VERIFY:

| Ingredient | USDA | KA |
|---|---|---|
| All-purpose flour | 2.6 | 2.5 |
| Bread flour | 2.9 | 2.5 |
| Cake flour | 2.9 | 2.5 |
| Whole wheat flour | 2.5 | - |
| Granulated sugar | 4.2 | 4.1 |
| Brown sugar (packed) | 4.6 | 4.4 |
| Powdered sugar (unsifted) | 2.5 | 2.4 |
| Butter | 4.7 | 4.7 |
| Honey | 7.1 | 7.0 |
| Maple syrup | 6.6 | 6.5 |
| Whole milk | 5.1 | 4.7 |
| Water | 4.9 | - |
| Vegetable oil | 4.5 | 4.1 |
| Heavy cream | 5.0 | 4.7 |
| Sour cream | 4.8 | 4.7 |
| Plain whole-milk yogurt | 5.1 | - |
| Unsweetened cocoa powder | 1.8 | 1.8 |
| Rolled oats | 1.7 | 1.9 |
| Long-grain white rice (uncooked) | 3.9 | 4.1 |
| Cornstarch | 2.7 | 2.3 |
| Peanut butter | 5.4 | 5.6 |
| Semisweet chocolate chips | 3.5 | 3.5 |
| Table salt | 6.1 | 6.0 |

### Photo
`InPagePhoto` with `scale-flour`.

### Tips (exact)
- "Under 5 g, a scale that reads in 0.1 g steps beats any spoon. Most kitchen scales only read whole grams."
- "Level dry ingredients with a knife. A heaped teaspoon can hold half as much again."
- "Salt brands differ a lot. Kosher salt flakes weigh less per spoon than fine table salt, so weigh it when you can."

### FAQ (registry `faq`, exact)
1. Q: "How many grams are in a teaspoon?" A: "It depends on the ingredient: about 4.9 g of water, 4.2 g of sugar, 2.6 g of flour and 6.1 g of table salt (USDA FoodData Central)."
2. Q: "How many teaspoons is 5 grams?" A: "About 1.2 teaspoons of sugar, 1.9 of all-purpose flour, 0.8 of table salt, or 1 for water."
3. Q: "How many teaspoons is 10 grams of sugar?" A: "2.4 teaspoons, using USDA's 4.17 g per teaspoon."
4. Q: "Is 1 teaspoon 5 grams?" A: "Only for water-like liquids, at about 4.9 g. Sugar is about 4.2 g and flour about 2.6 g."
5. Q: "How many grams is 1 teaspoon of salt?" A: "About 6.1 g of table salt using USDA, or 6 g using King Arthur."
6. Q: "How do I convert teaspoons to grams?" A: "Multiply the teaspoons by the grams in one teaspoon of that ingredient. For sugar, 2 teaspoons × 4.17 g = 8.3 g."

Tests:
- all three tables;
- the tool defaults in both directions;
- the FAQ numbers. 5 g of water = 5 ÷ 4.94 = 1.01, written "1".

---

## B2. `/tablespoons-in-3-4-cup/`

Build it on `CupFractionTool` / `CupFractionTable` with `fraction = 3/4`.
- Extend `cupFractionLabel` with `3/4`.
- In `cupFractionEquivalents`, add a 3/4 branch.
- The 1/8, 1/4, 1/3, 1/2 and 2/3 pages must render exactly as now.

### Registry entry
- title: `How Many Tablespoons in 3/4 Cup? Plus Grams | MeasuredCup` (57)
- metaDescription: `3/4 cup is 12 tablespoons (36 teaspoons, 6 fl oz, 177.4 mL). See what 3/4 cup of flour, sugar, butter, milk and 19 more ingredients weighs in grams.` (148)
- h1: `How Many Tablespoons in 3/4 Cup?`
- kind `tool`, category `converters`, tileLine `12 tbsp, plus grams for 23 ingredients`
- related: `['/tablespoons-in-2-3-cup/', '/tablespoons-in-1-2-cup/', '/half-a-measurement/', '/cups-to-grams/']`
- sources: nist, usda, kingArthur
- photoId: `four-cups`

### Quick answer (exact)
"3/4 cup is 12 tablespoons, which is 36 teaspoons, 6 US fluid ounces or 177.4 mL. By weight it depends on the ingredient: 3/4 cup of all-purpose flour is about 93.8 g, granulated sugar 150 g and butter 170 g (USDA FoodData Central)."

### Tool
`CupFractionTool fraction={3/4}`.

Result card:
- big number = grams in 3/4 cup;
- line 2 = "12 tbsp · 36 tsp · 6 fl oz · 177.4 mL";
- line 3 = "Per tablespoon: X g".

Default: All-purpose flour, USDA → **93.8 g**; King Arthur → **90.0 g**. "Show the math": `125 × 3 ÷ 4 = 93.8 g`.

"Need a different amount?" links to `/tablespoons-in-2-3-cup/` and `/cups-to-grams/`.

### How to use (exact)
1. Pick the ingredient.
2. Choose USDA, or King Arthur if your recipe comes from their kitchen.
3. Read the grams in 3/4 cup, or use a 1/2 cup plus a 1/4 cup.

### The formula and two worked examples (exact)
Formula box: `3/4 cup = 16 × 3 ÷ 4 = 12 tablespoons` and `grams in 3/4 cup = grams per cup × 3 ÷ 4`

- "Why 12: a cup is 16 tablespoons, and three quarters of 16 is 12. No teaspoons left over, unlike 1/3 and 2/3 cup."
- "Whole milk. 244 g per cup × 3 ÷ 4 = 183 g. That matches what the cups to grams converter gives for 3/4 cup."

### Section: "How to measure 3/4 cup without a 3/4 cup measure" (exact)
"No 3/4 cup? Use any of these:"
- "A 1/2 cup plus a 1/4 cup. The easiest swap."
- "Three level 1/4 cup scoops."
- "12 level tablespoons."
- "For liquids, the 6 fl oz line on a measuring cup."
- "For butter, 1 1/2 US sticks."

### What this tool doesn't cover (exact)
"It covers US measures only. A UK or Australian 3/4 metric cup is 187.5 mL, a bit more than the US 177.4 mL. Weights assume level, spooned measures and typical US products, so packing and brands change them a little."

### Reference tables
Table 1, caption "3/4 cup equivalents (US)":
- Tablespoons | 12
- Teaspoons | 36
- Fluid ounces | 6
- Milliliters | 177.4
- Cups (decimal) | 0.75
- Half of 3/4 cup | 1/4 cup + 2 tbsp (6 tbsp)
- Double 3/4 cup | 1 1/2 cups
- Butter | 12 tbsp, 1 1/2 sticks

Table 2, caption "3/4 cup in grams by ingredient": all 23 ingredients, same columns as the 2/3 cup page.

VERIFY (`gramsCell`):

| Ingredient | USDA | KA | per tbsp |
|---|---|---|---|
| All-purpose flour | 93.8 | 90.0 | 7.8 |
| Bread flour | 103 | 90.0 | 8.6 |
| Cake flour | 103 | 90.0 | 8.6 |
| Whole wheat flour | 90.0 | - | 7.5 |
| Granulated sugar | 150 | 149 | 12.5 |
| Brown sugar (packed) | 165 | 160 | 13.8 |
| Powdered sugar | 90.0 | 84.8 | 7.5 |
| Butter | 170 | 170 | 14.2 |
| Honey | 254 | 252 | 21.2 |
| Maple syrup | 236 | 234 | 19.7 |
| Whole milk | 183 | 170 | 15.3 |
| Water | 178 | - | 14.8 |
| Vegetable oil | 164 | 149 | 13.6 |
| Heavy cream | 179 | 170 | 14.9 |
| Sour cream | 173 | 170 | 14.4 |
| Yogurt | 184 | - | 15.3 |
| Cocoa | 64.5 | 63.0 | 5.4 |
| Rolled oats | 60.8 | 66.8 | 5.1 |
| Rice | 139 | 149 | 11.6 |
| Cornstarch | 96.0 | 84.0 | 8.0 |
| Peanut butter | 194 | 203 | 16.1 |
| Chocolate chips | 126 | 128 | 10.5 |
| Table salt | 219 | 216 | 18.3 |

### Photo
`InPagePhoto` with `four-cups`.

### Tips (exact)
- "3/4 cup is a 1/2 cup plus a 1/4 cup. Most sets don't include a 3/4 cup, so this is the usual way."
- "For butter, 3/4 cup is 1 1/2 sticks, about 170 g."
- "Halving a recipe that calls for 3/4 cup gives 1/4 cup plus 2 tablespoons."

### FAQ (registry `faq`, exact)
1. Q: "How many tablespoons are in 3/4 cup?" A: "12 tablespoons, which is 36 teaspoons or 6 US fluid ounces."
2. Q: "How many tablespoons of butter is 3/4 cup?" A: "12 tablespoons, or 1 1/2 US sticks. By weight that's about 170 g."
3. Q: "How many 1/4 cups make 3/4 cup?" A: "Three level 1/4 cups."
4. Q: "How many grams is 3/4 cup of flour?" A: "About 93.8 g of all-purpose flour using USDA's 125 g per cup, or 90 g using King Arthur's 120 g per cup."
5. Q: "How many grams is 3/4 cup of sugar?" A: "About 150 g of granulated sugar using USDA's 200 g per cup. Packed brown sugar is about 165 g."
6. Q: "What is half of 3/4 cup?" A: "1/4 cup plus 2 tablespoons, which is 6 tablespoons."

Tests:
- every VERIFY value and FAQ number;
- `cupFractionLabel(3/4) === '3/4'`;
- the existing cup-fraction pages are unchanged (snapshot or existing tests).

---

## C. Wiring
- `/converters/` "Which tool do I need?" table, add:
  - "I have grams and want teaspoons, or the other way" → Grams to teaspoons
  - "My recipe says 3/4 cup and I want spoons or grams" → Tablespoons in 3/4 cup
- Related lists, 4 items each, each replacing that list's last item:
  - add `/grams-to-teaspoons/` to `/grams-to-tablespoons/` (see A2) and `/teaspoons-in-a-tablespoon/`;
  - add `/tablespoons-in-3-4-cup/` to `/tablespoons-in-1-2-cup/` and `/tablespoons-in-2-3-cup/`.
- `/ounces-in-a-cup/` "Cups to fluid ounces" chart: link the 3/4 cup row to the new page, if the table supports row links. Skip this if it doesn't.
- Sitemap should list **42** URLs.
- Schema on both: WebPage + WebApplication + BreadcrumbList + FAQPage, no rating.

## D. Definition of done
- `npm test` passes. Report the count.
- `npm run build` is clean. Lighthouse mobile ≥95 and CLS 0 on both new pages.
- No em dashes or banned words.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse for both new pages;
  - the IndexNow status line;
  - any VERIFY value changed, and why;
  - what, if anything, you changed in the half-a-measurement tool for 1/8 tsp.
