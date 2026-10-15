'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { parseAmount } from '@/lib/calc/fraction';
import { trimDecimal, gramsCell } from '@/lib/calc/round';
import { fewestScoops } from '@/lib/calc/kitchen';
import { mlFromTsp, flOzFromTsp } from '@/lib/calc/tables';
import { track } from '@/lib/analytics';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

type Unit = 'tablespoons' | 'teaspoons';

export function TablespoonsToCupsTool() {
  const [amountText, setAmountText] = useState('10');
  const [unit, setUnit] = useState<Unit>('tablespoons');
  const [ingredientId, setIngredientId] = useState('volume');
  const [source, setSource] = useState<SourceValue>('usda');

  const amount = useMemo(() => parseAmount(amountText), [amountText]);
  const hasIngredient = ingredientId !== 'volume';

  useEffect(() => {
    const t = setTimeout(() => {
      if (amount != null) track('tool_used', { tool: 'tablespoons-to-cups' });
    }, 150);
    return () => clearTimeout(t);
  }, [amount, unit, ingredientId, source]);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount" htmlFor="t2c-amount" hint="Fractions like 2 1/2 work">
          <TextInput id="t2c-amount" inputMode="text" value={amountText} onChange={(e) => setAmountText(e.target.value)} />
        </Field>
        <Field label="Unit" htmlFor="t2c-unit">
          <div id="t2c-unit" role="group" aria-label="Unit" className="inline-flex rounded-pill border border-line bg-surface p-1">
            {([['tablespoons', 'Tablespoons'], ['teaspoons', 'Teaspoons']] as [Unit, string][]).map(([v, label]) => {
              const active = unit === v;
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setUnit(v)}
                  className="min-h-[36px] rounded-pill px-4 text-small"
                  style={active ? { background: 'var(--brand)', color: '#fff' } : { color: 'var(--ink)' }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="Ingredient (optional, for grams)" htmlFor="t2c-ingredient">
          <IngredientSelect
            id="t2c-ingredient"
            value={ingredientId}
            onChange={setIngredientId}
            extraOption={{ value: 'volume', label: 'Volume only' }}
          />
        </Field>
        {hasIngredient && (
          <Field label="Data source" htmlFor="t2c-source">
            <div id="t2c-source">
              <SegmentedSource value={source} onChange={setSource} />
            </div>
          </Field>
        )}
      </div>
      {children}
    </div>
  );

  if (amount == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Type how many tablespoons or teaspoons to convert.
      </div>,
    );
  }

  const totalTsp = unit === 'tablespoons' ? amount * 3 : amount;
  const cups = totalTsp / 48;
  const cupsStr = trimDecimal(cups, 4);
  const cupsWord = Math.abs(cups - 1) < 1e-9 ? 'cup' : 'cups';
  const secondary = fewestScoops(totalTsp);
  const sourceLine = `${mlFromTsp(totalTsp)} mL · ${flOzFromTsp(totalTsp)} fl oz`;

  let gramsLine: string | undefined;
  if (hasIngredient) {
    const ing = getIngredient(ingredientId);
    const grams = cups * gramsPerCup(ing, source);
    const label = source === 'usda' ? 'USDA' : 'King Arthur';
    gramsLine = `${gramsCell(grams)} g ${ing.name.toLowerCase()} (${label})`;
  }

  const divisor = unit === 'tablespoons' ? 16 : 48;
  const math = `${amount} ÷ ${divisor} = ${cupsStr} cups`;
  const copyText = `${amountText.trim()} ${unit === 'tablespoons' ? 'tbsp' : 'tsp'} = ${cupsStr} cups (${secondary}).`;
  const shareParams = `amt=${encodeURIComponent(amountText.trim())}&unit=${unit}${hasIngredient ? `&ing=${ingredientId}&src=${source}` : ''}`;

  return inputs(
    <ResultCard
      primary={cupsStr}
      unit={cupsWord}
      secondary={secondary}
      sourceLine={sourceLine}
      otherSourceLine={gramsLine}
      math={math}
      shareParams={shareParams}
      copyText={copyText}
      ingredientForEvent={hasIngredient ? ingredientId : undefined}
      toolName="tablespoons-to-cups"
    />,
  );
}
