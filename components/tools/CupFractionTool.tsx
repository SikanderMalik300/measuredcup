'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { gramsCell } from '@/lib/calc/round';
import { mlFromTsp, cupFractionLabel } from '@/lib/calc/tables';
import { track } from '@/lib/analytics';
import { Field, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

/** Grams in a cup fraction (1/8 or 1/4) by ingredient, with equivalents. */
export function CupFractionTool({ fraction }: { fraction: number }) {
  const [ingredientId, setIngredientId] = useState('ap-flour');
  const [source, setSource] = useState<SourceValue>('usda');

  const divisor = Math.round(1 / fraction); // 8 or 4
  const label = cupFractionLabel(fraction); // "1/8" or "1/4"
  const tbsp = 16 * fraction;
  const tsp = 48 * fraction;
  const flOz = 8 * fraction;
  const toolName = `tablespoons-in-1-${divisor}-cup`;

  useEffect(() => {
    const t = setTimeout(() => track('tool_used', { tool: toolName }), 150);
    return () => clearTimeout(t);
  }, [ingredientId, source, toolName]);

  const ing = getIngredient(ingredientId);
  const perCup = gramsPerCup(ing, source);
  const grams = gramsCell(perCup * fraction);
  const perTbsp = gramsCell(perCup / 16);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';
  const equiv = `${tbsp} tbsp · ${tsp} tsp · ${flOz} fl oz · ${mlFromTsp(tsp)} mL`;
  const math = `${perCup} ÷ ${divisor} = ${grams} g`;
  const copyText = `${label} cup of ${ing.name.toLowerCase()} is ${grams} g (${sourceLabel}). That is ${equiv}.`;
  const shareParams = `ing=${ingredientId}&src=${source}`;

  return (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ingredient" htmlFor="cf-ingredient">
          <IngredientSelect id="cf-ingredient" value={ingredientId} onChange={setIngredientId} />
        </Field>
        <Field label="Data source" htmlFor="cf-source">
          <div id="cf-source">
            <SegmentedSource value={source} onChange={setSource} />
          </div>
        </Field>
      </div>

      <ResultCard
        primary={grams}
        unit="g"
        secondary={equiv}
        sourceLine={`Per tablespoon: ${perTbsp} g`}
        math={math}
        shareParams={shareParams}
        copyText={copyText}
        ingredientForEvent={ingredientId}
        toolName={toolName}
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
