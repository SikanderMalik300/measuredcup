'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient } from '@/lib/data/ingredients';
import { gramsToMl } from '@/lib/calc/convert';
import { toKitchenMeasure } from '@/lib/calc/kitchen';
import { formatMl, densityDisplay } from '@/lib/calc/tables';
import { trimDecimal } from '@/lib/calc/round';
import { track } from '@/lib/analytics';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

export function GramsToMlTool() {
  const [grams, setGrams] = useState('100');
  const [ingredientId, setIngredientId] = useState('ap-flour');
  const [source, setSource] = useState<SourceValue>('usda');

  const g = useMemo(() => {
    const n = Number(grams);
    return Number.isFinite(n) && grams.trim() !== '' ? n : null;
  }, [grams]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (g != null) track('tool_used', { tool: 'grams-to-ml', ingredient: ingredientId });
    }, 150);
    return () => clearTimeout(t);
  }, [g, ingredientId, source]);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Grams" htmlFor="g2ml-grams">
          <TextInput id="g2ml-grams" inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} />
        </Field>
        <Field label="Ingredient" htmlFor="g2ml-ingredient">
          <IngredientSelect id="g2ml-ingredient" value={ingredientId} onChange={setIngredientId} />
        </Field>
        <Field label="Data source" htmlFor="g2ml-source">
          <div id="g2ml-source">
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
        Enter a weight in grams to see the milliliters.
      </div>,
    );
  }

  const ing = getIngredient(ingredientId);
  const ml = gramsToMl(g, ingredientId, source);
  const mlStr = formatMl(ml);
  const cups = g / (source === 'usda' ? ing.usdaGramsPerCup : ing.kaGramsPerCup ?? ing.usdaGramsPerCup);
  const cupsWord = Math.abs(cups - 1) < 1e-9 ? 'cup' : 'cups';
  const density = densityDisplay(ingredientId, source);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';

  const secondary = `${trimDecimal(cups, 2)} ${cupsWord} · ${toKitchenMeasure(cups)}`;
  const sourceLine = `Density: ${density} g per mL`;
  const perCup = source === 'usda' ? ing.usdaGramsPerCup : ing.kaGramsPerCup ?? ing.usdaGramsPerCup;
  const math = `${g} ÷ ${perCup} × 236.6 = ${mlStr} mL`;
  const copyText = `${g} g ${ing.name.toLowerCase()} = ${mlStr} mL (${trimDecimal(cups, 2)} ${cupsWord}), using ${sourceLabel}.`;
  const shareParams = `g=${g}&ing=${ingredientId}&src=${source}`;

  return inputs(
    <ResultCard
      primary={mlStr}
      unit="mL"
      secondary={secondary}
      sourceLine={sourceLine}
      math={math}
      shareParams={shareParams}
      copyText={copyText}
      ingredientForEvent={ingredientId}
      toolName="grams-to-ml"
    />,
  );
}
