'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { gramsCell } from '@/lib/calc/round';
import { track } from '@/lib/analytics';
import { Field, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

export function EighthCupTool() {
  const [ingredientId, setIngredientId] = useState('ap-flour');
  const [source, setSource] = useState<SourceValue>('usda');

  useEffect(() => {
    const t = setTimeout(() => track('tool_used', { tool: 'tablespoons-in-1-8-cup' }), 150);
    return () => clearTimeout(t);
  }, [ingredientId, source]);

  const ing = getIngredient(ingredientId);
  const perCup = gramsPerCup(ing, source);
  const grams = gramsCell(perCup / 8);
  const perTbsp = gramsCell(perCup / 16);
  const label = source === 'usda' ? 'USDA' : 'King Arthur';
  const math = `${perCup} ÷ 8 = ${grams} g`;
  const copyText = `1/8 cup of ${ing.name.toLowerCase()} is ${grams} g (${label}). That is 2 tbsp, 6 tsp, 1 fl oz or 29.6 mL.`;
  const shareParams = `ing=${ingredientId}&src=${source}`;

  return (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ingredient" htmlFor="eighth-ingredient">
          <IngredientSelect id="eighth-ingredient" value={ingredientId} onChange={setIngredientId} />
        </Field>
        <Field label="Data source" htmlFor="eighth-source">
          <div id="eighth-source">
            <SegmentedSource value={source} onChange={setSource} />
          </div>
        </Field>
      </div>

      <ResultCard
        primary={grams}
        unit="g"
        secondary="2 tbsp · 6 tsp · 1 fl oz · 29.6 mL"
        sourceLine={`Per tablespoon: ${perTbsp} g`}
        math={math}
        shareParams={shareParams}
        copyText={copyText}
        ingredientForEvent={ingredientId}
        toolName="tablespoons-in-1-8-cup"
      />

      <p className="mt-3 text-small text-muted">
        Need a different amount? Use{' '}
        <Link href="/tablespoons-to-cups/" prefetch={false} className="link">tablespoons to cups</Link>{' '}
        or{' '}
        <Link href="/tablespoons-to-grams/" prefetch={false} className="link">tablespoons to grams</Link>.
      </p>
    </div>
  );
}
