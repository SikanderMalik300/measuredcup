'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup, differencePercent } from '@/lib/data/ingredients';
import { cupsToGrams, gramsToOz } from '@/lib/calc/convert';
import { parseAmount } from '@/lib/calc/fraction';
import { formatGrams, roundTo } from '@/lib/calc/round';
import { track } from '@/lib/analytics';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

const STORAGE_KEY = 'mc-ingredient';

export function CupsToGramsTool() {
  const [cupsText, setCupsText] = useState('1 1/2');
  const [ingredientId, setIngredientId] = useState('ap-flour');
  const [source, setSource] = useState<SourceValue>('usda');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== ingredientId) setIngredientId(saved);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onIngredient = (id: string) => {
    setIngredientId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  };

  const ing = getIngredient(ingredientId);
  const cups = useMemo(() => parseAmount(cupsText), [cupsText]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (cups != null) track('tool_used', { tool: 'cups-to-grams', ingredient: ingredientId });
    }, 150);
    return () => clearTimeout(t);
  }, [cups, ingredientId, source]);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cups" htmlFor="c2g-cups" hint="Fractions and mixed numbers work: 3/4, 1 1/3, 2.5">
          <TextInput id="c2g-cups" inputMode="text" value={cupsText} onChange={(e) => setCupsText(e.target.value)} />
        </Field>
        <Field label="Ingredient" htmlFor="c2g-ingredient">
          <IngredientSelect id="c2g-ingredient" value={ingredientId} onChange={onIngredient} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Data source" htmlFor="c2g-source">
          <div id="c2g-source">
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
        Type a cup amount, like 3/4 or 1 1/2.
      </div>,
    );
  }

  const perCup = gramsPerCup(ing, source);
  const grams = cupsToGrams(cups, ingredientId, source);
  const gramsStr = formatGrams(grams);
  const oz = roundTo(gramsToOz(grams), 1);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';
  const sourceLine = `Using ${sourceLabel}: 1 cup ${ing.name.toLowerCase()} = ${perCup} g`;

  let otherSourceLine: string | undefined;
  const diff = differencePercent(ing);
  if (ing.kaGramsPerCup != null && diff != null && Math.abs(diff) > 3) {
    const otherIsKa = source === 'usda';
    const otherPerCup = otherIsKa ? ing.kaGramsPerCup : ing.usdaGramsPerCup;
    const otherName = otherIsKa ? 'King Arthur' : 'USDA';
    otherSourceLine = `${otherName}'s figure gives ${formatGrams(cups * otherPerCup)} g.`;
  }

  const rawProduct = roundTo(grams, 2);
  const math = `${cups === Math.round(cups) ? cups : cupsText.trim()} × ${perCup} = ${rawProduct} g, shown as ${gramsStr} g.`;
  const copyText = `${cupsText.trim()} cups ${ing.name.toLowerCase()} = ${gramsStr} g (${oz} oz), using ${sourceLabel}.`;
  const shareParams = `cups=${encodeURIComponent(cupsText.trim())}&ing=${ingredientId}&src=${source}`;

  return inputs(
    <ResultCard
      primary={gramsStr}
      unit="g"
      secondary={`${oz} oz`}
      sourceLine={sourceLine}
      otherSourceLine={otherSourceLine}
      math={math}
      shareParams={shareParams}
      copyText={copyText}
      ingredientForEvent={ingredientId}
      toolName="cups-to-grams"
    />,
  );
}
