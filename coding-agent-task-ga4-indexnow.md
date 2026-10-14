# Coding agent task: GA4 + IndexNow (MeasuredCup)

Date: 2026-10-14. From: browser agent. Repo: SikanderMalik300/measuredcup, branch main.
Live site: https://measuredcup.com (Cloudflare Pages, auto-deploys on push).

Already done by the browser agent:
- Cloudflare Pages env var `NEXT_PUBLIC_GA_ID=G-HNDJD833GP` (GA4 property "MeasuredCup", stream "MeasuredCup web").
- Env vars `NEXT_PUBLIC_WEB3FORMS_KEY` and `NODE_VERSION=22` are set.
- Search Console and Bing Webmaster are verified, and the sitemap is submitted to both.

## 1. GA4 (build spec A1/A10 rules)

- Load gtag only when `process.env.NEXT_PUBLIC_GA_ID` is set. Use `next/script` with `strategy="lazyOnload"` in `app/layout.tsx`.
- Before `gtag('js', ...)`, set Consent Mode v2 defaults. The site targets the US, so analytics is granted and ads are denied until AdSense is added:
  ```js
  gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
  ```
- Keep `lib/analytics.ts` as is. It already calls `window.gtag` when present. Fire `tool_used` events from the tools if they aren't already wired.
- The privacy page already switches its text on `NEXT_PUBLIC_GA_ID`. Check that it now shows the GA section.
- Budgets must hold:
  - PageSpeed mobile is currently 100 on home and on /grams-to-cups/; keep it at 95 or above.
  - CLS 0.
  - No other third-party scripts.

## 2. IndexNow

- Key: `284215c19899ef7edb6a28413a150897`
- Add `public/284215c19899ef7edb6a28413a150897.txt` containing exactly that key (no newline is safest).
- Add `scripts/indexnow.mjs`:
  - read `out/sitemap.xml` (or build the URL list from the same source as `app/sitemap.ts`);
  - POST `https://api.indexnow.org/indexnow` with JSON `{host:"measuredcup.com", key, keyLocation:"https://measuredcup.com/<key>.txt", urlList}`.
- Add `.github/workflows/indexnow.yml`:
  - trigger on push to main;
  - wait about 3 minutes for the Cloudflare deploy;
  - then run the script (Node 22, `npm ci`, `npm run build`, `node scripts/indexnow.mjs`).
  - The script must log the status and must not fail the workflow on non-200.
- Note: Cloudflare Crawler Hints is also on. That's fine; it's harmless to keep both.

## 3. Small design polish (desktop only)

At 1280–1920px, the hero photo panel is narrower than the right side of the hero and shorter than the oat colour block. There's white space to its right and the caption sits under it.

Per design spec section 5, make the photo fill the right ~45% edge to edge at the full hero height (440px), with the caption overlaid at the bottom or placed under the hero inside the container. Mobile is fine as is.

## Definition of done

- `npm test` and `npm run build` pass.
- Push to main.
- Reply with:
  - the commit hash;
  - `curl -s https://measuredcup.com/284215c19899ef7edb6a28413a150897.txt` output;
  - the first IndexNow workflow log line with the status code.
