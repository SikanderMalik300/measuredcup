# MeasuredCup.com design system

Date: 2026-10-14. Written by: browser agent. Scope: whole site (home, hubs, tool pages, data page, trust pages).
Goal: a calm, trustworthy independent publisher. White canvas, real kitchen photos, one modern font, soft warm bands. It must never look like a generic AI-made site.

Design references to borrow patterns from (patterns only, never code, copy, logos or photos): King Arthur Baking ingredient chart (clean tables), Serious Eats (calm type, white space), Rapha or Aesop style split heroes (color block + one real photo). Log screenshots in the Design references tab.

## 1. Logo and favicon

Files from the browser agent (in `measuredcup-logo/`): `logo.svg` (horizontal), `logo-mark.svg` (mark only), `favicon-square.svg` (terracotta square, white mark).
- Convert the `<text>` wordmark in `logo.svg` to outlined paths using Figtree 600 so it renders without the web font.
- Header logo height 28px mobile, 32px desktop.
- Generate `favicon.ico` (48x48), `icon.svg`, `apple-touch-icon.png` (180x180), `logo-512.png` (512x512, for Organization schema) from the SVGs.

## 2. Typography

- Font: **Figtree** via `next/font/google`, `display: 'swap'`, `subsets: ['latin']`, weights 400, 500, 600 only.
- Scale:
  - H1: 40px / 500 desktop, 30px mobile, line-height 1.15, letter-spacing -0.01em
  - H2: 28px / 500 desktop, 24px mobile
  - H3: 20px / 500
  - Tile and card names: 16px / 500
  - Body: 16px / 400, line-height 1.6, max line length 70 characters
  - Small text, captions, dates: 14px (never under 12px)
- Result numbers, tables and the ingredient table use `font-variant-numeric: tabular-nums`. Key result number weight 600.
- No bold (700+) anywhere. Sentence case headings.

## 3. Color tokens (exact)

| Token | Hex | Use |
|---|---|---|
| `--bg` | #FFFFFF | Page background |
| `--surface` | #FFFFFF | Cards, inputs |
| `--ink` | #1C1A17 | Headings and body |
| `--muted` | #5A544D | Descriptions, dates, captions |
| `--line` | #E6E1DA | Borders and table rows |
| `--brand` | #9A4A2E | Links, buttons, focus rings, arrows (deep terracotta) |
| `--brand-hover` | #7E3B24 | Hover on buttons and links |
| `--band-1` | #F4EEE4 | Hero block and "Kitchen converters" band (oat) |
| `--band-2` | #EDF1E8 | "Recipe tools" band (sage) |
| `--band-3` | #F8EEE7 | Data and trust callouts (blush) |
| `--paper` | #F7F5F1 | "Popular answers" band |

Measured contrast (WCAG): ink on white 17.36, on bands 15.04 to 15.95. Muted on white 7.47, on bands 6.48 to 6.86. Brand on white 6.19, on bands 5.36 to 5.68. White text on brand 6.19. All pass AA. The coding agent re-measures and reports.
No dark mode at launch.

## 4. Layout, spacing, shape

- 8px grid. Container max 1200px; side padding 16px mobile, 24px tablet, 40px desktop.
- Section spacing 64px desktop, 40px mobile. Bands are full width, content inside the container.
- Radius: 4px photos, 16px cards, tables and tool panels, 999px pills (search, chips, segmented controls, buttons).
- Borders: 1px `--line` on all four sides of cards. Shadow at most `0 1px 2px rgba(0,0,0,.04)`, only on the tool panel.

## 5. Components

- **Header**: logo left; links "Converters", "Recipe tools", "Ingredient data", "About"; search icon opening the site search. White, 1px bottom line, not sticky. On mobile a menu button opens a simple full-width list (no mega menu).
- **Footer**: three columns: Tools (all tool links), Trust (About, How we calculate, Editorial policy, Contact), Legal (Privacy, Terms, Disclaimer, Affiliate disclosure, Sitemap). Under it: "MeasuredCup by Sikander Malik · hello@measuredcup.com" and "Values are averages for typical US products." Muted text on `--paper`.
- **Hero (home)**: split. Left color block `--band-1` about 55% width with H1, intro, search pill and chips, padding 64px. Right: one real photo (see photos file, slot `hero`) about 45%, full hero height 440px, edge to edge, no radius. Mobile (<768px): color block first (H1 is the LCP element), photo below at 4:3, max 220px tall, lazy loaded.
- **Search**: pill 48px tall, 16px text, white, 1px line border, magnifier icon left, `aria-label="Search tools and ingredients"`. Filters tiles and an ingredient list client-side; results region `aria-live="polite"`. Without JS all tiles stay visible.
- **Chips**: pills 36px tall with 44px touch area, white, 1px border, 14px / 500. Max 2 lines on mobile.
- **Photo tile** (one shared component): whole tile is one link. Photo 1:1, radius 4px, `object-fit: cover` with focal point. Name 16px / 500 + 16px inline arrow; one muted 14px line below. Hover: photo scale 1.02 over 200ms inside `overflow:hidden`, name underlines. Focus: 2px brand ring, 2px offset. 4 per row desktop, 2 per row mobile.
- **Answer card**: white, 1px border, radius 16, padding 24px; big value 22px / 600; one sentence; one link.
- **Tool panel** (the heart of the site):
  - White card, 1px border, radius 16, padding 24px desktop, 16px mobile.
  - Labels above fields (14px / 500 muted). Inputs 48px tall, 16px text, `inputMode="decimal"` for numbers; text input for fractions.
  - Ingredient picker: searchable combobox with grouped options; recent choice remembered in `localStorage` (wrapped in try/catch).
  - Data source: segmented pill "USDA | King Arthur".
  - Result card directly below inputs, `--band-1` background, radius 16: big number 34px / 600 tabular, unit after it in 20px / 500, kitchen-measure line 16px, source line 14px muted. Buttons row: Show the math (text button, expands), Copy, Share, Print (secondary buttons, 40px, 44px touch area).
  - Mobile: when the result card scrolls out of view, a slim sticky bar at the bottom shows the result and a "Back to tool" link (reserve its height to avoid layout shift).
  - Default values pre-filled so a result shows on load.
- **Tables**: full width inside a horizontal-scroll wrapper on mobile; `<caption>` 14px muted left-aligned; header row 14px / 500 muted on white; 1px row lines; no zebra stripes; numbers right-aligned, tabular. Ingredient data table: sortable headers with a small chevron, keyboard accessible.
- **FAQ**: accordion with plus/minus line icon; answers in the HTML.
- **Author box**: initials circle "SM" (40px, `--band-3` background, brand text) until a real photo exists; name links to author page; line "Founder, builds MeasuredCup's converters"; "Last updated Month D, YYYY"; link "Editorial policy".
- **Breadcrumbs**: 14px muted, "/" separators, identical to BreadcrumbList.
- **Buttons**: primary brand background, white text, radius 999, 44px; secondary white with 1px border. Hover darkens to `--brand-hover`.
- **Icons**: Lucide only, 1.5px stroke, 16 to 20px, for search, arrow-right, copy, share, printer, chevrons, plus/minus, menu. Never emoji.
- **Ad slots** (inactive at launch): reserved-height boxes with no border and no "ad" styling, only in the positions allowed by the build spec.

## 6. Motion

- Only hover and focus transitions, 150 to 200ms ease-out.
- `prefers-reduced-motion: reduce` turns off the tile scale and all transitions.
- Results update instantly as the user types (150ms debounce), no spinners, CLS 0.

## 7. Photos

All photo choices, credits, alt text and focal points are in `measuredcup-photos.md`. Rules:
- Real photographs only (Unsplash License or Pexels License, checked by the browser agent), no AI images, no illustrations, no emoji.
- Serve `<picture>` with AVIF, WebP and JPEG fallback; explicit width and height; correct `sizes`.
- Widths: tiles 300 and 600px; hero 640 and 1280px. AVIF quality about 60, WebP about 75. Strip EXIF. Crop to the focal point.
- Budgets: each tile at most 35 KB (600px AVIF); hero at most 120 KB (AVIF); homepage first-load image bytes on mobile at most 150 KB.
- Desktop hero `fetchpriority="high"`, not lazy. Everything below the fold `loading="lazy" decoding="async"`.
- Store each photo in `lib/data/photos.ts` (`id, file, sourceUrl, photographer, photographerUrl, source, license, alt, focalX, focalY, usedOn`). Hero caption "Photo: Name / Unsplash" (12px muted) and a "Photo credits" section at the bottom of the homepage are generated from it.
- Tool pages have no hero photo. They show one 16:9 photo (max 720px wide, lazy) between the reference table and the tips, from their photo slot.

## 8. Page layouts

- **Home**: header → hero (split) with caption → Most used (white, 4 tiles) → Kitchen converters band (`--band-1`, H2 + "View all" + intro + 4 tiles) → Recipe tools band (`--band-2`, H2 + "View all" + intro + 2 tiles) → Popular answers (`--paper`, 3 answer cards) → Why trust these numbers (white, 3 columns, no icons) → Latest updates (rows: title left, date right, 1px lines) → Photo credits → footer.
- **Hub**: breadcrumbs → H1 → intro → "Which tool do I need?" table → tiles → FAQ → footer.
- **Tool page**: the A5 order in the build spec. Desktop: main column max 760px with the tool panel; right sidebar 300px (sticky only on desktop) with "Related tools" and a reserved ad slot. Mobile: single column, tool directly under the quick answer.
- **Data page**: H1 → quick answer → download button → full-width sortable table → method sections → FAQ.
- **Trust pages**: single column max 720px.

## 9. Never use

Gradients, purple or neon colors, glowing shadows, glassmorphism, blurred blobs; emoji anywhere; sparkle, rocket, wand or robot icons; icon-in-a-circle feature grids; AI-generated, 3D or illustrated images; cartoon mascots; "Welcome to MeasuredCup" heroes; three identical feature cards as the hero; left-border accent cards; zebra stripes; heavy shadows; carousels, sliders, autoplay, animated counters, parallax; fake testimonials, ratings, "as seen on" logos, user counts; too many colors or badges; everything centered; ALL CAPS paragraphs; bold everywhere; em dashes in any site text; extra third-party scripts beyond analytics and (later) ads.

## 10. Accessibility

WCAG 2.2 AA contrast (section 3). Visible 2px brand focus ring with 2px offset on every link, chip, button, input and table header. Touch targets at least 44 x 44px. Every input has a visible label. Result areas `aria-live="polite"`. Each tile is a single link with descriptive text. Alt text on every photo. Reduced motion respected. Tables have captions and scoped headers. Skip-to-content link.

## 11. Design QA (part of the Definition of Done)

- Screenshots at 360, 390, 768, 1280px of home, one hub, one tool page, the data page.
- No horizontal page scroll at any width; tables scroll inside their wrapper.
- Chips wrap to at most 2 lines; no text over photos; photos sharp, correctly cropped, credited.
- Focus rings visible when tabbing through everything; touch targets at least 44px.
- PageSpeed mobile: home at least 95, tools at least 90, CLS 0, LCP under 2.5 s with the H1 or intro as the LCP element.
- Contrast ratios re-measured and reported.
- Nothing from section 9 appears anywhere.
