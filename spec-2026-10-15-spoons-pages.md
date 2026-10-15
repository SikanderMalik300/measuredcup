# MeasuredCup daily pages: 2026-10-15

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main.

Today's pages, both in the Spoons cluster:

| # | Slug | Main keyword | US vol | KD | Why now |
|---|---|---|---|---|---|
| 1 | `/tablespoons-to-cups/` | tablespoons to cups | 33,100 | 34 | gramstocups.io (DA 10, 0 ref domains) ranks #4 and tbsptocups.com (DA 5) is on page 1 |
| 2 | `/tablespoons-in-1-8-cup/` | how many tablespoons in 1/8 cup | 18,100 | 9 | Page 1 is Reddit, Quora, YouTube and thin answer pages. "People also search for" asks for flour, sugar, oil, grams and teaspoons, which no ranking page answers |

Every rule in `measuredcup-build-spec.md` still applies:
- A5 tool page order;
- A13 writing rules (no em dashes, no banned words);
- A14 Definition of done;
- the design system.

Reuse the existing components (`ToolPageFrame`, `QuickAnswer`, `Section`, `Steps`, `Formula`, `Prose`, `Tips`, `InPagePhoto`, `AdSlot`, tool `ui.tsx`) and the registry in `lib/data/pages.ts`. Sitemap, hubs, related links, breadcrumbs, llms.txt and IndexNow all pick the pages up from the registry.

Do NOT create number-variant pages (no `/6-tablespoons-to-cups/` etc.). The chart and the tool cover those.

---

## 1. Shared calc: `fewestScoops` (new, `lib/calc/kitchen.ts`)

`fewestScoops(totalTsp: number): string` returns the way to measure an amount with standard US tools using the fewest scoops.

- Tools available:
  - whole cups;
  - one cup fraction from {3/4, 2/3, 1/2, 1/3, 1/4, 1/8};
  - tablespoons;
  - teaspoons.
- Algorithm:
  1. Take whole cups first (48 tsp each).
  2. For the remainder, try "no fraction" and each fraction that fits.
  3. Fill what's left with tablespoons (3 tsp), then teaspoons.
- Scoop count = whole cups + (1 if a fraction is used) + number of tablespoons + number of whole teaspoons.
- Pick the option with the lowest scoop count. On a tie, prefer the option WITHOUT a third (1/3 or 2/3). On a further tie, prefer the larger cup fraction.
- If the teaspoon leftover is not a whole number, round it to the nearest 1/8 tsp, write it as 1/2, 1/4 or 1/8 tsp parts, and prefix "about " unless the amount was exact.
- Output format examples: `1/8 cup + 1 tbsp`, `2/3 cup + 1 tsp`, `1 1/2 cups`, `1 cup`, `1 tbsp`.

Tests (exact strings; input = tablespoons × 3):

| tbsp | cups (4 dp) | fewestScoops | mL (1 dp) | fl oz |
|---|---|---|---|---|
| 1 | 0.0625 | 1 tbsp | 14.8 | 0.5 |
| 2 | 0.1250 | 1/8 cup | 29.6 | 1 |
| 3 | 0.1875 | 1/8 cup + 1 tbsp | 44.4 | 1.5 |
| 4 | 0.2500 | 1/4 cup | 59.1 | 2 |
| 5 | 0.3125 | 1/4 cup + 1 tbsp | 73.9 | 2.5 |
| 6 | 0.3750 | 1/4 cup + 2 tbsp | 88.7 | 3 |
| 7 | 0.4375 | 1/4 cup + 3 tbsp | 103.5 | 3.5 |
| 8 | 0.5000 | 1/2 cup | 118.3 | 4 |
| 9 | 0.5625 | 1/2 cup + 1 tbsp | 133.1 | 4.5 |
| 10 | 0.6250 | 1/2 cup + 2 tbsp | 147.9 | 5 |
| 11 | 0.6875 | 2/3 cup + 1 tsp | 162.7 | 5.5 |
| 12 | 0.7500 | 3/4 cup | 177.4 | 6 |
| 13 | 0.8125 | 3/4 cup + 1 tbsp | 192.2 | 6.5 |
| 14 | 0.8750 | 3/4 cup + 2 tbsp | 207.0 | 7 |
| 15 | 0.9375 | 3/4 cup + 3 tbsp | 221.8 | 7.5 |
| 16 | 1.0000 | 1 cup | 236.6 | 8 |
| 20 | 1.2500 | 1 1/4 cups | 295.7 | 10 |
| 24 | 1.5000 | 1 1/2 cups | 354.9 | 12 |
| 32 | 2.0000 | 2 cups | 473.2 | 16 |

Extra tests:
- 16 tsp (5 tbsp + 1 tsp) = `1/3 cup`;
- 1 tsp = `1 tsp`;
- 2.5 tbsp (7.5 tsp) = `1/8 cup + 1 1/2 tsp`. That's 3 scoops (1/8 cup, 1 tsp, 1/2 tsp), which beats `2 tbsp + 1 1/2 tsp` at 4 scoops.

Scoop count detail: each part-teaspoon spoon (1/2, 1/4, 1/8 tsp) counts as one scoop, so 1 1/2 tsp = 2 scoops.

Constants: use `TBSP_PER_CUP`, `ML_PER_TBSP`, `ML_PER_FL_OZ` from `lib/data/constants.ts`. 1 tbsp = 1/2 fl oz exactly.

---

## 2. Page 1: `/tablespoons-to-cups/`

### Registry entry (`lib/data/pages.ts`)
- title: `Tablespoons to Cups Converter (Chart + Fractions) | MeasuredCup`
- metaDescription: `16 tablespoons make 1 cup. Convert tablespoons to cups with real measuring-cup answers like 1/2 cup + 2 tbsp, plus mL, fluid ounces and grams by ingredient.`
- h1: `Tablespoons to Cups Converter`
- kind `tool`, category `converters`, tileLine `16 tbsp = 1 cup, with a full chart`
- related: `['/tablespoons-in-1-8-cup/', '/tablespoons-to-grams/', '/half-a-measurement/', '/cups-to-grams/']`
- sources: nist, usda, kingArthur
- photoId: `copper-cups-paper`
- lastUpdated `2026-10-15`

### Quick answer (exact)
"There are 16 tablespoons in 1 US cup, so divide tablespoons by 16 to get cups. 4 tablespoons is 1/4 cup, 8 is 1/2 cup and 12 is 3/4 cup. Amounts in between are easiest as a cup plus spoons: 10 tablespoons is 1/2 cup + 2 tbsp."

### Tool: `TablespoonsToCupsTool`
Inputs:
- **Amount:** text, accepts fractions like `2 1/2`, via `parseAmount`. Default `10`.
- **Unit:** segmented control, Tablespoons | Teaspoons. Default Tablespoons.
- **Ingredient (optional, for grams):** grouped native select, same as other tools, with an extra first option "Volume only" (default).
- **Data source:** USDA | King Arthur. Show only when an ingredient is chosen.

Result card:
- big number = cups to 4 decimal places, trimmed (`0.625` cups);
- line 2 = `fewestScoops` ("1/2 cup + 2 tbsp");
- line 3 = `147.9 mL · 5 fl oz`;
- line 4, only when an ingredient is chosen: grams = cups × gramsPerCup, whole grams at 100 g and above, otherwise 1 decimal. Example: butter, 10 tbsp → "142 g butter (USDA)".

"Show the math" text: `10 ÷ 16 = 0.625 cups`. For teaspoons: `30 ÷ 48 = 0.625 cups`.

Default example in the HTML: 10 tbsp → 0.625 cups, 1/2 cup + 2 tbsp, 147.9 mL, 5 fl oz.

Fire `tool_used` with `{tool:'tablespoons-to-cups'}` (same pattern as the other tools).

### How to use (steps, exact)
1. Type the number of tablespoons. Fractions like 2 1/2 work.
2. Switch to teaspoons if your recipe lists those.
3. Read the cups, then the cup-and-spoon combination to measure with.
4. Pick an ingredient if you'd rather weigh it in grams.

### The formula and two worked examples (exact)
Formula box: `cups = tablespoons ÷ 16` and `cups = teaspoons ÷ 48`

- "6 tablespoons. 6 ÷ 16 = 0.375 cups. That's 1/4 cup + 2 tbsp, which is 3/8 cup. It isn't 1/4 cup, a common mix-up: 1/4 cup is 4 tablespoons."
- "11 tablespoons. 11 ÷ 16 = 0.6875 cups. The closest single cup is 2/3 cup, which is 10 tablespoons + 2 teaspoons, so measure 2/3 cup + 1 tsp."

### What this tool doesn't cover (exact)
"It uses US measuring spoons and cups (1 tablespoon = 14.8 mL, 1 cup = 236.6 mL). Australian tablespoons are 20 mL, so 4 Australian tablespoons are 80 mL, not 1/4 cup. Dinner spoons aren't measuring spoons and can hold anywhere from 7 mL to 14 mL. Gram results are averages; a heaped spoon or packed cup weighs more."

### Reference tables
Table 1, caption "Tablespoons to cups chart (US)": columns Tablespoons | Cups (decimal) | Measure with | mL | Fluid ounces. Rows = the 19 rows in section 1, generated from the calc functions, not hard-coded.

Table 2, caption "Common spoon amounts in grams (USDA)": rows 2, 4, 6, 8, 10, 12 tbsp; columns All-purpose flour, Granulated sugar, Butter, Vegetable oil. Grams = tbsp × gramsPerCup ÷ 16, same rounding as above.

VERIFY:
- 4 tbsp: flour 31.3, sugar 50.0, butter 56.8, oil 54.5
- 10 tbsp: flour 78.1, sugar 125, butter 142, oil 136
- 12 tbsp: flour 93.8, sugar 150, butter 170, oil 164

### Photo
`InPagePhoto` with `copper-cups-paper`, placed between tables and tips per the design spec.

### Tips (exact)
- "Count tablespoons into a liquid measuring cup only for liquids. For flour and sugar, use dry cups and level them."
- "Five tablespoons plus one teaspoon is exactly 1/3 cup. That's handy when your 1/3 cup is in the dishwasher."
- "A stick of butter is 8 tablespoons, or 1/2 cup. The tablespoon marks on the wrapper are the fastest way to cut it."

### FAQ (registry `faq`, exact)
1. Q: "How many tablespoons are in a cup?" A: "16. That holds for any ingredient, because both are volume measures. Half a cup is 8 tablespoons and a quarter cup is 4."
2. Q: "Does 6 tablespoons equal 1/4 cup?" A: "No. 1/4 cup is 4 tablespoons. 6 tablespoons is 3/8 cup, which you can measure as 1/4 cup + 2 tbsp."
3. Q: "How many cups is 10 tablespoons?" A: "0.625 cups, or 1/2 cup + 2 tbsp. In grams that's about 78 g of all-purpose flour, 125 g of sugar or 142 g of butter."
4. Q: "How many tablespoons are in 1/3 cup?" A: "5 tablespoons plus 1 teaspoon. A third of a cup doesn't divide evenly into tablespoons."
5. Q: "How many tablespoons of butter make a cup?" A: "16 tablespoons, which is 2 US sticks or 227 g."
6. Q: "Is a tablespoon the same as a fluid ounce?" A: "No. A tablespoon is half a fluid ounce. 2 tablespoons make 1 fluid ounce, and 16 tablespoons make 8 fluid ounces, which is 1 cup."

Tests for the FAQ numbers (10 tbsp flour 78.1, sugar 125, butter 142) and Table 2 cells.

---

## 3. Page 2: `/tablespoons-in-1-8-cup/`

### Registry entry
- title: `How Many Tablespoons in 1/8 Cup? (2 tbsp, Plus Grams) | MeasuredCup`
- metaDescription: `1/8 cup is 2 tablespoons, 6 teaspoons or 1 fluid ounce (29.6 mL). See what 1/8 cup of flour, sugar, butter, oil and 19 more ingredients weighs in grams.`
- h1: `How Many Tablespoons in 1/8 Cup?`
- kind `tool`, category `converters`, tileLine `2 tbsp, plus grams for 23 ingredients`
- related: `['/tablespoons-to-cups/', '/tablespoons-to-grams/', '/half-a-measurement/', '/butter-converter/']`
- sources: nist, usda, kingArthur
- photoId: `four-cups`
- lastUpdated `2026-10-15`

### Quick answer (exact)
"1/8 cup is 2 tablespoons. That's also 6 teaspoons, 1 US fluid ounce or 29.6 mL. By weight it depends on the ingredient: 1/8 cup of all-purpose flour is about 15.6 g, granulated sugar 25 g and butter 28.4 g (USDA FoodData Central)."

### Tool: `EighthCupTool` (small)
Inputs:
- **Ingredient:** grouped select. Default All-purpose flour.
- **Data source:** USDA | King Arthur.

Result card:
- big number = grams in 1/8 cup (gramsPerCup ÷ 8, 1 decimal below 100 g);
- line 2 = "2 tbsp · 6 tsp · 1 fl oz · 29.6 mL";
- line 3 = "Per tablespoon: X g" (gramsPerCup ÷ 16, 1 decimal).

Default HTML result: 15.6 g flour (USDA). With King Arthur selected: 15.0 g.

"Show the math": `125 ÷ 8 = 15.6 g`.

Under the card, a "Need a different amount?" line linking to `/tablespoons-to-cups/` and `/tablespoons-to-grams/`.

### How to use (steps, exact)
1. Pick the ingredient.
2. Choose USDA, or King Arthur if your recipe comes from their kitchen.
3. Read the grams in 1/8 cup, or just use 2 level tablespoons.

### The formula and two worked examples (exact)
Formula box: `1/8 cup = 16 ÷ 8 = 2 tablespoons` and `grams in 1/8 cup = grams per cup ÷ 8`

- "Granulated sugar. 200 g per cup ÷ 8 = 25 g. So 2 level tablespoons of sugar weigh about 25 g."
- "Honey. 339 g per cup ÷ 8 = 42.4 g. Honey weighs nearly three times as much as the same spoonful of flour, which is why sticky ingredients are worth weighing."

### Section: "How to measure 1/8 cup without a 1/8 cup measure" (new section, after the formula; exact)
"Most US measuring cup sets stop at 1/4 cup, so use spoons instead:"
- "2 level tablespoons, the most accurate option."
- "6 level teaspoons, if your tablespoon is missing."
- "Half of a 1/4 cup. Fill the 1/4 cup and pour off half by eye. Fine for liquids, less exact for flour."
- "The 1 fl oz line on a liquid measuring cup or a shot glass marked in ounces, for liquids only."
- "A coffee scoop, if yours is marked 2 tablespoons. Many are, but sizes vary, so check before you rely on it."

### What this tool doesn't cover (exact)
"It covers US measures only. A UK or Australian 1/8 metric cup is 31.25 mL, slightly more than the US 29.6 mL. Weights assume level spoons and typical US products, so brands and packing change them a little."

### Reference tables
Table 1, caption "1/8 cup equivalents (US)", two columns, rows:
- Tablespoons | 2
- Teaspoons | 6
- Fluid ounces | 1
- Milliliters | 29.6
- Cups (decimal) | 0.125
- Half of 1/8 cup | 1 tbsp
- Double 1/8 cup | 1/4 cup

Table 2, caption "1/8 cup in grams by ingredient": all 23 ingredients from `ingredients.ts`, columns Ingredient | USDA (g) | King Arthur (g, "-" if null) | Per tablespoon, USDA (g). Generated, sortable like the data page table.

VERIFY (USDA ÷ 8):
- flour 15.6, bread flour 17.1, sugar 25.0, brown sugar 27.5, powdered sugar 15.0;
- butter 28.4, honey 42.4, maple syrup 39.4, milk 30.5, water 29.6, vegetable oil 27.3;
- heavy cream 29.8, sour cream 28.8, yogurt 30.6, cocoa 10.8, oats 10.1, rice 23.1;
- cornstarch 16.0, peanut butter 32.3, chocolate chips 21.0, salt 36.5.

King Arthur ÷ 8: flour 15.0, sugar 24.8, butter 28.3, oil 24.8.

### Photo
`InPagePhoto` with `four-cups`.

### Tips (exact)
- "For butter, 1/8 cup is a quarter of a stick: 2 tablespoon marks on the wrapper."
- "Spoon flour into the tablespoon and level it with a knife. Scooping packs it and adds up to 20%."
- "For oil and other liquids, a 1 fl oz shot glass with a line is quicker than two spoons."

### FAQ (registry `faq`, exact)
1. Q: "Is 2 tablespoons 1/8 of a cup?" A: "Yes. A US cup holds 16 tablespoons, so 1/8 cup is exactly 2 tablespoons."
2. Q: "How many teaspoons are in 1/8 cup?" A: "6 teaspoons. There are 3 teaspoons in a tablespoon, and 1/8 cup is 2 tablespoons."
3. Q: "How many grams is 1/8 cup of flour?" A: "About 15.6 g of all-purpose flour using USDA's 125 g per cup, or 15 g using King Arthur's 120 g per cup."
4. Q: "How many grams is 1/8 cup of sugar?" A: "25 g of granulated sugar using USDA's 200 g per cup. Packed brown sugar is about 27.5 g."
5. Q: "How much is 1/8 cup of oil?" A: "2 tablespoons, 1 fluid ounce or 29.6 mL. Vegetable oil weighs about 27.3 g at that volume."
6. Q: "What is half of 1/8 cup?" A: "1 tablespoon, which is 3 teaspoons or 1/2 fluid ounce."

Tests for every VERIFY value and every FAQ number.

---

## 4. Wiring

- Add both pages to the `/converters/` hub "Which tool do I need?" table:
  - "I have tablespoons and need cups" → Tablespoons to cups
  - "My recipe says 1/8 cup" → Tablespoons in 1/8 cup
- Add `/tablespoons-to-cups/` to the related lists of `/tablespoons-to-grams/` and `/half-a-measurement/`. Keep each list at 4 items; replace the weakest match.
- Home page: no change today.
- Sitemap, llms.txt and IndexNow update from the registry. Confirm both URLs appear in `out/sitemap.xml`.
- Schema:
  - `WebApplication` + `BreadcrumbList` + `FAQPage` on both, same as the other tool pages.
  - Page 2 must not claim a rating.

## 5. Definition of done (today)

- `npm test` passes, including every table and VERIFY value above. Report the count.
- `npm run build` is clean. Lighthouse mobile is at least 95 on both new pages, with CLS 0.
- No em dashes or banned words in the new copy.
- Push to main. Reply with:
  - the commit hash;
  - the IndexNow status line;
  - Lighthouse scores for both pages;
  - any VERIFY value you had to change, with the reason.
