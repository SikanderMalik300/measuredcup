# MeasuredCup daily work: 2026-10-26

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit 41c44d6).

**Today's check:**
- Live: 38 pages.
- Search Console, 28 days: 4.4k impressions (up from 2.4k three days ago), average position 52.4, and 33 pages already getting impressions.
- Semrush: 912 organic keywords; ChatGPT already cites us on 2 pages.

**No fixes to existing pages.** Two new pages.

All rules in `measuredcup-build-spec.md` still apply:
- A5 page order;
- A13 writing rules (no em dashes, no banned words);
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow;
- titles 30–60, descriptions 110–160;
- WebPage node with `datePublished` and `lastUpdated` = `2026-10-26`.

| # | Slug | Main keyword (US volume, KD) | Also targets | Why |
|---|---|---|---|---|
| 1 | `/tablespoons-in-an-ounce/` | how many tablespoons in an ounce (40,500, KD 35) | "are in an ounce" (4,400), "in an ounce dry" (1,300, KD 30), "dry tablespoons in an ounce" (480, KD 25) | Top 3 are small blogs with 3–8 referring domains (suziethefoodie, recipesandplaces, 100daysofrealfood). The "dry" searches need weight by ingredient, which is our data |
| 2 | `/cups-in-a-pound/` | how many cups in a pound (33,100, KD 36) | "are in a pound" (12,100, KD 29), "cups in a pound of icing sugar" (12,100 + 12,100, KD 27–28), "confectioners sugar in a pound" (6,600), cups to lbs | 2,885 keyword variations, 218k total volume. The top 10 is thin Q&A pages (foodista, coolconversion, answers.com) with 0 referring domains |

Fact used on both pages: since 1 cup = 16 tbsp and 1 lb = 16 oz, **tablespoons per ounce = cups per pound** for any ingredient. Say it once on each page, in the formula section.

Both new tools reuse the existing ingredient select and the USDA / King Arthur toggle.

---

## B1. `/tablespoons-in-an-ounce/`

### New tool: `OunceTbspTool`

**Inputs:**
- Ounces (default `1`; fractions OK).
- Ounce type: pill toggle, **Fluid ounces** (default) / **Ounces by weight**.
- Ingredient and source selects: shown only when "by weight" is chosen. Default All-purpose flour, USDA.

**Result card, fluid:**
- Big line: **"2 tablespoons"** (`oz × 2`).
- Line 2: "6 tsp · 1/8 cup · 29.6 mL".

**Result card, weight:**
- Big line: tablespoons = `oz × G_PER_OZ ÷ (grams per cup ÷ 16)`, trimmed to 2 dp.
- Line 2: the kitchen measure from `toKitchenMeasure`, e.g. "3 tbsp + 2 tsp".
- Line 3: "1 oz = 28.35 g of all-purpose flour".

**Muted line (exact):** "Fluid ounces measure volume and ounces measure weight. A recipe that says ounces for a dry ingredient means weight."

**"Show the math":**
- fluid: `1 fl oz × 2 = 2 tbsp`;
- weight: `28.35 g ÷ 7.81 g per tbsp = 3.63 tbsp`.

Fire `tool_used` with `{tool:'tablespoons-in-an-ounce'}`.

**Defaults:**
- fluid: **2 tbsp**;
- weight, AP flour: USDA **3.63 tbsp**, King Arthur **3.78 tbsp**.

### Registry entry
- title: `Tablespoons in an Ounce: Fluid and Dry Ounces | MeasuredCup` (59)
- metaDescription: `1 fluid ounce is 2 tablespoons. By weight it depends on the food: 1 oz of flour is about 3.6 tbsp, sugar 2.3 tbsp, butter 2 tbsp. See 23 ingredients.` (149)
- h1: `How Many Tablespoons in an Ounce?`
- kind `tool`, category `converters`, tileLine `2 tbsp per fl oz, plus dry ounces`
- related: `['/ounces-in-a-cup/', '/teaspoons-in-a-tablespoon/', '/tablespoons-to-grams/', '/cups-in-a-pound/']`
- sources: nist, usda, kingArthur
- photoId: `butter-flour-eggs`

### Quick answer (exact)
"There are 2 tablespoons in a US fluid ounce, which is also 6 teaspoons or 29.6 mL. For dry ingredients measured by weight, it depends on the food: 1 ounce of all-purpose flour is about 3.6 tablespoons, granulated sugar about 2.3 tablespoons, and butter exactly 2 tablespoons (USDA FoodData Central)."

### How to use (exact)
1. Type the number of ounces.
2. Choose fluid ounces for liquids, or ounces by weight for dry ingredients and butter.
3. For weight, pick the ingredient and read the tablespoons, or the spoon measure underneath.

### The formula and two worked examples (exact)
Formula box:
- `tablespoons = fluid ounces × 2`
- `tablespoons = ounces × 28.35 ÷ grams per tablespoon`

Then one line (exact): "Handy shortcut: the tablespoons in 1 ounce of an ingredient equal the cups in 1 pound of it, because both are 16 to 1."

- "Vanilla extract. A recipe says 1/2 fl oz. 0.5 × 2 = 1 tablespoon."
- "Cocoa powder by weight. 1 oz is 28.35 g, and a tablespoon of cocoa is about 5.4 g, so 1 oz is about 5.3 tablespoons."

### Section: "Fluid ounces vs dry ounces" (exact)
"A fluid ounce is a volume: 2 tablespoons, whatever you pour into it. A dry ounce is a weight: 28.35 g. For water and milk the two are close, so 1 oz is about 2 tablespoons either way. For light, airy ingredients like flour or cocoa, an ounce on a scale fills many more spoons. For dense ones like honey, it fills fewer."

### What this tool doesn't cover (exact)
"It uses US tablespoons of 14.8 mL. Weights assume level, spooned tablespoons of typical US products, so packing and brands change them a little. For other spoon sizes, see teaspoons in a tablespoon."

### Reference tables
Table 1, caption "Fluid ounces to tablespoons (US)": columns Fluid ounces | Tablespoons | Teaspoons | Cups | mL.

| fl oz | tbsp | tsp | cups | mL |
|---|---|---|---|---|
| 1/2 | 1 | 3 | 1/16 | 14.8 |
| 1 | 2 | 6 | 1/8 | 29.6 |
| 2 | 4 | 12 | 1/4 | 59.1 |
| 3 | 6 | 18 | 3/8 | 88.7 |
| 4 | 8 | 24 | 1/2 | 118.3 |
| 6 | 12 | 36 | 3/4 | 177.4 |
| 8 | 16 | 48 | 1 | 236.6 |
| 16 | 32 | 96 | 2 | 473.2 |

Table 2, caption "Tablespoons in 1 ounce by weight, by ingredient": columns Ingredient | USDA | King Arthur. Values = `G_PER_OZ ÷ (g per cup ÷ 16)`, 2 dp.

VERIFY:

| Ingredient | USDA | KA |
|---|---|---|
| All-purpose flour | 3.63 | 3.78 |
| Bread flour | 3.31 | 3.78 |
| Cake flour | 3.31 | 3.78 |
| Whole wheat flour | 3.78 | - |
| Granulated sugar | 2.27 | 2.29 |
| Brown sugar (packed) | 2.06 | 2.13 |
| Powdered sugar (unsifted) | 3.78 | 4.01 |
| Butter | 2.00 | 2.01 |
| Honey | 1.34 | 1.35 |
| Maple syrup | 1.44 | 1.45 |
| Whole milk | 1.86 | 2.00 |
| Water | 1.91 | - |
| Vegetable oil | 2.08 | 2.29 |
| Heavy cream | 1.91 | 2.00 |
| Sour cream | 1.97 | 2.00 |
| Plain whole-milk yogurt | 1.85 | - |
| Unsweetened cocoa powder | 5.27 | 5.40 |
| Rolled oats | 5.60 | 5.10 |
| Long-grain white rice (uncooked) | 2.45 | 2.29 |
| Cornstarch | 3.54 | 4.05 |
| Peanut butter | 1.76 | 1.68 |
| Semisweet chocolate chips | 2.70 | 2.67 |
| Table salt | 1.55 | 1.57 |

Under Table 2, one muted line (exact): "Butter is 2.00 tbsp per ounce by the US stick convention: a 4 oz stick is 8 tablespoons."

### Photo
`InPagePhoto` with `butter-flour-eggs`.

### Tips (exact)
- "For butter, 1 ounce is 2 tablespoons. The wrapper lines make it easy."
- "A shot glass is often 1.5 fl oz, which is 3 tablespoons."
- "When a dry ingredient is listed in ounces, a scale beats spoons every time."

### FAQ (registry `faq`, exact)
1. Q: "How many tablespoons are in an ounce?" A: "2 tablespoons in a US fluid ounce. For dry ingredients by weight, it depends on the food: about 3.6 for flour and 2.3 for sugar."
2. Q: "How many tablespoons are in an ounce dry?" A: "It depends on the ingredient's weight. 1 oz of all-purpose flour is about 3.6 tablespoons, cocoa about 5.3 and granulated sugar about 2.3."
3. Q: "How many tablespoons is 1 oz of butter?" A: "2 tablespoons. A 4 oz US stick has 8 tablespoon marks."
4. Q: "How many tablespoons are in 2 ounces?" A: "4 tablespoons for 2 fluid ounces, which is 1/4 cup."
5. Q: "How many teaspoons are in an ounce?" A: "6 teaspoons in a US fluid ounce."
6. Q: "Is 1 oz the same as 2 tablespoons?" A: "For liquids, yes: 1 fl oz is 2 tablespoons. By weight, only for water-like foods and butter."

Tests:
- both tables;
- the tool defaults (fluid and weight, USDA and King Arthur);
- the FAQ numbers. Cocoa: 28.35 ÷ 5.375 = 5.27, written "about 5.3".

---

## B2. `/cups-in-a-pound/`

### New tool: `PoundCupsTool`

**Inputs:**
- Pounds (default `1`; fractions OK);
- Ingredient (default All-purpose flour);
- Data source (default USDA).

**Result card:**
- Big line: cups = `pounds × 453.59237 ÷ grams per cup`, trimmed to 2 dp. Example: **"3.63 cups"**.
- Line 2: the nearest kitchen measure from `toKitchenMeasure`, e.g. "3 1/2 cups + 2 tbsp".
- Line 3: "1 lb = 453.6 g = 16 oz".

**"Show the math":** `453.6 g ÷ 125 g per cup = 3.63 cups`.

Fire `tool_used` with `{tool:'cups-in-a-pound'}`.

**Defaults:** USDA **3.63 cups**; King Arthur **3.78 cups**.

### Registry entry
- title: `How Many Cups in a Pound? By Ingredient | MeasuredCup` (53)
- metaDescription: `A pound of flour is about 3.6 cups, sugar 2.3 cups, powdered sugar 3.8 cups and butter 2 cups (4 sticks). Convert pounds to cups for 23 ingredients.` (148)
- h1: `How Many Cups in a Pound?`
- kind `tool`, category `converters`, tileLine `Pounds to cups for 23 ingredients`
- related: `['/cups-to-grams/', '/grams-to-cups/', '/butter-converter/', '/tablespoons-in-an-ounce/']`
- sources: usda, kingArthur, nist
- photoId: `four-cups`

### Quick answer (exact)
"It depends on the ingredient, because a pound is a weight and a cup is a volume. A pound of all-purpose flour is about 3 2/3 cups (3.63), granulated sugar about 2 1/4 cups (2.27), powdered sugar about 3 3/4 cups (3.78), and butter exactly 2 cups, or 4 sticks. A pound of water is about 1.9 cups (USDA FoodData Central)."

### How to use (exact)
1. Type the pounds. Fractions like 1/2 work.
2. Pick the ingredient, and USDA or King Arthur.
3. Read the cups, or the cup and spoon measure underneath.

### The formula and two worked examples (exact)
Formula box: `cups = pounds × 453.6 ÷ grams per cup`, then the shortcut line (exact): "The cups in a pound equal the tablespoons in an ounce of the same ingredient, since both are 16 to 1."

- "A 5 lb bag of all-purpose flour. 5 × 453.6 ÷ 125 = 18.1 cups, enough for about 8 loaves at 2 1/4 cups each."
- "A 2 lb bag of powdered sugar. 2 × 453.6 ÷ 120 = 7.56 cups, a little over 7 1/2 cups."

### Section: "Common bag sizes" (exact intro)
"How many cups are in the bag you just bought:"

Table, caption "Cups in common bag sizes (USDA)": columns Bag | Cups.
- 5 lb all-purpose flour | 18.14
- 4 lb granulated sugar | 9.07
- 2 lb packed brown sugar | 4.12
- 2 lb powdered sugar | 7.56
- 1 lb butter (4 sticks) | 2.00

Generate from the data.

### What this tool doesn't cover (exact)
"It uses average weights for level, spooned cups of typical US products. Sifted flour and powdered sugar are lighter, so a pound fills more cups; packed or settled ingredients fill fewer. For liquids by volume, use cups in a quart or cups in a liter."

### Reference tables
Table 1, caption "Cups in 1 pound, by ingredient": columns Ingredient | USDA | King Arthur. Values = `453.59237 ÷ g per cup`, 2 dp.

VERIFY: identical numbers to the B1 Table 2 VERIFY list. Assert that the two tables are equal row by row.

Table 2, caption "Pounds to cups chart": columns Pounds | All-purpose flour | Granulated sugar | Powdered sugar | Butter (USDA, 2 dp).

| lb | AP flour | sugar | powdered | butter |
|---|---|---|---|---|
| 1/4 | 0.91 | 0.57 | 0.94 | 0.50 |
| 1/2 | 1.81 | 1.13 | 1.89 | 1.00 |
| 1 | 3.63 | 2.27 | 3.78 | 2.00 |
| 2 | 7.26 | 4.54 | 7.56 | 4.00 |
| 5 | 18.14 | 11.34 | 18.90 | 9.99 |

Butter at 5 lb: 5 × 453.59 ÷ 227 = 9.99. Show it as calculated; the muted line below explains it.

Under Table 2, one muted line (exact): "Butter shows 9.99 cups for 5 lb because USDA lists 227 g per cup; by the stick convention it's exactly 10 cups."

### Photo
`InPagePhoto` with `four-cups`.

### Tips (exact)
- "Icing sugar, powdered sugar and confectioners sugar are the same thing: about 3 3/4 cups per pound, unsifted."
- "A pound of butter is 4 sticks, 2 cups or 32 tablespoons."
- "If you weigh flour, you don't need the cup math at all. 1 lb is 453.6 g."

### FAQ (registry `faq`, exact)
1. Q: "How many cups are in a pound?" A: "It depends on the ingredient: about 3.6 cups of flour, 2.3 cups of sugar, 3.8 cups of powdered sugar, or 2 cups of butter."
2. Q: "How many cups are in a pound of powdered sugar?" A: "About 3.78 cups (3 3/4) of unsifted powdered sugar using USDA's 120 g per cup. King Arthur's figure gives about 4 cups."
3. Q: "How many cups are in a pound of flour?" A: "About 3.63 cups of all-purpose flour using USDA, or 3.78 using King Arthur's 120 g per cup."
4. Q: "How many cups are in a pound of sugar?" A: "About 2.27 cups of granulated sugar, or about 2 1/4 cups."
5. Q: "How many cups is a pound of butter?" A: "2 cups. That's 4 US sticks or 32 tablespoons."
6. Q: "How many cups are in a 5 lb bag of flour?" A: "About 18 cups of all-purpose flour, using USDA's 125 g per cup."

Tests:
- both tables, plus the bag-size table;
- the tool defaults;
- the FAQ numbers;
- the B1/B2 equality.

---

## C. Wiring
- `/converters/` "Which tool do I need?" table, add:
  - "My recipe gives ounces and I want spoons" → Tablespoons in an ounce
  - "My recipe or bag is in pounds" → Cups in a pound
- Related lists, 4 items each, each replacing that list's last item:
  - add `/tablespoons-in-an-ounce/` to `/ounces-in-a-cup/` and `/teaspoons-in-a-tablespoon/`;
  - add `/cups-in-a-pound/` to `/cups-to-grams/` and `/butter-converter/`.
- Sitemap should list **40** URLs.
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
  - any VERIFY value changed, and why.
