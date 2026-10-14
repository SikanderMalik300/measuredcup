import { SITE_URL, SITE_NAME } from '@/lib/data/site';
import { toolPages, getPage } from '@/lib/data/pages';

export const dynamic = 'force-static';

export function GET() {
  const tools = [...toolPages(), getPage('/data/ingredient-weights/')];
  const lines = [
    `# ${SITE_NAME}`,
    '',
    'Free kitchen and baking measurement converters, backed by a public, sourced ingredient-weight dataset (USDA FoodData Central and King Arthur Baking).',
    '',
    '## Tools',
    ...tools.map((t) => `- ${t.h1}: ${SITE_URL}${t.slug}`),
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
