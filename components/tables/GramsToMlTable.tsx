'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { INGREDIENTS } from '@/lib/data/ingredients';
import { gramsToMl, densityGml } from '@/lib/calc/convert';
import { formatMl, densityDisplay } from '@/lib/calc/tables';

type Key = 'name' | 'density' | 'mlUsda' | 'mlKa';

const th = 'px-3 py-2 text-small font-medium text-muted';

export function GramsToMlTable() {
  const [sortKey, setSortKey] = useState<Key>('name');
  const [asc, setAsc] = useState(true);

  const rows = INGREDIENTS.map((i) => ({
    id: i.id,
    name: i.name,
    density: densityGml(i.id, 'usda'),
    mlUsda: gramsToMl(100, i.id, 'usda'),
    mlKa: i.kaGramsPerCup == null ? null : gramsToMl(100, i.id, 'kingArthur'),
  }));

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    let cmp: number;
    if (typeof av === 'string' && typeof bv === 'string') cmp = av.localeCompare(bv);
    else cmp = Number(av ?? -Infinity) - Number(bv ?? -Infinity);
    return asc ? cmp : -cmp;
  });

  const header = (key: Key, lbl: string, align: 'left' | 'right') => {
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
          {lbl}
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
          Density and mL per 100 g, all ingredients
        </caption>
        <thead>
          <tr className="border-b border-line">
            {header('name', 'Ingredient', 'left')}
            {header('density', 'g per mL (USDA)', 'right')}
            {header('mlUsda', 'mL in 100 g (USDA)', 'right')}
            {header('mlKa', 'mL in 100 g (King Arthur)', 'right')}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.name} className="border-b border-line">
              <th scope="row" className="px-3 py-2 text-left font-normal text-ink">{r.name}</th>
              <td className="px-3 py-2 text-right tabular text-ink">{densityDisplay(r.id, 'usda')}</td>
              <td className="px-3 py-2 text-right tabular text-ink">{formatMl(r.mlUsda)}</td>
              <td className="px-3 py-2 text-right tabular text-ink">{r.mlKa == null ? '-' : formatMl(r.mlKa)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
