'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { gramsCell, trimDecimal } from '@/lib/calc/round';
import { mlFromTsp, cupFractionLabel } from '@/lib/calc/tables';
import { tbspTspLabel } from '@/lib/calc/kitchen';
import { track } from '@/lib/analytics';
import { Field, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

// "Need a different amount?" links per fraction.
const NEXT_LINKS: Record<string, { text: string; href: string }[]> = {
  '1/8': [
    { text: 'tablespoons to cups', href: '/tablespoons-to-cups/' },
    { text: 'tablespoons to grams', href: '/tablespoons-to-grams/' },
  ],
  '1/4': [
    { text: 'tablespoons to cups', href: '/tablespoons-to-cups/' },
    { text: 'tablespoons to grams', href: '/tablespoons-to-grams/' },
  ],
  '1/3': [
    { text: 'tablespoons to cups', href: '/tablespoons-to-cups/' },
    { text: 'half a measurement', href: '/half-a-measurement/' },
  ],
  '2/3': [
    { text: 'tablespoons in 1/3 cup', href: '/tablespoons-in-1-3-cup/' },
    { text: 'cups to grams', href: '/cups-to-grams/' },
  ],
};

/** Grams in a cup fraction (1/8, 1/4, 1/3 or 2/3) by ingredient, with equivalents. */
export function CupFractionTool({ fraction }: { fraction: number }) {
  const [ingredientId, setIngredientId] = useState('ap-flour');
  const [source, setSource] = useState<SourceValue>('usda');

  const label = cupFractionLabel(fraction); // "1/8", "1/4", "1/3" or "2/3"
  const [num, denom] = label.split('/').map(Number);
  const tsp = Math.round(48 * fraction);
  const toolName = `tablespoons-in-${label.replace('/', '-')}-cup`;
  const [link1, link2] = NEXT_LINKS[label];

  useEffect(() => {
    const t = setTimeout(() => track('tool_used', { tool: toolName }), 150);
    return () => clearTimeout(t);
  }, [ingredientId, source, toolName]);

  const ing = getIngredient(ingredientId);
  const perCup = gramsPerCup(ing, source);
  const grams = gramsCell(perCup * fraction);
  const perTbsp = gramsCell(perCup / 16);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';
  const equiv = `${tbspTspLabel(tsp)} · ${tsp} tsp · ${trimDecimal(8 * fraction, 2)} fl oz · ${mlFromTsp(tsp)} mL`;
  const math =
    num === 1 ? `${perCup} ÷ ${denom} = ${grams} g` : `${perCup} × ${num} ÷ ${denom} = ${grams} g`;
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
        <Link href={link1.href} prefetch={false} className="link">{link1.text}</Link>{' '}
        or{' '}
        <Link href={link2.href} prefetch={false} className="link">{link2.text}</Link>.
      </p>
    </div>
  );
}
