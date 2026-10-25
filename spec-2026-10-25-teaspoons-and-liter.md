# MeasuredCup daily work: 2026-10-25

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit 20e26fd).

**Today's check:**
- `/tablespoons-in-1-2-cup/` and `/ounces-in-a-cup/` are already indexed in Google.
- All 36 pages are live.

**No fixes to existing pages today.** Just two new pages, both chosen from fresh Semrush data (US database, October 2026).

All rules in `measuredcup-build-spec.md` still apply:
- A5 page order;
- A13 writing rules (no em dashes, no banned words);
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow;
- titles 30–60, descriptions 110–160;
- WebPage node with `datePublished` and `lastUpdated` = `2026-10-25`.

No number-variant pages.

| # | Slug | Main keyword (US volume, KD) | Also targets | Why |
|---|---|---|---|---|
| 1 | `/teaspoons-in-a-tablespoon/` | how many teaspoons in a tablespoon (165,000, KD 40) | "how many teaspoons are in a tablespoon" (135,000, KD 37), teaspoons to tablespoons (6,600), tablespoons to teaspoons (2,400, KD 27), "how many 1/2 teaspoons are in a tablespoon" (3,600) | Our biggest opportunity so far. The top 10 is weak: dollartimes (AS 61), answers.com, nairaland, Pinterest, wordreference, traditionaloven (AS 41), cookingismysport (AS 24). No result gives grams per teaspoon by ingredient |
| 2 | `/cups-in-a-liter/` | how many cups in a liter (49,500, KD 29) | liters to cups (18,100, KD 31), cups to liters (9,900, KD 26), "how many cups are in a liter" (12,100), "cups in a liter of water" (1,600, KD 23) | Low KD and high volume. The top 10 is 100daysofrealfood, owalalife, Quora, YouTube, Facebook, CK-12 and technology.org. It reuses `LiquidVolumeTool` |

---

## B1. `/teaspoons-in-a-tablespoon/`

### New tool: `TspTbspTool` (in `components/tools/`)

**Inputs:**
- Amount: default `1`; fractions like 1/2 work.
- From: a two-way pill toggle, **Tablespoons** (default) / **Teaspoons**.

**Result card, From = Tablespoons:**
- Big line: **"3 teaspoons"**, which is `tbsp × 3`, trimmed to 2 dp.
- Line 2: "1 tbsp · 1/16 cup · 1/2 fl oz · 14.8 mL".
  - Cups: `formatFraction` when it's a common fraction, otherwise trim to 3 dp.
  - fl oz: `tbsp ÷ 2`.
  - mL: `tbsp × ML_PER_TBSP`, 1 dp.

**Result card, From = Teaspoons:**
- Big line: tablespoons, `tsp ÷ 3`. Show it as a kitchen fraction when exact (1/3, 1/2, 2/3, 1 1/3, …), otherwise trim to 3 dp.
- Line 2 (spoon-friendly): `tbspTspLabel(tsp)`. For example, 4 tsp → "1 tbsp + 1 tsp". Below 3 tsp, show "X tsp".
- Line 3: cups, fl oz and mL, as above.

**Line 4, muted (exact):** "US tablespoon. An Australian tablespoon is 20 mL, which is 4 teaspoons."

**"Show the math":** `1 tbsp × 3 = 3 tsp`, or `4 tsp ÷ 3 = 1.333 tbsp = 1 tbsp + 1 tsp`.

Default output: **3 teaspoons**, 1/16 cup, 1/2 fl oz, 14.8 mL.

Fire `tool_used` with `{tool:'teaspoons-in-a-tablespoon'}`.

### Registry entry
- title: `Teaspoons in a Tablespoon: 3 tsp, Plus Grams | MeasuredCup` (58)
- metaDescription: `A US tablespoon is 3 teaspoons (14.8 mL). Convert teaspoons to tablespoons both ways and see what 1 tsp and 1 tbsp of 23 baking ingredients weigh.` (146)
- h1: `How Many Teaspoons in a Tablespoon?`
- kind `tool`, category `converters`, tileLine `3 tsp, both ways, plus grams per spoon`
- related: `['/tablespoons-to-grams/', '/grams-to-tablespoons/', '/tablespoons-to-cups/', '/tablespoons-in-1-8-cup/']`
- sources: nist, usda, kingArthur
- photoId: `butter-flour-eggs`

### Quick answer (exact)
"There are 3 teaspoons in a US tablespoon. A tablespoon is 14.8 mL and a teaspoon is 4.9 mL, so 1 teaspoon is 1/3 of a tablespoon and 1/2 tablespoon is 1 1/2 teaspoons. The UK tablespoon is also 3 teaspoons (15 mL), but an Australian tablespoon is 20 mL, which is 4 teaspoons."

### How to use (exact)
1. Type the amount. Fractions like 1/2 work.
2. Choose whether you're starting from tablespoons or teaspoons.
3. Read the answer, plus the same amount in cups, fluid ounces and mL.

### The formula and two worked examples (exact)
Formula box: `teaspoons = tablespoons × 3` and `tablespoons = teaspoons ÷ 3`

- "Halving 1 tablespoon of vanilla. 1 tbsp × 3 = 3 tsp, so half is 1 1/2 teaspoons."
- "A recipe calls for 5 teaspoons of baking powder. 5 ÷ 3 = 1 2/3 tablespoons, so measure 1 tablespoon plus 2 teaspoons."

### Section: "Tablespoon sizes around the world" (exact)
"Most countries use a 15 mL tablespoon, which holds 3 teaspoons of 5 mL. The US tablespoon is a hair smaller at 14.8 mL, but still 3 US teaspoons. Australia is the exception: its tablespoon is 20 mL, so it holds 4 teaspoons. If an Australian recipe says 1 tablespoon, use 1 US tablespoon plus 1 teaspoon."

Table, caption "Tablespoon sizes": columns Tablespoon | mL | Teaspoons (5 mL). Rows:
- US tablespoon | 14.8 | 3
- UK and metric tablespoon | 15 | 3
- Australian tablespoon | 20 | 4

### What this tool doesn't cover (exact)
"It converts US tablespoons and teaspoons by volume. Measuring spoons sold in the US match these sizes. For an Australian 20 mL tablespoon, see the table above. For weight, use the grams per spoon table below or the tablespoons to grams converter."

### Reference tables
Table 1, caption "Teaspoons to tablespoons chart (US)": columns Teaspoons | Tablespoons | Cups | mL.

| tsp | tbsp | cups | mL |
|---|---|---|---|
| 1 | 1/3 | - | 4.9 |
| 1 1/2 | 1/2 | - | 7.4 |
| 2 | 2/3 | - | 9.9 |
| 3 | 1 | 1/16 | 14.8 |
| 4 | 1 1/3 | - | 19.7 |
| 6 | 2 | 1/8 | 29.6 |
| 9 | 3 | - | 44.4 |
| 12 | 4 | 1/4 | 59.1 |
| 24 | 8 | 1/2 | 118.3 |
| 48 | 16 | 1 | 236.6 |

Table 2, caption "What 1 teaspoon and 1 tablespoon weigh, by ingredient (USDA)": columns Ingredient | 1 tsp (g) | 1 tbsp (g). Use `gramsCell(usdaGramsPerCup ÷ 48)` and `gramsCell(usdaGramsPerCup ÷ 16)`.

VERIFY:

| Ingredient | 1 tsp | 1 tbsp |
|---|---|---|
| All-purpose flour | 2.6 | 7.8 |
| Bread flour | 2.9 | 8.6 |
| Cake flour | 2.9 | 8.6 |
| Whole wheat flour | 2.5 | 7.5 |
| Granulated sugar | 4.2 | 12.5 |
| Brown sugar (packed) | 4.6 | 13.8 |
| Powdered sugar (unsifted) | 2.5 | 7.5 |
| Butter | 4.7 | 14.2 |
| Honey | 7.1 | 21.2 |
| Maple syrup | 6.6 | 19.7 |
| Whole milk | 5.1 | 15.3 |
| Water | 4.9 | 14.8 |
| Vegetable oil | 4.5 | 13.6 |
| Heavy cream | 5.0 | 14.9 |
| Sour cream | 4.8 | 14.4 |
| Plain whole-milk yogurt | 5.1 | 15.3 |
| Unsweetened cocoa powder | 1.8 | 5.4 |
| Rolled oats | 1.7 | 5.1 |
| Long-grain white rice (uncooked) | 3.9 | 11.6 |
| Cornstarch | 2.7 | 8.0 |
| Peanut butter | 5.4 | 16.1 |
| Semisweet chocolate chips | 3.5 | 10.5 |
| Table salt | 6.1 | 18.3 |

Under Table 2, one muted line (exact): "Weights are for level spoons. Heaped spoons can weigh half as much again."

### Photo
`InPagePhoto` with `butter-flour-eggs`.

### Tips (exact)
- "No tablespoon? Use 3 level teaspoons."
- "1/2 tablespoon is 1 1/2 teaspoons. Most measuring sets include a 1/2 teaspoon, so that's one teaspoon plus one half teaspoon."
- "Level every spoon with a straight edge. A rounded teaspoon of flour can hold close to double."

### FAQ (registry `faq`, exact)
1. Q: "How many teaspoons are in a tablespoon?" A: "3 teaspoons in a US tablespoon. The UK and metric tablespoon is also 3 teaspoons; the Australian tablespoon is 4."
2. Q: "How many 1/2 teaspoons are in a tablespoon?" A: "6. A tablespoon is 3 teaspoons, and each teaspoon is two 1/2 teaspoons."
3. Q: "How many teaspoons are in half a tablespoon?" A: "1 1/2 teaspoons."
4. Q: "Is 1 tsp the same as 1 tbsp?" A: "No. A tablespoon is three times bigger: 14.8 mL against 4.9 mL. Recipes write tbsp or T for tablespoon, and tsp or t for teaspoon."
5. Q: "How many tablespoons is 4 teaspoons?" A: "1 1/3 tablespoons, which you can measure as 1 tablespoon plus 1 teaspoon."
6. Q: "How many grams is a teaspoon of sugar?" A: "About 4.2 g of granulated sugar using USDA's 200 g per cup. A teaspoon of table salt is about 6.1 g, and a teaspoon of all-purpose flour about 2.6 g."

Tests:
- the chart;
- the weight table;
- the tablespoon-sizes table;
- the default tool output, both directions;
- `tbspTspLabel(4)` = "1 tbsp + 1 tsp" and `tbspTspLabel(5)` = "1 tbsp + 2 tsp";
- the FAQ numbers.

---

## B2. `/cups-in-a-liter/`

Reuse `LiquidVolumeTool` with **`defaultUnit="liters"`** and `toolName="cups-in-a-liter"`. The quart, gallon and pint pages keep their defaults.

Default result: **4.227 cups**.
- Gallons: 0.264
- Quarts: 1.057
- Pints: 2.113
- Fluid ounces: 33.81
- Tablespoons: 67.6
- mL: 1,000
- Liters: 1

"Show the math": `1 × 4.227 = 4.227 cups`.

### Registry entry
- title: `How Many Cups in a Liter? 4.23, Plus a Chart | MeasuredCup` (58)
- metaDescription: `A liter is about 4.23 US cups, just under 4 1/4 cups, or exactly 4 metric cups. Convert liters to cups both ways, with a chart from 1/4 to 4 liters.` (148)
- h1: `How Many Cups in a Liter?`
- kind `tool`, category `converters`, tileLine `4.23 US cups, or 4 metric cups`
- related: `['/cups-to-ml/', '/ml-to-cups/', '/cups-in-a-quart/', '/ounces-in-a-cup/']`
- sources: nist, usda
- photoId: `cookbooks-counter`

### Quick answer (exact)
"There are about 4.23 US cups in a liter, just under 4 1/4 cups. A liter is 1,000 mL and a US cup is 236.6 mL. If your recipe uses metric cups of 250 mL (UK, Australia, Canada), a liter is exactly 4 cups. A liter is also a little more than a US quart: 1.06 quarts, or 33.8 fluid ounces."

### How to use (exact)
1. Type the amount. Fractions like 1/2 work.
2. Choose liters, or switch the unit to go from cups, quarts or mL.
3. Read cups first, then fluid ounces, quarts and the rest underneath.

### The formula and two worked examples (exact)
Formula box: `cups = liters × 4.227` and `liters = cups × 0.2366`

- "A 2 liter bottle of soda. 2 × 4.227 = 8.45 cups, a little more than 2 quarts."
- "A soup recipe needs 6 cups of stock. 6 × 0.2366 = 1.42 liters, so a 1.5 liter carton is enough."

### Section: "US cups vs metric cups" (exact)
"A US cup is 236.6 mL, so 1 liter is 4.23 US cups. Recipes from the UK, Australia, New Zealand and Canada often use a 250 mL metric cup, and then 1 liter is exactly 4 cups. US nutrition labels use a 240 mL cup, which makes a liter 4.17 cups. When a recipe gives both liters and cups, check which cup it means."

Table, caption "Cups in a liter, by cup size": columns Cup | mL | Cups per liter. Rows:
- US customary cup | 236.6 | 4.23
- US legal cup | 240 | 4.17
- Metric cup | 250 | 4
- Japanese cup | 200 | 5

Generate the rows from the constants (2 dp, trimmed).

### What this tool doesn't cover (exact)
"It converts liquid volume in US units. A liter of flour or sugar weighs very different amounts, so for dry ingredients use cups to grams with the ingredient. The table above covers metric and other cup sizes."

### Reference tables
Table 1, caption "Liters to cups chart (US)": columns Liters | Cups | Quarts | Fluid ounces.

| L | cups | quarts | fl oz |
|---|---|---|---|
| 1/4 | 1.06 | 0.26 | 8.5 |
| 1/2 | 2.11 | 0.53 | 16.9 |
| 3/4 | 3.17 | 0.79 | 25.4 |
| 1 | 4.23 | 1.06 | 33.8 |
| 1 1/2 | 6.34 | 1.59 | 50.7 |
| 2 | 8.45 | 2.11 | 67.6 |
| 3 | 12.68 | 3.17 | 101.4 |
| 4 | 16.91 | 4.23 | 135.3 |

Table 2, caption "Cups to liters chart (US)": columns Cups | mL | Liters.

| cups | mL | L |
|---|---|---|
| 1 | 236.6 | 0.237 |
| 2 | 473.2 | 0.473 |
| 3 | 709.8 | 0.71 |
| 4 | 946.4 | 0.946 |
| 6 | 1,420 | 1.42 |
| 8 | 1,893 | 1.893 |
| 10 | 2,366 | 2.366 |
| 16 | 3,785 | 3.785 |

Use the existing `formatMl`, which gives one decimal under 1,000 and whole numbers with a comma above.

Table 3, caption "What a liter weighs (USDA)": columns Liquid | Grams | Pounds. Grams = USDA grams per cup × (1000 ÷ ML_PER_CUP), rounded to whole grams with a thousands comma. Pounds = unrounded g ÷ 453.59237, 2 dp. Rows: Water, Whole milk, Heavy cream, Vegetable oil, Maple syrup, Honey.

VERIFY:

| Liquid | g | lb |
|---|---|---|
| Water | 1,002 | 2.21 |
| Whole milk | 1,031 | 2.27 |
| Heavy cream | 1,006 | 2.22 |
| Vegetable oil | 921 | 2.03 |
| Maple syrup | 1,331 | 2.94 |
| Honey | 1,433 | 3.16 |

Under Table 3, one muted line (exact): "Water at exactly 1 g per mL is 1,000 g per liter. USDA's 237 g cup rounds up slightly, which gives 1,002 g."

### Photo
`InPagePhoto` with `cookbooks-counter`.

### Tips (exact)
- "Quick estimate: a liter is about 4 1/4 US cups. That's close enough for soups and stocks."
- "For baking, measure 4 cups plus 3 1/2 tablespoons, or better, use the mL marks on your jug."
- "A liter and a US quart are close but not the same. A liter is about 6% bigger."

### FAQ (registry `faq`, exact)
1. Q: "How many cups are in a liter?" A: "About 4.23 US cups. With 250 mL metric cups, a liter is exactly 4 cups."
2. Q: "How many cups are in a liter of water?" A: "The same, about 4.23 US cups. Volume doesn't depend on the liquid. A liter of water weighs about 1 kg."
3. Q: "How many cups is 2 liters?" A: "About 8.45 US cups, so a 2 liter bottle holds a little more than 8 cups."
4. Q: "How many cups are in half a liter?" A: "About 2.11 US cups, which is 500 mL, or exactly 2 metric cups."
5. Q: "Is a liter bigger than a quart?" A: "Yes, slightly. A liter is 1.06 US quarts, and a quart is 0.946 liters."
6. Q: "How many liters is 4 cups?" A: "About 0.946 liters (946 mL), which is one US quart."

Tests:
- all three charts;
- the cup-size table;
- the default tool outputs;
- the FAQ numbers;
- the quart, gallon and pint pages keep their defaults.

Check: 1000 ÷ 236.5882365 = 4.2268 (4.23); 237 × 4.2268 = 1,001.7 → 1,002.

---

## C. Wiring
- `/converters/` "Which tool do I need?" table, add:
  - "I need teaspoons in a tablespoon" → Teaspoons in a tablespoon
  - "My recipe uses liters" → Cups in a liter
- Related lists, 4 items each:
  - add `/teaspoons-in-a-tablespoon/` to `/tablespoons-to-grams/` and `/tablespoons-to-cups/`;
  - add `/cups-in-a-liter/` to `/cups-to-ml/` and `/cups-in-a-quart/`.
  - Each replaces that list's last item.
- Sitemap should list **38** URLs.
- Schema on both: WebPage + WebApplication + BreadcrumbList + FAQPage, no rating.

## D. Definition of done
- `npm test` passes. Report the count.
- `npm run build` is clean. Lighthouse mobile ≥95 and CLS 0 on both new pages.
- The existing liquid pages keep their defaults.
- No em dashes or banned words.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse for both new pages;
  - the IndexNow status line;
  - any VERIFY value changed, and why.
