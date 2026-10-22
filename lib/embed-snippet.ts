import { SITE_URL } from '@/lib/data/site';
import { getEmbed } from '@/lib/data/embeds';

// The exact snippet shape bloggers paste. Used by the EmbedBox on tool pages and the landing page.
export function embedSnippet(slug: string): string {
  const { title, height } = getEmbed(slug);
  const embedUrl = `${SITE_URL}/embed${slug}`;
  const toolUrl = `${SITE_URL}${slug}`;
  return `<iframe src="${embedUrl}" title="${title}" data-measuredcup width="100%" height="${height}" style="border:0;max-width:640px;width:100%" loading="lazy"></iframe>
<p style="font:13px/1.4 sans-serif;margin:4px 0 0">${title} by <a href="${toolUrl}">MeasuredCup</a></p>
<script src="${SITE_URL}/embed.js" async></script>`;
}
