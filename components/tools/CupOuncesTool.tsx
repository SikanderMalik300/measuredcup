'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { G_PER_OZ } from '@/lib/data/constants';
import { parseAmount, formatFraction } from '@/lib/calc/fraction';
import { gramsCell, trimDecimal, roundTo } from '@/lib/calc/round';
import { track } from '@/lib/analytics';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

function cupsWord(cups: number) {
  return cups > 1 + 1e-9 ? 'cups' : 'cup';
}

/** Cups to fluid ounces (volume) plus weight in ounces for the chosen ingredient. */
export function CupOuncesTool() {
  const [cupsText, setCupsText] = useState('1');
  const [ingredientId, setIngredientId] = useState('ap-flour');
  const [source, setSource] = useState<SourceValue>('usda');

  const cups = useMemo(() => parseAmount(cupsText), [cupsText]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (cups != null) track('tool_used', { tool: 'ounces-in-a-cup', ingredient: ingredientId });
    }, 150);
    return () => clearTimeout(t);
  }, [cups, ingredientId, source]);

  const ing = getIngredient(ingredientId);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cups" htmlFor="oz-cups" hint="Fractions are fine">
          <TextInput id="oz-cups" inputMode="text" value={cupsText} onChange={(e) => setCupsText(e.target.value)} />
        </Field>
        <Field label="Ingredient" htmlFor="oz-ingredient">
          <IngredientSelect id="oz-ingredient" value={ingredientId} onChange={setIngredientId} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Data source" htmlFor="oz-source">
          <div id="oz-source">
            <SegmentedSource value={source} onChange={setSource} />
          </div>
        </Field>
      </div>
      {children}
    </div>
  );

  if (cups == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Type a number of cups to convert.
      </div>,
    );
  }

  const perCup = gramsPerCup(ing, source);
  const gramsRaw = perCup * cups;
  const gramsStr = gramsCell(gramsRaw);
  const flOz = trimDecimal(cups * 8, 2);
  const weightOz = roundTo(gramsRaw / G_PER_OZ, 2).toFixed(2);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';
  const cupsLabel = `${formatFraction(cups)} ${cupsWord(cups)}`;

  const secondary = `By weight: ${weightOz} oz (${gramsStr} g) of ${ing.name.toLowerCase()}`;
  const sourceLine =
    'Fluid ounces measure space. Ounces on a scale measure weight. They only match for water-like liquids.';
  const math = `${cupsLabel} × 8 = ${flOz} fl oz. ${gramsStr} g ÷ 28.35 = ${weightOz} oz`;
  const copyText = `${cupsLabel} is ${flOz} fl oz by volume, and about ${weightOz} oz (${gramsStr} g) of ${ing.name.toLowerCase()} by weight (${sourceLabel}).`;
  const shareParams = `cups=${encodeURIComponent(cupsText.trim())}&ing=${ingredientId}&src=${source}`;

  return inputs(
    <ResultCard
      primary={flOz}
      unit="fl oz"
      secondary={secondary}
      sourceLine={sourceLine}
      math={math}
      shareParams={shareParams}
      copyText={copyText}
      ingredientForEvent={ingredientId}
      toolName="ounces-in-a-cup"
    />,
  );
}
