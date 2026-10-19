# MeasuredCup daily work: 2026-10-18

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit 8d9ae6a).

Today's audit: all 27 pages return 200, with 0 broken links, 0 orphans, 0 title or description issues. **No fixes to existing pages today.** Just two new pages.

All rules in `measuredcup-build-spec.md` still apply:
- A5 page order;
- A13 writing rules (no em dashes, no banned words);
- design system;
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow;
- the title-length guard (≤60).

No number-variant pages.

| # | Slug | Main keyword | Why |
|---|---|---|---|
| 1 | `/tablespoons-in-2-3-cup/` | how many tablespoons in 2/3 cup | Completes the 1/8, 1/4, 1/3 set. Page 1 is blogs (DA 44-46), YouTube and image packs. People also ask about "tbsp butter for 2/3 cup" and "how many 1/4 cups equal 2/3 cup" |
| 2 | `/cups-in-a-gallon/` | how many cups in a gallon | Very high volume. Page 1 is the same mix as the quart page: blogs (DA 34-59), CK-12, Quora, Pinterest, YouTube. It reuses `LiquidVolumeTool` |

---

## B1. `/tablespoons-in-2-3-cup/`

Built on `CupFractionTool` / `CupFractionTable` with `fraction = 2/3`. The tablespoon label comes from `tbspTspLabel(32)` = **"10 tbsp + 2 tsp"**. The 1/8, 1/4 and 1/3 pages must render exactly as now.

### Registry entry
- title: `How Many Tablespoons in 2/3 Cup? Plus Grams | MeasuredCup` (57)
- metaDescription: `2/3 cup is 10 tablespoons plus 2 teaspoons (32 teaspoons, 157.7 mL). See what 2/3 cup of flour, sugar, butter, milk and 19 more ingredients weighs in grams.`
- h1: `How Many Tablespoons in 2/3 Cup?`
- kind `tool`, category `converters`, tileLine `10 tbsp + 2 tsp, plus grams`
- related: `['/tablespoons-in-1-3-cup/', '/tablespoons-to-cups/', '/half-a-measurement/', '/cups-to-grams/']`
- sources: nist, usda, kingArthur
- photoId: `four-cups`
- lastUpdated `2026-10-18`

### Quick answer (exact)
"2/3 cup is 10 tablespoons plus 2 teaspoons, which is 32 teaspoons, about 5.33 US fluid ounces or 157.7 mL. By weight it depends on the ingredient: 2/3 cup of all-purpose flour is about 83.3 g, granulated sugar 133 g and butter 151 g (USDA FoodData Central)."

### Tool
`CupFractionTool fraction={2/3}`.

Result card:
- big number = grams in 2/3 cup;
- line 2 = "10 tbsp + 2 tsp · 32 tsp · 5.33 fl oz · 157.7 mL";
- line 3 = "Per tablespoon: X g".

Default: All-purpose flour, USDA → **83.3 g**; King Arthur → **80.0 g**. "Show the math": `125 × 2 ÷ 3 = 83.3 g`.

"Need a different amount?" links to `/tablespoons-in-1-3-cup/` and `/cups-to-grams/`.

### How to use (exact)
1. Pick the ingredient.
2. Choose USDA, or King Arthur if your recipe comes from their kitchen.
3. Read the grams in 2/3 cup, or use two level 1/3 cup scoops.

### The formula and two worked examples (exact)
Formula box: `2/3 cup = 16 × 2 ÷ 3 = 10 2/3 tablespoons = 10 tbsp + 2 tsp` and `grams in 2/3 cup = grams per cup × 2 ÷ 3`

- "Why 2 teaspoons: 2/3 of a tablespoon is 2 teaspoons, because a tablespoon holds 3. So 2/3 cup is 10 tablespoons with 2 teaspoons left over."
- "Whole milk. 244 g per cup × 2 ÷ 3 = 162.7 g, shown as 163 g. That matches what the cups to grams converter gives for 2/3 cup."

### Section: "How to measure 2/3 cup without a 2/3 cup measure" (exact)
"No 2/3 cup? Use any of these:"
- "Two level 1/3 cup scoops. The easiest swap."
- "1/2 cup plus 2 tablespoons plus 2 teaspoons."
- "10 level tablespoons plus 2 level teaspoons."
- "For liquids, a little above the 5 fl oz line on a measuring cup (2/3 cup is 5.33 fl oz)."
- "Not 2 1/2 quarter cups. Two 1/4 cups plus 2 tablespoons and 2 teaspoons is right, because 2/3 cup is 2 2/3 quarter cups."

### What this tool doesn't cover (exact)
"It covers US measures only. A UK or Australian 2/3 metric cup is about 166.7 mL, a bit more than the US 157.7 mL. Weights assume level, spooned measures and typical US products, so packing and brands change them a little."

### Reference tables
Table 1, caption "2/3 cup equivalents (US)":
- Tablespoons | 10 tbsp + 2 tsp (10 2/3)
- Teaspoons | 32
- Fluid ounces | 5.33
- Milliliters | 157.7
- Cups (decimal) | 0.667
- Half of 2/3 cup | 1/3 cup (5 tbsp + 1 tsp)
- Double 2/3 cup | 1 1/3 cups
- Butter | 10 tbsp + 2 tsp, 1 1/3 sticks

Table 2, caption "2/3 cup in grams by ingredient": all 23 ingredients, same columns as the 1/3 cup page.

VERIFY (`gramsCell`):

| Ingredient | USDA | KA | per tbsp |
|---|---|---|---|
| All-purpose flour | 83.3 | 80.0 | 7.8 |
| Bread flour | 91.3 | 80.0 | 8.6 |
| Cake flour | 91.3 | 80.0 | 8.6 |
| Whole wheat flour | 80.0 | - | 7.5 |
| Granulated sugar | 133 | 132 | 12.5 |
| Brown sugar (packed) | 147 | 142 | 13.8 |
| Powdered sugar | 80.0 | 75.3 | 7.5 |
| Butter | 151 | 151 | 14.2 |
| Honey | 226 | 224 | 21.2 |
| Maple syrup | 210 | 208 | 19.7 |
| Whole milk | 163 | 151 | 15.3 |
| Water | 158 | - | 14.8 |
| Vegetable oil | 145 | 132 | 13.6 |
| Heavy cream | 159 | 151 | 14.9 |
| Sour cream | 153 | 151 | 14.4 |
| Yogurt | 163 | - | 15.3 |
| Cocoa | 57.3 | 56.0 | 5.4 |
| Rolled oats | 54.0 | 59.3 | 5.1 |
| Rice | 123 | 132 | 11.6 |
| Cornstarch | 85.3 | 74.7 | 8.0 |
| Peanut butter | 172 | 180 | 16.1 |
| Chocolate chips | 112 | 113 | 10.5 |
| Table salt | 195 | 192 | 18.3 |

### Photo
`InPagePhoto` with `four-cups`.

### Tips (exact)
- "2/3 cup is two 1/3 cups. If you own a 1/3 cup, use it twice."
- "For butter, 2/3 cup is 1 stick plus 2 tablespoons and 2 teaspoons, about 151 g."
- "Halving a recipe that calls for 2/3 cup gives exactly 1/3 cup."

### FAQ (registry `faq`, exact)
1. Q: "How many tablespoons are in 2/3 cup?" A: "10 tablespoons plus 2 teaspoons, which is 10 2/3 tablespoons. It's double the 5 tablespoons plus 1 teaspoon in 1/3 cup."
2. Q: "How many tablespoons of butter is 2/3 cup?" A: "10 tablespoons plus 2 teaspoons, or 1 1/3 US sticks. By weight that's about 151 g."
3. Q: "How many 1/4 cups equal 2/3 cup?" A: "2 2/3 quarter cups. In practice, two 1/4 cups plus 2 tablespoons and 2 teaspoons."
4. Q: "How many grams is 2/3 cup of flour?" A: "About 83.3 g of all-purpose flour using USDA's 125 g per cup, or 80 g using King Arthur's 120 g per cup."
5. Q: "How many grams is 2/3 cup of sugar?" A: "About 133 g of granulated sugar using USDA's 200 g per cup. Packed brown sugar is about 147 g."
6. Q: "What is half of 2/3 cup?" A: "1/3 cup, which is 5 tablespoons plus 1 teaspoon."

Tests: every VERIFY value and FAQ number; `tbspTspLabel(32)`; 2/3 = 2 2/3 quarter cups (2 × 1/4 cup = 8 tbsp, remainder 2 tbsp + 2 tsp).

---

## B2. `/cups-in-a-gallon/`

Reuse `LiquidVolumeTool` with **default `1` gallon** (prop for the default unit). The quart page must keep defaulting to 1 quart.

### New constants (NIST Handbook 44 Appendix C)
- `ML_PER_IMPERIAL_GALLON = 4546.09`
- `ML_PER_DRY_GALLON = 4404.88377086`

### Registry entry
- title: `How Many Cups in a Gallon? 16, Plus a Chart | MeasuredCup` (57)
- metaDescription: `A US gallon is 16 cups, 4 quarts, 8 pints or 128 fluid ounces (3.79 L). See the gallons to cups chart and what a gallon of water or milk weighs.`
- h1: `How Many Cups in a Gallon?`
- kind `tool`, category `converters`, tileLine `16 cups, plus quarts, pints and liters`
- related: `['/cups-in-a-quart/', '/tablespoons-to-cups/', '/recipe-scaler/', '/cups-to-grams/']`
- sources: nist, usda
- photoId: `cookbooks-counter`
- lastUpdated `2026-10-18`

### Quick answer (exact)
"There are 16 cups in a US gallon. A gallon is also 4 quarts, 8 pints, 128 fluid ounces or about 3.79 liters. Half a gallon is 8 cups and a quarter gallon is 4 cups, which is one quart."

### Tool
`LiquidVolumeTool defaultUnit="gallons"`.

Default result: **16 cups**, 1 gal, 4 quarts, 8 pints, 128 fl oz, 256 tbsp, 3,785 mL, 3.79 L.

"Show the math": `1 × 16 = 16 cups`. Fire `tool_used` `{tool:'cups-in-a-gallon'}`.

### How to use (exact)
1. Type the amount. Fractions like 1/2 work.
2. Choose the unit you're starting from.
3. Read cups first, then quarts, pints and the rest underneath.

### The formula and two worked examples (exact)
Formula box: `cups = gallons × 16` and `gallons = cups ÷ 16`

- "Half a gallon of milk. 0.5 × 16 = 8 cups, which is 2 quarts or 64 fluid ounces."
- "A punch recipe makes 24 cups. 24 ÷ 16 = 1.5 gallons, so you need a container bigger than a standard 1 gallon jug."

### Section: "US gallon vs UK gallon" (new section; exact)
"US recipes and US milk jugs use the US liquid gallon: 16 cups, 128 fl oz, 3.79 L. The British imperial gallon is about 20% bigger at 4.55 L, which is about 19.2 US cups. There's also a rarely used US dry gallon of about 4.40 L (18.6 US cups), mostly in old produce measures."

Table, caption "Three kinds of gallon": columns Gallon | Liters | US cups. Rows:
- US liquid gallon | 3.79 | 16
- UK imperial gallon | 4.55 | 19.22
- US dry gallon | 4.40 | 18.62

Generate from the constants.

### What this tool doesn't cover (exact)
"It converts US liquid volume only. Imperial and dry gallons are explained above but aren't in the converter. For dry ingredients by weight, use cups to grams with the ingredient."

### Reference tables
Table 1, caption "Gallons to cups chart (US liquid)": columns Gallons | Cups | Quarts | Pints | Fluid ounces | Liters.

| Gallons | Cups | Quarts | Pints | fl oz | L |
|---|---|---|---|---|---|
| 1/4 | 4 | 1 | 2 | 32 | 0.95 |
| 1/2 | 8 | 2 | 4 | 64 | 1.89 |
| 3/4 | 12 | 3 | 6 | 96 | 2.84 |
| 1 | 16 | 4 | 8 | 128 | 3.79 |
| 1 1/2 | 24 | 6 | 12 | 192 | 5.68 |
| 2 | 32 | 8 | 16 | 256 | 7.57 |
| 3 | 48 | 12 | 24 | 384 | 11.36 |
| 5 | 80 | 20 | 40 | 640 | 18.93 |

Table 2, caption "What a gallon weighs (USDA)": columns Liquid | Grams | Pounds. Grams = 16 × USDA grams per cup, with a thousands comma; pounds = g ÷ 453.59237, 2 dp.

| Liquid | g | lb |
|---|---|---|
| Water | 3,792 | 8.36 |
| Whole milk | 3,904 | 8.61 |
| Heavy cream | 3,808 | 8.40 |
| Vegetable oil | 3,488 | 7.69 |
| Maple syrup | 5,040 | 11.11 |
| Honey | 5,424 | 11.96 |

Under Table 2, one muted line (exact): "Water at exactly 1 g per mL gives 8.35 lb per gallon. The USDA cup figure of 237 g rounds up slightly, which gives 8.36 lb."

### Photo
`InPagePhoto` with `cookbooks-counter`.

### Tips (exact)
- "A gallon is 4 quarts and a quart is 4 cups, so 4 × 4 = 16."
- "When a soup recipe makes 1 gallon, plan on about 16 one-cup servings."
- "A standard gallon milk jug holds 16 cups, but leave some headroom if you're mixing anything in it."

### FAQ (registry `faq`, exact)
1. Q: "How many cups are in a gallon?" A: "16 cups in a US gallon. That's the same as 4 quarts or 8 pints."
2. Q: "How many cups are in half a gallon?" A: "8 cups, which is 2 quarts or 64 fluid ounces."
3. Q: "How many ounces are in a gallon?" A: "128 US fluid ounces. By weight, a gallon of water is about 8.35 to 8.36 pounds."
4. Q: "How many cups are in a UK gallon?" A: "About 19.2 US cups. The imperial gallon is 4.55 L, about 20% bigger than the US gallon."
5. Q: "How much does a gallon of milk weigh?" A: "About 3,904 g, or 8.61 pounds, using USDA's 244 g per cup of whole milk."
6. Q: "How many quarts are in a gallon?" A: "4 quarts. Each quart is 4 cups, so a gallon is 16 cups."

Tests: every chart cell; the three-gallon table; the weight table and the 8.35 lb line; FAQ numbers; the default tool outputs; the quart page default still 1 quart.

---

## C. Wiring
- `/converters/` "Which tool do I need?" table, add:
  - "My recipe says 2/3 cup" → Tablespoons in 2/3 cup
  - "I need cups in a gallon" → Cups in a gallon
- Related lists, keep 4 items each:
  - add `/tablespoons-in-2-3-cup/` to `/tablespoons-in-1-3-cup/` and `/cups-to-grams/`;
  - add `/cups-in-a-gallon/` to `/cups-in-a-quart/` and `/recipe-scaler/`.
- Sitemap should list 29 URLs.
- Schema on both: WebApplication + BreadcrumbList + FAQPage, no rating.

## D. Definition of done
- `npm test` passes. Report the count.
- `npm run build` is clean. Lighthouse mobile ≥95 and CLS 0 on both new pages.
- The 1/8, 1/4, 1/3 and quart pages are unchanged.
- No em dashes or banned words; all titles ≤60.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse for both new pages;
  - the IndexNow status line;
  - any VERIFY value changed, and why.
