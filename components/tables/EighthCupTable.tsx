'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { INGREDIENTS } from '@/lib/data/ingredients';
import { gramsCell } from '@/lib/calc/round';

type Key = 'name' | 'usda' | 'ka' | 'perTbsp';

interface Row {
  name: string;
  usda: number;
  ka: number | null;
  perTbsp: number;
}

const ROWS: Row[] = INGREDIENTS.map((i) => ({
  name: i.name,
  usda: i.usdaGramsPerCup / 8,
  ka: i.kaGramsPerCup == null ? null : i.kaGramsPerCup / 8,
  perTbsp: i.usdaGramsPerCup / 16,
}));

const th = 'px-3 py-2 text-small font-medium text-muted';

export function EighthCupTable() {
  const [sortKey, setSortKey] = useState<Key>('name');
  const [asc, setAsc] = useState(true);

  const sorted = [...ROWS].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    let cmp: number;
    if (typeof av === 'string' && typeof bv === 'string') cmp = av.localeCompare(bv);
    else cmp = Number(av ?? -Infinity) - Number(bv ?? -Infinity);
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
        <caption className="pb-2 text-left text-small text-muted">1/8 cup in grams by ingredient</caption>
        <thead>
          <tr className="border-b border-line">
            {header('name', 'Ingredient', 'left')}
            {header('usda', 'USDA (g)', 'right')}
            {header('ka', 'King Arthur (g)', 'right')}
            {header('perTbsp', 'Per tablespoon, USDA (g)', 'right')}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.name} className="border-b border-line">
              <th scope="row" className="px-3 py-2 text-left font-normal text-ink">{r.name}</th>
              <td className="px-3 py-2 text-right tabular text-ink">{gramsCell(r.usda)}</td>
              <td className="px-3 py-2 text-right tabular text-ink">{r.ka == null ? '-' : gramsCell(r.ka)}</td>
              <td className="px-3 py-2 text-right tabular text-ink">{gramsCell(r.perTbsp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
