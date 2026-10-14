'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { INGREDIENTS, differencePercentExact } from '@/lib/data/ingredients';
import { formatGrams } from '@/lib/calc/round';

type Key = 'name' | 'usdaCup' | 'usdaTbsp' | 'usdaTsp' | 'ka' | 'diff';

interface Row {
  name: string;
  usdaCup: number;
  usdaTbsp: number;
  usdaTsp: number;
  ka: number | null;
  diff: number | null;
  fdcId: number;
  portion: string;
}

const ROWS: Row[] = INGREDIENTS.map((i) => ({
  name: i.name,
  usdaCup: i.usdaGramsPerCup,
  usdaTbsp: i.usdaGramsPerCup / 16,
  usdaTsp: i.usdaGramsPerCup / 48,
  ka: i.kaGramsPerCup,
  diff: differencePercentExact(i),
  fdcId: i.usdaFdcId,
  portion: i.usdaPortionText,
}));

const th = 'px-3 py-2 text-small font-medium text-muted';

export function DataTable() {
  const [sortKey, setSortKey] = useState<Key>('name');
  const [asc, setAsc] = useState(true);

  const sorted = [...ROWS].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    let cmp: number;
    if (typeof av === 'string' && typeof bv === 'string') cmp = av.localeCompare(bv);
    else cmp = (Number(av ?? -Infinity)) - Number(bv ?? -Infinity);
    return asc ? cmp : -cmp;
  });

  const header = (key: Key, label: string, align: 'left' | 'right') => {
    const active = sortKey === key;
    return (
      <th
        scope="col"
        className={th + (align === 'right' ? ' text-right' : ' text-left')}
        aria-sort={active ? (asc ? 'ascending' : 'descending') : 'none'}
      >
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-brand"
          onClick={() => {
            if (active) setAsc((v) => !v);
            else {
              setSortKey(key);
              setAsc(true);
            }
          }}
        >
          {label}
          {active ? (
            asc ? (
              <ChevronUp size={14} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" />
            )
          ) : (
            <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" className="opacity-30" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-small text-muted">
          Ingredient weights per cup, tablespoon and teaspoon (USDA and King Arthur)
        </caption>
        <thead>
          <tr className="border-b border-line">
            {header('name', 'Ingredient', 'left')}
            {header('usdaCup', 'USDA g/cup', 'right')}
            {header('usdaTbsp', 'USDA g/tbsp', 'right')}
            {header('usdaTsp', 'USDA g/tsp', 'right')}
            {header('ka', 'King Arthur g/cup', 'right')}
            {header('diff', 'Difference (%)', 'right')}
            <th scope="col" className={th + ' text-left'}>USDA food and FDC ID</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.name} className="border-b border-line align-top">
              <th scope="row" className="px-3 py-2 text-left font-normal text-ink">{r.name}</th>
              <td className="px-3 py-2 text-right tabular text-ink">{r.usdaCup}</td>
              <td className="px-3 py-2 text-right tabular text-ink">{formatGrams(r.usdaTbsp)}</td>
              <td className="px-3 py-2 text-right tabular text-ink">{formatGrams(r.usdaTsp)}</td>
              <td className="px-3 py-2 text-right tabular text-ink">{r.ka ?? '-'}</td>
              <td className="px-3 py-2 text-right tabular text-ink">
                {r.diff == null ? '-' : `${r.diff > 0 ? '+' : ''}${r.diff}%`}
              </td>
              <td className="px-3 py-2 text-left text-small text-muted">
                {r.portion}
                <span className="block">
                  <a
                    href={`https://fdc.nal.usda.gov/food-details/${r.fdcId}/nutrients`}
                    className="link"
                    rel="noopener"
                  >
                    FDC {r.fdcId}
                  </a>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
