'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { toKitchenMeasure } from '@/lib/calc/kitchen';
import { trimDecimal, gramsCell } from '@/lib/calc/round';
import { track } from '@/lib/analytics';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

export function GramsToTablespoonsTool() {
  const [grams, setGrams] = useState('20');
  const [ingredientId, setIngredientId] = useState('sugar');
  const [source, setSource] = useState<SourceValue>('usda');

  const g = useMemo(() => {
    const n = Number(grams);
    return Number.isFinite(n) && grams.trim() !== '' ? n : null;
  }, [grams]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (g != null) track('tool_used', { tool: 'grams-to-tablespoons', ingredient: ingredientId });
    }, 150);
    return () => clearTimeout(t);
  }, [g, ingredientId, source]);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Grams" htmlFor="g2t-grams">
          <TextInput id="g2t-grams" inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} />
        </Field>
        <Field label="Ingredient" htmlFor="g2t-ingredient">
          <IngredientSelect id="g2t-ingredient" value={ingredientId} onChange={setIngredientId} />
        </Field>
        <Field label="Data source" htmlFor="g2t-source">
          <div id="g2t-source">
            <SegmentedSource value={source} onChange={setSource} />
          </div>
        </Field>
      </div>
      {children}
    </div>
  );

  if (g == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Enter a weight in grams to see the tablespoons.
      </div>,
    );
  }

  const ing = getIngredient(ingredientId);
  const perCup = gramsPerCup(ing, source);
  const perTbsp = perCup / 16;
  const tbsp = g / perTbsp;
  const tsp = g / (perCup / 48);
  const tbspStr = trimDecimal(tbsp, 2);
  const perTbspStr = trimDecimal(perTbsp, 2);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';

  const secondary = toKitchenMeasure(g / perCup);
  const sourceLine = `${trimDecimal(tsp, 2)} tsp`;
  const otherSourceLine = `1 tbsp of ${ing.name.toLowerCase()} = ${gramsCell(perTbsp)} g`;
  const math = `${perCup} ÷ 16 = ${perTbspStr} g per tbsp · ${g} ÷ ${perTbspStr} = ${tbspStr} tbsp`;
  const copyText = `${g} g ${ing.name.toLowerCase()} = ${tbspStr} tbsp (${trimDecimal(tsp, 2)} tsp), using ${sourceLabel}.`;
  const shareParams = `g=${g}&ing=${ingredientId}&src=${source}`;

  return inputs(
    <ResultCard
      primary={tbspStr}
      unit="tbsp"
      secondary={secondary}
      sourceLine={sourceLine}
      otherSourceLine={otherSourceLine}
      math={math}
      shareParams={shareParams}
      copyText={copyText}
      ingredientForEvent={ingredientId}
      toolName="grams-to-tablespoons"
    />,
  );
}
