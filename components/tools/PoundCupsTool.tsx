'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { G_PER_LB } from '@/lib/data/constants';
import { parseAmount } from '@/lib/calc/fraction';
import { trimDecimal, roundTo } from '@/lib/calc/round';
import { toKitchenMeasure } from '@/lib/calc/kitchen';
import { track } from '@/lib/analytics';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

const TOOL = 'cups-in-a-pound';

function cupsWord(cups: number) {
  return cups > 1 + 1e-9 ? 'cups' : 'cup';
}

/** Pounds to cups by ingredient, with a kitchen-measure line. */
export function PoundCupsTool() {
  const [poundsText, setPoundsText] = useState('1');
  const [ingredientId, setIngredientId] = useState('ap-flour');
  const [source, setSource] = useState<SourceValue>('usda');

  const pounds = useMemo(() => parseAmount(poundsText), [poundsText]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (pounds != null) track('tool_used', { tool: TOOL, ingredient: ingredientId });
    }, 150);
    return () => clearTimeout(t);
  }, [pounds, ingredientId, source]);

  const ing = getIngredient(ingredientId);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pounds" htmlFor="pc-pounds" hint="Fractions are fine">
          <TextInput id="pc-pounds" inputMode="text" value={poundsText} onChange={(e) => setPoundsText(e.target.value)} />
        </Field>
        <Field label="Ingredient" htmlFor="pc-ingredient">
          <IngredientSelect id="pc-ingredient" value={ingredientId} onChange={setIngredientId} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Data source" htmlFor="pc-source">
          <div id="pc-source">
            <SegmentedSource value={source} onChange={setSource} />
          </div>
        </Field>
      </div>
      {children}
    </div>
  );

  if (pounds == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Type a number of pounds to convert.
      </div>,
    );
  }

  const perCup = gramsPerCup(ing, source);
  const grams = pounds * G_PER_LB;
  const cups = grams / perCup;
  const cupsStr = roundTo(cups, 2).toFixed(2);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';

  return inputs(
    <ResultCard
      primary={cupsStr}
      unit={cupsWord(cups)}
      secondary={toKitchenMeasure(cups)}
      sourceLine="1 lb = 453.6 g = 16 oz"
      math={`${trimDecimal(grams, 1)} g ÷ ${perCup} g per cup = ${cupsStr} cups`}
      shareParams={`lb=${encodeURIComponent(poundsText.trim())}&ing=${ingredientId}&src=${source}`}
      copyText={`${poundsText.trim()} lb of ${ing.name.toLowerCase()} = ${cupsStr} cups (${sourceLabel}).`}
      ingredientForEvent={ingredientId}
      toolName={TOOL}
    />,
  );
}
