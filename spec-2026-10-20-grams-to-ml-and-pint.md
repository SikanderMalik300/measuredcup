# MeasuredCup daily work: 2026-10-20

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit ff9391d).

Today's audit: all 29 pages return 200, with 0 broken links, 0 orphans, 0 title or description issues. **No fixes today.** Two new pages.

All rules in `measuredcup-build-spec.md` still apply:
- A5 page order;
- A13 writing rules (no em dashes, no banned words);
- design system;
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow;
- titles ≤60 (test guard).

No number-variant pages.

| # | Slug | Main keyword | Why |
|---|---|---|---|
| 1 | `/grams-to-ml/` | grams to ml (14,800, KD 23) | Calculator sites lead (DA 45-68), but microapp.io (DA 21) and stocksmith.io (DA 31) are on page 1. "People also search for" asks for grams to mL of flour, milk, cream, powder and water: exactly our per-ingredient density data |
| 2 | `/cups-in-a-pint/` | how many cups in a pint | Same weak mix as the quart and gallon pages: blogs DA 33-59, CK-12, Quora, YouTube. Searchers ask about pints of rice, ice cream, mayo and sugar, and berries come in dry pints. It reuses `LiquidVolumeTool` |

---

## B1. `/grams-to-ml/`

### Calc
`gramsToMl(grams, ingredientId, source) = grams ÷ gramsPerCup × ML_PER_CUP`.

Density for display = `gramsPerCup ÷ ML_PER_CUP`, 3 dp.

mL display:
- 1 decimal under 1,000;
- whole with a thousands comma at 1,000 and above.

### Tool: `GramsToMlTool`
Inputs:
- **Grams:** decimal. Default `100`.
- **Ingredient:** grouped select. Default All-purpose flour.
- **Data source:** USDA | King Arthur.

Result card:
- big number = mL (**189.3 mL** default; King Arthur **197.2 mL**);
- line 2 = cups `trimDecimal(x, 2)` + `toKitchenMeasure` ("0.8 cups · 3/4 cup + 2 1/2 tsp", using the existing function output);
- line 3 = "Density: 0.528 g per mL".

"Show the math": `100 ÷ 125 × 236.6 = 189.3 mL`. Fire `tool_used` `{tool:'grams-to-ml'}`.

### Registry entry
- title: `Grams to mL Converter by Ingredient | MeasuredCup` (49)
- metaDescription: `Convert grams to milliliters for flour, sugar, butter, milk, honey and 18 more ingredients. 100 g of flour is about 189 mL, but 100 g of honey is only 70 mL.`
- h1: `Grams to mL Converter`
- kind `tool`, category `converters`, tileLine `Grams to milliliters for 23 ingredients`
- related: `['/grams-to-cups/', '/grams-to-tablespoons/', '/cups-to-grams/', '/data/ingredient-weights/']`
- sources: usda, kingArthur, nist
- photoId: `scale-brown-sugar`
- lastUpdated `2026-10-20`

### Quick answer (exact)
"Grams to mL is only 1 to 1 for water. Everything else depends on density: 100 g of all-purpose flour takes up about 189 mL, 100 g of sugar about 118 mL, 100 g of milk 97 mL and 100 g of honey just 70 mL (USDA FoodData Central). Pick the ingredient to get the right answer."

### How to use (exact)
1. Type the weight in grams.
2. Choose the ingredient. Light, fluffy ingredients take up much more space per gram.
3. Leave the source on USDA, or switch to King Arthur for their recipes.
4. Read the milliliters, plus the same amount in US cups.

### The formula and two worked examples (exact)
Formula box: `mL = grams ÷ density (g per mL)` and `density = grams per cup ÷ 236.6`

- "250 g of all-purpose flour. Density 125 ÷ 236.6 = 0.528 g per mL. 250 ÷ 0.528 = 473.2 mL, which is exactly 2 US cups."
- "50 g of honey. Density 339 ÷ 236.6 = 1.433 g per mL. 50 ÷ 1.433 = 34.9 mL, under 2 1/2 tablespoons."

### Section: "Why water is almost exactly 1 g per mL" (new section, after the formula; exact)
"A gram was originally defined as the mass of 1 mL of water, so for water and drinks that are mostly water, grams and milliliters match. The USDA figure of 237 g per cup works out to 1.002 g per mL, which is within rounding. Milk and cream are a touch heavier than water, oil is lighter, and dry ingredients like flour and cocoa are far lighter because of the air between the grains."

### What this tool doesn't cover (exact)
"Densities are averages for typical US products, measured the way a cup is filled. Sifted flour is lighter, packed brown sugar heavier. Powders not in our list, like protein powder, baking powder or spices, need their own density. It uses US milliliters and cups."

### Reference tables
Table 1, caption "Grams to mL by ingredient (USDA)": rows 10, 25, 50, 100, 200, 250, 500 g; columns All-purpose flour, Granulated sugar, Butter, Whole milk, Water, Honey.

VERIFY (mL):

| g | Flour | Sugar | Butter | Milk | Water | Honey |
|---|---|---|---|---|---|---|
| 10 | 18.9 | 11.8 | 10.4 | 9.7 | 10.0 | 7.0 |
| 25 | 47.3 | 29.6 | 26.1 | 24.2 | 25.0 | 17.4 |
| 50 | 94.6 | 59.1 | 52.1 | 48.5 | 49.9 | 34.9 |
| 100 | 189.3 | 118.3 | 104.2 | 97.0 | 99.8 | 69.8 |
| 200 | 378.5 | 236.6 | 208.4 | 193.9 | 199.7 | 139.6 |
| 250 | 473.2 | 295.7 | 260.6 | 242.4 | 249.6 | 174.5 |
| 500 | 946.4 | 591.5 | 521.1 | 484.8 | 499.1 | 349.0 |

Table 2, caption "Density and mL per 100 g, all ingredients": columns Ingredient | g per mL (USDA) | mL in 100 g (USDA) | mL in 100 g (King Arthur, "-" if null). Sortable, generated.

VERIFY:

| Ingredient | g/mL | mL USDA | mL KA |
|---|---|---|---|
| All-purpose flour | 0.528 | 189.3 | 197.2 |
| Bread flour | 0.579 | 172.7 | 197.2 |
| Cake flour | 0.579 | 172.7 | 197.2 |
| Whole wheat flour | 0.507 | 197.2 | - |
| Granulated sugar | 0.845 | 118.3 | 119.5 |
| Brown sugar (packed) | 0.930 | 107.5 | 111.1 |
| Powdered sugar | 0.507 | 197.2 | 209.4 |
| Butter | 0.959 | 104.2 | 104.7 |
| Honey | 1.433 | 69.8 | 70.4 |
| Maple syrup | 1.331 | 75.1 | 75.8 |
| Whole milk | 1.031 | 97.0 | 104.2 |
| Water | 1.002 | 99.8 | - |
| Vegetable oil | 0.921 | 108.5 | 119.5 |
| Heavy cream | 1.006 | 99.4 | 104.2 |
| Sour cream | 0.972 | 102.9 | 104.2 |
| Yogurt | 1.036 | 96.6 | - |
| Cocoa | 0.364 | 275.1 | 281.7 |
| Rolled oats | 0.342 | 292.1 | 265.8 |
| Rice | 0.782 | 127.9 | 119.5 |
| Cornstarch | 0.541 | 184.8 | 211.2 |
| Peanut butter | 1.091 | 91.7 | 87.6 |
| Chocolate chips | 0.710 | 140.8 | 139.2 |
| Table salt | 1.234 | 81.0 | 82.1 |

### Photo
`InPagePhoto` with `scale-brown-sugar`.

### Tips (exact)
- "For liquids, weighing is often easier than reading a measuring jug at eye level. 240 g of milk is close to 1 cup."
- "Light powders like cocoa and flour are where mL and grams differ most. 100 g of cocoa fills more than a cup."
- "If a recipe lists grams, weigh it. Converting to mL and back adds rounding twice."

### FAQ (registry `faq`, exact)
1. Q: "Is 1 gram equal to 1 mL?" A: "Only for water and similar liquids. 1 g of water is about 1 mL. 1 g of flour takes up about 1.9 mL, and 1 g of honey only about 0.7 mL."
2. Q: "How many mL is 100 grams of flour?" A: "About 189 mL of all-purpose flour using USDA's 125 g per cup, or 197 mL using King Arthur's 120 g per cup."
3. Q: "How many mL is 100 grams of milk?" A: "About 97 mL of whole milk. Milk is slightly denser than water, at about 1.03 g per mL."
4. Q: "How many mL is 100 grams of sugar?" A: "About 118 mL of granulated sugar, which is about 1/2 cup."
5. Q: "How many mL is 100 grams of butter?" A: "About 104 mL, or 7 tablespoons. Butter is a little less dense than water."
6. Q: "How do I convert grams of powder to mL?" A: "Divide the grams by the powder's density in g per mL. For flour that's about 0.53, for cocoa 0.36 and for powdered sugar 0.51. If your powder isn't listed, check the package for a gram weight per scoop or spoon."

Tests:
- every VERIFY cell;
- the FAQ numbers: 1 g flour = 1.89 mL ("about 1.9"); 1 g honey = 0.70 mL; 100 g sugar = 118.3 mL = 1/2 cup (118.3 mL); 100 g butter = 7.05 tbsp ("7 tablespoons");
- the default line 2: 0.8 cups = `toKitchenMeasure(0.8)` = "3/4 cup + 2 1/2 tsp" (already tested in calc.test.ts).

---

## B2. `/cups-in-a-pint/`

Reuse `LiquidVolumeTool` with `defaultUnit="pints"` and `toolName="cups-in-a-pint"`. The quart and gallon pages are unchanged.

### New constants (NIST Handbook 44 Appendix C)
- `ML_PER_DRY_PINT = 550.6104713575`
- `ML_PER_IMPERIAL_PINT = 568.26125`

### Registry entry
- title: `How Many Cups in a Pint? 2, Plus Dry Pints | MeasuredCup` (56)
- metaDescription: `A US pint is 2 cups, 16 fluid ounces or 473 mL. See the pints to cups chart, plus why a dry pint of blueberries holds about 2.33 cups.`
- h1: `How Many Cups in a Pint?`
- kind `tool`, category `converters`, tileLine `2 cups, plus quarts, fl oz and mL`
- related: `['/cups-in-a-quart/', '/cups-in-a-gallon/', '/tablespoons-to-cups/', '/cups-to-grams/']`
- sources: nist, usda
- photoId: `butter-flour-eggs`
- lastUpdated `2026-10-20`

### Quick answer (exact)
"There are 2 cups in a US pint. A pint is also 16 fluid ounces or 473 mL, and 2 pints make a quart. A pint of ice cream or cream is this same 2 cups. Berries are different: a dry pint basket holds about 2.33 cups."

### Tool
`LiquidVolumeTool defaultUnit="pints"`.

Default result: **2 cups**, 0.125 gal, 0.5 quarts, 1 pint, 16 fl oz, 32 tbsp, 473.2 mL, 0.47 L.

"Show the math": `1 × 2 = 2 cups`.

### How to use (exact)
1. Type the amount. Fractions like 1 1/2 work.
2. Choose the unit you're starting from.
3. Read cups first, then quarts, fluid ounces and the rest underneath.

### The formula and two worked examples (exact)
Formula box: `cups = pints × 2` and `pints = cups ÷ 2`

- "A recipe needs 1 1/2 pints of cream. 1.5 × 2 = 3 cups, which is 24 fluid ounces."
- "You have 5 cups of stock. 5 ÷ 2 = 2.5 pints, so it fills two pint jars with a cup left over."

### Section: "Liquid pint vs dry pint vs UK pint" (new section; exact)
"Recipes and cartons of milk, cream and ice cream use the US liquid pint: 2 cups, 16 fl oz, 473 mL. Blueberries, cherry tomatoes and other small produce are sold by the US dry pint, which is 551 mL, about 2.33 US cups. A British pint is bigger again at 568 mL, about 2.4 US cups, which is why a pint of beer in London is more than one in New York."

Table, caption "Three kinds of pint": columns Pint | mL | US cups. Rows:
- US liquid pint | 473.2 | 2
- US dry pint | 550.6 | 2.33
- UK imperial pint | 568.3 | 2.4

Generate from the constants.

### What this tool doesn't cover (exact)
"It converts US liquid volume only. Dry and imperial pints are explained above but aren't in the converter. A pint of rice, sugar or flour has no fixed weight; use cups to grams with the ingredient for that."

### Reference tables
Table 1, caption "Pints to cups chart (US liquid)": columns Pints | Cups | Fluid ounces | Quarts | mL.

| Pints | Cups | fl oz | Quarts | mL |
|---|---|---|---|---|
| 1/2 | 1 | 8 | 1/4 | 236.6 |
| 1 | 2 | 16 | 1/2 | 473.2 |
| 1 1/2 | 3 | 24 | 3/4 | 709.8 |
| 2 | 4 | 32 | 1 | 946.4 |
| 3 | 6 | 48 | 1 1/2 | 1,420 |
| 4 | 8 | 64 | 2 | 1,893 |
| 8 (1 gallon) | 16 | 128 | 4 | 3,785 |

Table 2, caption "What a pint weighs (USDA)": columns Liquid | Grams | Pounds. Grams = 2 × USDA grams per cup; pounds = g ÷ 453.59237, 2 dp.

| Liquid | g | lb |
|---|---|---|
| Water | 474 | 1.04 |
| Whole milk | 488 | 1.08 |
| Heavy cream | 476 | 1.05 |
| Vegetable oil | 436 | 0.96 |
| Maple syrup | 630 | 1.39 |
| Honey | 678 | 1.49 |

### Photo
`InPagePhoto` with `butter-flour-eggs`.

### Tips (exact)
- "The old saying \"a pint's a pound the world around\" is close for water in the US: a pint weighs about 1.04 pounds."
- "Two pints make a quart and eight pints make a gallon."
- "A pint of berries won't fill a 2 cup measure neatly. Dry pints are about a third of a cup bigger."

### FAQ (registry `faq`, exact)
1. Q: "How many cups are in a pint?" A: "2 cups in a US liquid pint. That's 16 fluid ounces or 473 mL."
2. Q: "How many cups are in a pint of ice cream?" A: "2 cups. Ice cream is sold by the US liquid pint, which holds 16 fluid ounces."
3. Q: "How many cups are in a pint of blueberries?" A: "About 2.33 cups by volume. Berries are sold by the dry pint, which is 551 mL compared with 473 mL for a liquid pint."
4. Q: "How many pints are in a quart?" A: "2 pints. A quart is 4 cups and a pint is 2 cups."
5. Q: "How many ounces are in a pint?" A: "16 US fluid ounces. By weight, a pint of water is about 474 g, or 1.04 pounds."
6. Q: "Is a UK pint bigger than a US pint?" A: "Yes. A UK pint is 568 mL, about 20% more than the US pint of 473 mL."

Tests:
- every chart cell;
- the three-pint table;
- the weight table;
- FAQ numbers (UK/US = 1.2009, written "about 20%");
- tool defaults;
- the quart default is still 1 quart and the gallon default is still 1 gallon.

---

## C. Wiring
- `/converters/` "Which tool do I need?" table, add:
  - "I have grams and need milliliters" → Grams to mL
  - "I need cups in a pint" → Cups in a pint
- Related lists, keep 4 items each:
  - add `/grams-to-ml/` to `/grams-to-cups/` and `/grams-to-tablespoons/`;
  - add `/cups-in-a-pint/` to `/cups-in-a-quart/` and `/cups-in-a-gallon/`.
- Sitemap should list 31 URLs.
- Schema on both: WebApplication + BreadcrumbList + FAQPage, no rating.

## D. Definition of done
- `npm test` passes. Report the count.
- `npm run build` is clean. Lighthouse mobile ≥95 and CLS 0 on both new pages; the quart and gallon pages are unchanged.
- No em dashes or banned words; all titles ≤60.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse for both new pages;
  - the IndexNow status line;
  - the actual line 2 string for the grams-to-ml default;
  - any VERIFY value changed, and why.
