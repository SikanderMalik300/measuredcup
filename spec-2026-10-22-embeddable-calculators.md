# MeasuredCup: embeddable calculators (2026-10-22)

From: browser agent. For: coding agent. Repo: SikanderMalik300/measuredcup, branch main. Build after (or together with) `spec-2026-10-22-aeo-geo-fixes.md`.

Goal: free, light embed versions of our best tools that bakers and food bloggers can put on their own sites. Every embed comes with a normal credit link to us. That's the main way tool sites earn links without endless outreach (playbook section 4.1).

## Which tools (4)

Chosen by Search Console impressions so far, and by what recipe bloggers actually need next to a recipe:

| Embed slug | Tool | Why |
|---|---|---|
| `/embed/grams-to-cups/` | GramsToCupsTool | Flagship. Every baking blog with gram recipes needs it |
| `/embed/tablespoons-to-grams/` | TablespoonsToGramsTool | Our most-shown page in Google (321 impressions) |
| `/embed/butter-converter/` | ButterConverterTool | Sticks vs grams is the #1 question on international recipes (229 impressions, "butter converter" already at position 9.8) |
| `/embed/recipe-scaler/` | RecipeScalerTool | Bloggers love "scale this recipe" next to their ingredient list |

## E1. Embed pages: `/embed/<slug>/`
- Render **only** the tool panel and its result card. No header, footer, ads, photos, FAQ, author box, analytics or cookie banner.
- Keep the Figtree font, the colors and the 16px side padding. Transparent-safe white background.
- Add an `embed` prop to each tool (or a wrapper context) that:
  - hides the Share and Print buttons (Copy stays);
  - turns off `localStorage` remembered choices;
  - skips `track()` calls.
- Inside the iframe, one muted line under the result (exact): "Free converter by MeasuredCup". "MeasuredCup" links to the full tool page (`https://measuredcup.com/<slug>/`) with `target="_blank" rel="noopener"`.
- `<meta name="robots" content="noindex, follow">` plus `X-Robots-Tag: noindex` for `/embed/*` in `public/_headers`. Do NOT disallow `/embed/` in robots.txt; Google must be able to see the noindex.
- Keep `/embed/*` out of `sitemap.xml`, `llms.txt`, hubs, related links and IndexNow.
- **Headers for `/embed/*` only:** `Content-Security-Policy: frame-ancestors *` and no X-Frame-Options. Other pages keep their current headers.
- **Canonical:** `<link rel="canonical">` points to the full tool page.
- **Budget:** ≤60 KB JS for the embed page, no external requests, CLS 0, Lighthouse mobile ≥95.
- **Auto-height:** the embed posts its height to the parent with `window.parent.postMessage({ measuredcup: 'height', slug, height }, '*')` on load and on every resize, using a ResizeObserver on the panel.

## E2. Optional resize script: `/embed.js`
- About 1 KB, no dependencies.
- It listens for the `measuredcup` height message and sets the height of any `iframe[data-measuredcup]` whose `src` matches the slug.
- Cache-friendly headers: `Cache-Control: public, max-age=86400`.
- The snippet works without it, at a fixed height.

## E3. "Get this calculator for your site" box (on each of the 4 tool pages)
- **Placement:** directly after "What this tool doesn't cover". It's a `<details>` element, closed by default, so it adds no layout shift.
- **Summary text (exact):** "Get this calculator for your site"
- **Body text (exact):** "Free to use on any website or blog. Paste this code where you want the calculator. It loads fast, has no ads or tracking, and stays up to date."
- **Code box:** read-only `<textarea>` containing the snippet below, plus a "Copy code" button (uses the existing copy pattern; fires `track('embed_copy', {slug})` on the main page only).
- **Preview link:** "Preview the embed" opens `/embed/<slug>/` in a new tab.

Snippet (exact shape; fill slug, title and height):

```html
<iframe src="https://measuredcup.com/embed/grams-to-cups/" title="Grams to cups converter" data-measuredcup width="100%" height="560" style="border:0;max-width:640px;width:100%" loading="lazy"></iframe>
<p style="font:13px/1.4 sans-serif;margin:4px 0 0">Grams to cups converter by <a href="https://measuredcup.com/grams-to-cups/">MeasuredCup</a></p>
<script src="https://measuredcup.com/embed.js" async></script>
```

- The credit `<p>` is **outside** the iframe, a plain followed link with descriptive anchor text. This is the link that counts.
- **Default heights:** measure each tool's default state at 390px wide, add 24px, round up to a multiple of 20. Report the four numbers.

## E4. Landing page: `/free-kitchen-calculators-for-your-site/` (indexable, the outreach target)

**Registry entry:**
- title: `Free Kitchen Calculators for Your Website | MeasuredCup` (55)
- metaDescription: `Add a free grams to cups, butter, tablespoon or recipe scaler calculator to your blog. Copy one line of code. No ads, no tracking, no sign-up.` (141)
- h1: `Free kitchen calculators for your website`
- kind `hub`, category none (link it from the footer "Tools" column and from `/converters/`)
- lastUpdated and datePublished: today

**Intro (exact):** "Run a baking blog, a cooking class page or a recipe site? Add any of these converters to your pages for free. Each one uses the same sourced USDA and King Arthur data as MeasuredCup, loads fast, and has no ads or tracking."

**For each of the 4 tools, a section:**
- H2 with the tool name;
- one-line description (reuse tileLine);
- a live iframe preview (lazy) with the snippet box and Copy button below it;
- a link to the full tool.

**Section "Terms" (exact):** "Free for personal and commercial sites. Please keep the credit line under the calculator. Don't put the calculator behind a paywall, and don't change the numbers it shows. If something breaks, email hello@measuredcup.com."

**Schema:** WebPage (with author and dates, per F1) + BreadcrumbList. No FAQ.

## Tests
- Each `/embed/*` page:
  - has noindex;
  - has a canonical to its tool page;
  - is not in the sitemap;
  - makes no requests to Google Analytics (assert no gtag script).
- The tool pages' `<details>` snippets match the exact shape above and contain the correct slug.
- The landing page is in the sitemap and in `/converters/`.

## Definition of done
- `npm test` passes and `npm run build` is clean.
- Lighthouse mobile ≥95 on the landing page and on one embed page, CLS 0.
- Manually test one embed inside a plain local HTML file (iframe + script): it auto-resizes and the credit link works.
- Push to main. Reply with:
  - the commit hash;
  - the test count;
  - the four default heights;
  - Lighthouse for the landing page and `/embed/grams-to-cups/`;
  - the IndexNow status line.
