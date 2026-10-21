# MeasuredCup daily work: 2026-10-21

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit 2e7ae42).

Today's audit: all 31 pages return 200, with 0 broken links, 0 orphans, 0 title or description issues. **No fixes today.** Two new pages.

All rules in `measuredcup-build-spec.md` still apply:
- A5 page order;
- A13 writing rules (no em dashes, no banned words);
- design system;
- registry-driven sitemap, hubs, related links, llms.txt and IndexNow;
- titles ≤60.

No number-variant pages (no `/100-ml-to-cups/` etc.; the charts cover those).

| # | Slug | Main keyword | Why |
|---|---|---|---|
| 1 | `/cups-to-ml/` | cups to ml / cup to ml (18,100, KD 41) | Calculator sites lead, but my-kitchengadgets.com (DA 15) and checkyourmath.com (DA 37) are on page 1 |
| 2 | `/ml-to-cups/` | ml to cups (40,500, KD 48) | gramstocups.io (DA 11), ezrecipecalc.com (**DA 1**) and thecustomizeboxes.com (DA 31) are on page 1 |

**Angle for both:** "which cup?". A US cup is 236.6 mL, US nutrition labels use a 240 mL cup, and UK, Australian and Canadian recipes use a 250 mL metric cup. Calculator sites give one number and skip this. Both pages share one tool with a cup-type selector.

---

## B0. Shared: `CupsMlTool({ direction: 'cupsToMl' | 'mlToCups' })`

New constant: `ML_PER_METRIC_CUP = 250`. `ML_PER_LEGAL_CUP = 240` already exists.

Inputs:
- **Amount:** text, fractions allowed via `parseAmount`.
  - Default `1` (cups) for cups to mL.
  - Default `250` (mL) for mL to cups.
- **Cup type:** segmented control, US cup (236.6 mL) | US label cup (240 mL) | Metric cup (250 mL). Default US cup.
- **Swap direction:** a small link to the other page.

### Result for cups to mL
- big number = mL (1 dp under 1,000, whole with a comma at 1,000+);
- line 2 = "= X tbsp · Y fl oz (US)";
- line 3 = "Same amount in other cups: [label cup mL] · [metric cup mL]".

Default: 1 US cup → **236.6 mL**, 16 tbsp, 8 fl oz; label 240.0, metric 250.0.

### Result for mL to cups
- big number = cups `trimDecimal(x, 3)`;
- line 2 = `toKitchenMeasure(cups)` (US cup only; hide for other cup types);
- line 3 = "= X tbsp · Y fl oz".

Default: 250 mL, US cup → **1.057 cups**, line 2 = whatever `toKitchenMeasure(1.0567)` returns (report it), 16.9 tbsp, 8.45 fl oz.

"Show the math":
- `1 × 236.6 = 236.6 mL`
- `250 ÷ 236.6 = 1.057 cups`

Fire `tool_used` with `{tool:'cups-to-ml'}` or `{tool:'ml-to-cups'}`.

Shared section on both pages, "Which cup does your recipe use?" (exact):
"A US cup in a recipe is 236.6 mL, defined in US customary units. US nutrition labels round it to 240 mL. UK, Australian, New Zealand and Canadian recipes usually mean a metric cup of 250 mL, about 6% more than a US cup. Older Japanese recipes may use a 200 mL cup. If a recipe comes from outside the US, switch the cup type above."

Shared table, caption "Cup sizes compared":

| Cup | mL | vs US cup |
|---|---|---|
| US customary cup | 236.6 | - |
| US nutrition label cup | 240 | +1.4% |
| Metric cup (UK, AU, NZ, CA) | 250 | +5.7% |
| Japanese cup | 200 | -15.5% |

Generate from constants (add `ML_PER_JAPANESE_CUP = 200`, table only, not in the selector).

---

## B1. `/cups-to-ml/`

### Registry entry
- title: `Cups to mL Converter (US and Metric Cups) | MeasuredCup` (55)
- metaDescription: `1 US cup is 236.6 mL, a nutrition-label cup is 240 mL and a metric cup is 250 mL. Convert any cup amount to milliliters, with a chart from 1/8 cup to 4 cups.`
- h1: `Cups to mL Converter`
- kind `tool`, category `converters`, tileLine `US, label and metric cups to mL`
- related: `['/ml-to-cups/', '/grams-to-ml/', '/cups-in-a-quart/', '/tablespoons-to-cups/']`
- sources: nist
- photoId: `four-cups`
- lastUpdated `2026-10-21`

### Quick answer (exact)
"1 US cup is 236.6 mL, so multiply cups by 236.6 to get milliliters. 1/2 cup is 118.3 mL and 1/4 cup is 59.1 mL. If your recipe is from the UK, Australia or Canada it probably uses a 250 mL metric cup, so 1 cup there is 250 mL."

### How to use (exact)
1. Type the cup amount. Fractions like 2/3 or 1 1/2 work.
2. Pick the cup type. Leave it on US cup for American recipes.
3. Read the milliliters, plus tablespoons and fluid ounces.

### The formula and two worked examples (exact)
Formula box: `mL = cups × 236.6 (US cup)` and `mL = cups × 250 (metric cup)`

- "3/4 cup of milk. 0.75 × 236.6 = 177.4 mL. With an Australian 250 mL cup it would be 187.5 mL."
- "2 1/2 cups of stock. 2.5 × 236.6 = 591.5 mL, a little over half a liter."

### What this tool doesn't cover (exact)
"It converts volume only. A cup of flour and a cup of honey are both 236.6 mL but weigh very different amounts; use cups to grams for weight. It doesn't cover UK imperial cups from old British cookbooks (about 284 mL)."

### Reference table
Caption "Cups to mL chart": columns Cups | US cup (mL) | Label cup (mL) | Metric cup (mL).

VERIFY:

| Cups | US | Label | Metric |
|---|---|---|---|
| 1/8 | 29.6 | 30.0 | 31.3 |
| 1/4 | 59.1 | 60.0 | 62.5 |
| 1/3 | 78.9 | 80.0 | 83.3 |
| 1/2 | 118.3 | 120.0 | 125.0 |
| 2/3 | 157.7 | 160.0 | 166.7 |
| 3/4 | 177.4 | 180.0 | 187.5 |
| 1 | 236.6 | 240.0 | 250.0 |
| 1 1/2 | 354.9 | 360.0 | 375.0 |
| 2 | 473.2 | 480.0 | 500.0 |
| 3 | 709.8 | 720.0 | 750.0 |
| 4 | 946.4 | 960.0 | 1,000 |

Plus the shared "Cup sizes compared" table.

### Photo
`four-cups`.

### Tips (exact)
- "For liquids, a jug marked in mL is more accurate than filling a cup to the brim."
- "4 US cups is 946 mL, a little under a liter. 4 metric cups is exactly 1 liter."
- "When a recipe gives both cups and grams, trust the grams."

### FAQ (exact)
1. Q: "How many mL is 1 cup?" A: "236.6 mL for a US cup. A US nutrition label cup is 240 mL, and a metric cup used in the UK, Australia and Canada is 250 mL."
2. Q: "How many mL is 1/2 cup?" A: "118.3 mL in US cups, or 125 mL with a metric cup."
3. Q: "How many mL is 1/4 cup?" A: "59.1 mL in US cups, or 62.5 mL with a metric cup."
4. Q: "Is a cup 250 mL or 240 mL?" A: "Neither, in a US recipe: a US cup is 236.6 mL. 240 mL is the rounded cup on US nutrition labels, and 250 mL is the metric cup used in the UK, Australia and Canada."
5. Q: "How many mL is 1 cup of water?" A: "236.6 mL in a US cup, which weighs about 237 g."
6. Q: "How many cups is 1 liter?" A: "About 4.23 US cups, or exactly 4 metric cups."

---

## B2. `/ml-to-cups/`

### Registry entry
- title: `mL to Cups Converter (US and Metric Cups) | MeasuredCup` (55)
- metaDescription: `Convert milliliters to cups. 250 mL is 1.06 US cups or exactly 1 metric cup, and 100 mL is about 0.42 US cups. Chart from 30 mL to 1 liter.`
- h1: `mL to Cups Converter`
- kind `tool`, category `converters`, tileLine `Milliliters to US and metric cups`
- related: `['/cups-to-ml/', '/grams-to-ml/', '/cups-in-a-quart/', '/tablespoons-to-cups/']`
- sources: nist
- photoId: `copper-cups-paper`
- lastUpdated `2026-10-21`

### Quick answer (exact)
"Divide milliliters by 236.6 to get US cups. 250 mL is 1.06 US cups, 100 mL is about 0.42 cups and 500 mL is 2.11 cups. With a metric cup it's simpler: divide by 250, so 250 mL is exactly 1 cup."

### How to use (exact)
1. Type the milliliters.
2. Pick the cup type you'll measure with.
3. Read the cups, then the cup-and-spoon combination to measure with.

### The formula and two worked examples (exact)
Formula box: `cups = mL ÷ 236.6 (US cup)` and `cups = mL ÷ 250 (metric cup)`

- "200 mL of milk. 200 ÷ 236.6 = 0.845 US cups, which is 3/4 cup plus about 1 1/2 tablespoons. In metric cups it's 0.8 cups."
- "A 500 mL carton of cream. 500 ÷ 236.6 = 2.11 US cups, so just over 2 cups."

Before shipping, check the "3/4 cup plus about 1 1/2 tablespoons" phrasing against `toKitchenMeasure(0.8453)` and report the actual string. If it differs, use the function's wording in this sentence.

### What this tool doesn't cover (exact)
"It converts volume only. 100 mL of flour and 100 mL of honey weigh very different amounts; use grams to mL with the ingredient for weight. Spoon-sized amounts under 30 mL are easier in tablespoons: 15 mL is 1 tablespoon."

### Reference table
Caption "mL to cups chart": columns mL | US cups | Measure with (US) | Metric cups.
- Rows: 30, 50, 60, 100, 120, 150, 200, 240, 250, 300, 500, 750, 1000.
- US cups `trimDecimal(x, 3)`; Measure with = `toKitchenMeasure`; Metric cups `trimDecimal(mL/250, 3)`.

VERIFY:

| mL | US cups | Metric cups |
|---|---|---|
| 30 | 0.127 | 0.12 |
| 50 | 0.211 | 0.2 |
| 60 | 0.254 | 0.24 |
| 100 | 0.423 | 0.4 |
| 120 | 0.507 | 0.48 |
| 150 | 0.634 | 0.6 |
| 200 | 0.845 | 0.8 |
| 240 | 1.014 | 0.96 |
| 250 | 1.057 | 1 |
| 300 | 1.268 | 1.2 |
| 500 | 2.113 | 2 |
| 750 | 3.17 | 3 |
| 1000 | 4.227 | 4 |

Report the 13 "Measure with" strings in your reply so I can check them.

Plus the shared "Cup sizes compared" table.

### Photo
`copper-cups-paper`.

### Tips (exact)
- "15 mL is 1 US tablespoon and 5 mL is 1 teaspoon, close enough for any recipe."
- "A 250 mL measuring cup from Australia or the UK holds about 1 tablespoon more than a US cup."
- "For drinks and soups, 240 mL and 250 mL are interchangeable. For baking, use the cup your recipe was written for."

### FAQ (exact)
1. Q: "How many cups is 250 mL?" A: "1.06 US cups, or exactly 1 metric cup. In US measures that's 1 cup plus about 1 tablespoon."
2. Q: "How many cups is 100 mL?" A: "About 0.42 US cups, a little less than 1/2 cup. That's 6.8 tablespoons."
3. Q: "How many cups is 500 mL?" A: "About 2.11 US cups, or exactly 2 metric cups."
4. Q: "How many cups is 200 mL of milk?" A: "About 0.85 US cups, or 0.8 metric cups."
5. Q: "How many mL is a tablespoon?" A: "14.8 mL for a US tablespoon, usually rounded to 15 mL. A teaspoon is 4.9 mL, rounded to 5 mL."
6. Q: "How many cups are in a liter?" A: "4.23 US cups, or 4 metric cups."

Tests:
- every VERIFY cell on both pages;
- FAQ numbers: 250 mL = 1.057 US cups = 16.9 tbsp, so "1 cup plus about 1 tablespoon" is valid because 16.9 tbsp - 16 = 0.9 tbsp; 100 mL = 6.76 tbsp ("6.8");
- the cup-sizes table percentages: 240/236.588 = +1.44%, 250/236.588 = +5.67%, 200/236.588 = -15.46%;
- tool defaults.

---

## C. Wiring
- `/converters/` "Which tool do I need?" table, add:
  - "I have cups and need milliliters" → Cups to mL
  - "I have milliliters and need cups" → mL to cups
- Related lists, keep 4 items each:
  - add `/ml-to-cups/` to `/grams-to-ml/` and `/cups-in-a-quart/`;
  - add `/cups-to-ml/` to `/cups-to-grams/` and `/tablespoons-to-cups/`.
- Sitemap should list 33 URLs.
- Schema on both: WebApplication + BreadcrumbList + FAQPage, no rating.

## D. Definition of done
- `npm test` passes. Report the count.
- `npm run build` is clean. Lighthouse mobile ≥95 and CLS 0 on both new pages.
- No em dashes or banned words; titles ≤60.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse for both new pages;
  - the IndexNow status line;
  - the `toKitchenMeasure` strings for the 13 chart rows and for 0.8453 and 1.0567;
  - any VERIFY value changed, and why.
