# MeasuredCup: AEO/GEO fix batch (2026-10-22)

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main (last commit e2a1725).

Source: the owner's backlinks/AEO/GEO playbook, section 6 checklist, run against all 33 live pages today. All rules in `measuredcup-build-spec.md` still apply (A13 writing rules: no em dashes, no banned words).

## Checklist results

| Check | Result |
|---|---|
| Direct answers in the first lines | PASS on all 19 tool and data pages |
| FAQ schema from the page's own data | PASS: FAQPage on every page with a visible FAQ |
| WebPage schema with author (Person) + datePublished + dateModified | **FAIL on all 33 pages** (no WebPage node, no dates anywhere) |
| Real HTML tables with `<caption>` | **FAIL on 2 pages**: the "Which tool do I need?" tables on `/converters/` and `/recipe-tools/` |
| Visible sources + visible "Updated" date | PASS on tool pages. **FAIL**: the "Last updated" line is missing on `/data/ingredient-weights/`, `/data/`, `/how-we-calculate/`, `/about/`, `/converters/`, `/recipe-tools/`, `/editorial-policy/` |
| AI bots allowed in robots.txt | PASS (Cloudflare AI Crawl Control shows GPTBot, ClaudeBot, Applebot and PerplexityBot all getting 200s). Small addition below |
| IndexNow returns 200 on deploy | PASS (200 for 33 URLs) |
| Titles 30-60, descriptions 110-160, none duplicated | **FAIL**: 8 titles under 30, 4 descriptions under 110, 1 description outdated |

Also found:
- **Empty `sameAs`:** Organization and Person `sameAs` are both empty.
- **Initials, no photo:** the author box shows initials "SM" instead of a photo.
- **Leftover copy:** the author description mentions "published manufacturer charts", which looks like it came from another site's template.
- **Spoon display bug:** two mL-to-cups chart rows show "1/2 tsp + 1/4 tsp" where other rows show "2 3/4 tsp".

---

## F1. WebPage schema with author and dates (every page)

Add `datePublished` (ISO date) to `PageEntry` in `lib/data/pages.ts`. Values = the day each page went live:

| datePublished | Pages |
|---|---|
| 2026-10-14 | `/`, `/grams-to-cups/`, `/cups-to-grams/`, `/tablespoons-to-grams/`, `/butter-converter/`, `/half-a-measurement/`, `/recipe-scaler/`, `/data/ingredient-weights/`, `/data/`, `/converters/`, `/recipe-tools/`, every trust and legal page, `/sitemap/` |
| 2026-10-15 | `/tablespoons-to-cups/`, `/tablespoons-in-1-8-cup/` |
| 2026-10-16 | `/tablespoons-in-1-4-cup/`, `/grams-to-tablespoons/` |
| 2026-10-17 | `/tablespoons-in-1-3-cup/`, `/cups-in-a-quart/` |
| 2026-10-18 | `/tablespoons-in-2-3-cup/`, `/cups-in-a-gallon/` |
| 2026-10-20 | `/grams-to-ml/`, `/cups-in-a-pint/` |
| 2026-10-21 | `/cups-to-ml/`, `/ml-to-cups/` |

Add a test that every registry entry has `datePublished <= lastUpdated`.

Emit on **every page** one `WebPage` node (on the author page, the existing `ProfilePage`; on hubs, the existing `CollectionPage` gets the same fields):

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "<url>#webpage",
  "url": "<url>",
  "name": "<title without ' | MeasuredCup'>",
  "description": "<metaDescription>",
  "inLanguage": "en-US",
  "isPartOf": { "@id": "https://measuredcup.com/#website" },
  "author": { "@id": "https://measuredcup.com/authors/sikander-malik/#person" },
  "publisher": { "@id": "https://measuredcup.com/#organization" },
  "datePublished": "<datePublished>",
  "dateModified": "<lastUpdated>",
  "mainEntity": { "@id": "<url>#app" }
}
```

- `mainEntity` only on tool pages. Give the WebApplication `"@id": "<url>#app"`. On the data page, point it to the Dataset `@id`.
- Add `"@id": "https://measuredcup.com/#website"` to WebSite and `"@id": "https://measuredcup.com/#organization"` to Organization.
- Add `datePublished` and `dateModified` to the Dataset node.

Test: every page's JSON-LD has exactly one node of type WebPage, ProfilePage or CollectionPage with author, datePublished and dateModified.

## F2. Author: photo, sameAs, copy fix

- **Photo:** the file is attached as `sikander-malik-author.png` (505x502, owner-provided).
  - Process to `public/photos/sikander-malik-96.avif/.webp` and `-192.avif/.webp` (square, centered crop), plus `public/photos/sikander-malik-400.jpg` for schema.
  - Strip EXIF.
- **AuthorBox:** replace the "SM" initials circle with the photo: 40px displayed, 2x source, `alt="Sikander Malik"`, width and height set, lazy.
- **Author page:** show it at 96px next to the name.
- **Person node** (author page and wherever it's emitted) adds:
  - `"image": "https://measuredcup.com/photos/sikander-malik-400.jpg"`
  - `"sameAs": ["https://www.linkedin.com/in/sikandermalikdev"]`
  - `"worksFor": { "@id": "https://measuredcup.com/#organization" }`
- **Visible link:** on the author page, a visible "LinkedIn" link (`rel="me noopener"`, opens in a new tab) under the bio.
- **Organization `sameAs`:** `["https://www.pinterest.com/measuredcup/"]` (the MeasuredCup Pinterest profile is live). Also add a small "Pinterest" link in the footer (`rel="me noopener"`).
- **Copy fix in the author meta description**, exact replacement (150 chars): "Sikander Malik is a web developer and the founder of MeasuredCup, building its converters from USDA FoodData Central and the King Arthur weight chart." Also search the author page body for "manufacturer" and replace any matching phrase with "the King Arthur Baking weight chart". Report what you changed.

## F3. Table captions on hubs
Add `<caption>` to the "Which tool do I need?" tables on `/converters/` and `/recipe-tools/`. Text: "Which tool do I need?" (left-aligned, 14px, muted, per design spec). Remove the duplicate visual heading only if the caption replaces it; otherwise keep both.

## F4. Visible "Last updated" on content pages
Add the existing "Last updated Month D, YYYY" line (from `lastUpdated`) to `/data/ingredient-weights/`, `/data/`, `/how-we-calculate/`, `/about/`, `/converters/`, `/recipe-tools/` and `/editorial-policy/`. Place it under the H1 or in the author box, matching tool pages. On `/data/ingredient-weights/`, also make sure the visible Sources list (USDA FoodData Central SR Legacy, King Arthur Baking chart, NIST Handbook 44, each with access date) appears above the FAQ.

## F5. Titles and descriptions (exact)

Titles (all 30-60 characters):

| Page | New title | Length |
|---|---|---|
| `/data/` | Ingredient Data: Sourced Baking Weights \| MeasuredCup | 53 |
| `/about/` | About MeasuredCup: Who Builds These Converters | 46 |
| `/authors/sikander-malik/` | Sikander Malik, Founder of MeasuredCup | 38 |
| `/contact/` | Contact MeasuredCup: Report a Number or Ask | 43 |
| `/privacy/` | Privacy Policy for MeasuredCup Converters | 41 |
| `/terms/` | Terms of Use for MeasuredCup Converters | 39 |
| `/disclaimer/` | Disclaimer: How Accurate MeasuredCup Is | 39 |
| `/sitemap/` | Sitemap: Every MeasuredCup Converter Page | 41 |

Descriptions (all 110-160 characters):

| Page | New description | Length |
|---|---|---|
| `/editorial-policy/` | Who writes MeasuredCup, how each converter is built and tested against its sources, how we use AI tools, and our public corrections log. | 136 |
| `/terms/` | Plain-language terms for using MeasuredCup: free to use, no warranty, values are averages, and the license for our ingredient CSV data. | 135 |
| `/affiliate-disclosure/` | Some links on MeasuredCup may be affiliate links that earn a small commission. Affiliate relationships never change a number in our tools. | 138 |
| `/sitemap/` | Every page on MeasuredCup, grouped into kitchen converters, recipe tools, ingredient data and trust pages, with one line on each. | 129 |
| `/converters/` (outdated: lists only 4 tools) | Every MeasuredCup kitchen converter: grams, cups, spoons, mL, pints, quarts and gallons, with weights per ingredient from USDA and King Arthur. | 143 |

Extend the existing title test: titles 30-60, descriptions 110-160, no duplicates across the registry.

## F6. robots.txt: name the AI bots explicitly
They're already allowed via `*`. Add explicit `Allow: /` groups for:
- GPTBot
- ChatGPT-User
- ClaudeBot
- Claude-SearchBot
- Claude-User
- Applebot
- Google-Extended

Keep the existing groups and the Sitemap line. (`/embed/` from the embed spec must NOT be disallowed; it uses noindex instead.)

## F7. Spoon display consistency
`toKitchenMeasure` writes a leftover under 1 tsp as separate spoons ("1/2 tsp + 1/4 tsp"), but writes amounts of 1 tsp or more as a mixed number ("2 3/4 tsp"). Make leftovers under 1 tsp read as one fraction too:
- 0.75 tsp → "3/4 tsp"
- 0.375 tsp → "3/8 tsp"
- 0.625 tsp → "5/8 tsp"

"A pinch" stays for anything under 1/8 tsp.

Do NOT change the recipe scaler: its "1/4 tsp + 1/8 tsp" phrasing is intentional (it tells cooks which real spoons to use) and lives in its own formatter. Confirm that.

- Update the mL-to-cups rows: 240 mL → "1 cup + 3/4 tsp", 300 mL → "1 1/4 cups + 3/4 tsp".
- Re-run every existing test. Report any other page string that changed because of this; it should only be sub-teaspoon leftovers.

## Definition of done
- `npm test` passes (report the count), including the new schema, date, title and description tests.
- `npm run build` is clean; Lighthouse mobile is still ≥95 on home, `/grams-to-cups/` and `/authors/sikander-malik/`, with CLS 0 (the author photo must not shift layout).
- Rich Results Test on `/grams-to-cups/` still shows valid Breadcrumbs, Organization, Software app and FAQ.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - Lighthouse for those 3 pages;
  - the IndexNow status line;
  - the strings changed by F7;
  - the author-page copy changes from F2.
