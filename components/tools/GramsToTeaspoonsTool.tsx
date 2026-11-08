'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { parseAmount } from '@/lib/calc/fraction';
import { toKitchenMeasure } from '@/lib/calc/kitchen';
import { trimDecimal, gramsCell, formatGrams } from '@/lib/calc/round';
import { track } from '@/lib/analytics';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

type Direction = 'g2t' | 't2g';

const TOOL = 'grams-to-teaspoons';

export function GramsToTeaspoonsTool() {
  const [direction, setDirection] = useState<Direction>('g2t');
  const [amountText, setAmountText] = useState('5');
  const [ingredientId, setIngredientId] = useState('sugar');
  const [source, setSource] = useState<SourceValue>('usda');

  const amount = useMemo(() => parseAmount(amountText), [amountText]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (amount != null) track('tool_used', { tool: TOOL, ingredient: ingredientId });
    }, 150);
    return () => clearTimeout(t);
  }, [amount, direction, ingredientId, source]);

  const directionToggle = (
    <div role="group" aria-label="Direction" className="inline-flex rounded-pill border border-line bg-surface p-1">
      {(
        [
          ['g2t', 'Grams → teaspoons'],
          ['t2g', 'Teaspoons → grams'],
        ] as [Direction, string][]
      ).map(([v, label]) => {
        const active = direction === v;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            onClick={() => setDirection(v)}
            className="min-h-[36px] rounded-pill px-4 text-small"
            style={active ? { background: 'var(--brand)', color: '#fff' } : { color: 'var(--ink)' }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="mb-4">
        <Field label="Direction" htmlFor="g2t-dir">
          <div id="g2t-dir">{directionToggle}</div>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={direction === 'g2t' ? 'Grams' : 'Teaspoons'} htmlFor="g2t-amount" hint="Fractions are fine">
          <TextInput id="g2t-amount" inputMode="text" value={amountText} onChange={(e) => setAmountText(e.target.value)} />
        </Field>
        <Field label="Ingredient" htmlFor="g2t-ingredient">
          <IngredientSelect id="g2t-ingredient" value={ingredientId} onChange={setIngredientId} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Data source" htmlFor="g2t-source">
          <div id="g2t-source">
            <SegmentedSource value={source} onChange={setSource} />
          </div>
        </Field>
      </div>
      {children}
    </div>
  );

  if (amount == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Type an amount to convert.
      </div>,
    );
  }

  const ing = getIngredient(ingredientId);
  const perCup = gramsPerCup(ing, source);
  const perTsp = perCup / 48;
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';
  const perTspLine = `1 tsp of ${ing.name.toLowerCase()} = ${gramsCell(perTsp)} g`;
  const shareParams = `dir=${direction}&amt=${encodeURIComponent(amountText.trim())}&ing=${ingredientId}&src=${source}`;

  if (direction === 'g2t') {
    const tsp = amount / perTsp;
    const tspStr = trimDecimal(tsp, 2);
    return inputs(
      <ResultCard
        primary={tspStr}
        unit={Math.abs(tsp - 1) < 1e-9 ? 'teaspoon' : 'teaspoons'}
        secondary={toKitchenMeasure(amount / perCup)}
        sourceLine={perTspLine}
        math={`${trimDecimal(amount, 2)} g ÷ ${trimDecimal(perTsp, 2)} g per tsp = ${tspStr} tsp`}
        shareParams={shareParams}
        copyText={`${trimDecimal(amount, 2)} g of ${ing.name.toLowerCase()} = ${tspStr} tsp (${sourceLabel}).`}
        ingredientForEvent={ingredientId}
        toolName={TOOL}
      />,
    );
  }

  const grams = (amount * perCup) / 48;
  const gramsStr = formatGrams(grams);
  return inputs(
    <ResultCard
      primary={gramsStr}
      unit="g"
      sourceLine={perTspLine}
      math={`${trimDecimal(amount, 2)} tsp × ${perCup} ÷ 48 = ${gramsStr} g`}
      shareParams={shareParams}
      copyText={`${amountText.trim()} tsp of ${ing.name.toLowerCase()} = ${gramsStr} g (${sourceLabel}).`}
      ingredientForEvent={ingredientId}
      toolName={TOOL}
    />,
  );
}
