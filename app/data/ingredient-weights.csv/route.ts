import { ingredientCsv } from '@/lib/calc/tables';

export const dynamic = 'force-static';

export function GET() {
  return new Response(ingredientCsv(), {
    headers: { 'content-type': 'text/csv; charset=utf-8' },
  });
}
