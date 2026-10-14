// Tell IndexNow (Bing and partner engines) about every canonical URL after a deploy.
// Reads the built out/sitemap.xml so the URL list always matches app/sitemap.ts.
// Logs the status and never fails the run on a non-200.

import fs from 'node:fs';
import path from 'node:path';

const KEY = '284215c19899ef7edb6a28413a150897';
const HOST = 'measuredcup.com';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITEMAP = path.join(process.cwd(), 'out', 'sitemap.xml');

async function main() {
  if (!fs.existsSync(SITEMAP)) {
    console.log(`IndexNow status skipped: ${SITEMAP} not found (run npm run build first)`);
    return;
  }
  const xml = fs.readFileSync(SITEMAP, 'utf8');
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  if (urlList.length === 0) {
    console.log('IndexNow status skipped: no URLs found in sitemap');
    return;
  }

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  };

  let status = 0;
  let text = '';
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    status = res.status;
    text = await res.text().catch(() => '');
  } catch (e) {
    console.log(`IndexNow status error: request failed (${e.message}) for ${urlList.length} URLs`);
    return;
  }

  // First log line carries the status code (per the task's reporting requirement).
  console.log(`IndexNow status ${status} for ${urlList.length} URLs`);
  if (text.trim()) console.log(text.trim());
}

main().catch((e) => {
  console.log(`IndexNow status error: ${e.message}`);
  // Never fail the workflow on a non-200 or transient error.
  process.exit(0);
});
