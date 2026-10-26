'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { G_PER_OZ, ML_PER_FL_OZ } from '@/lib/data/constants';
import { cupToken } from '@/lib/calc/tables';
import { parseAmount } from '@/lib/calc/fraction';
import { trimDecimal, roundTo } from '@/lib/calc/round';
import { toKitchenMeasure } from '@/lib/calc/kitchen';
import { track } from '@/lib/analytics';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

type OzType = 'fluid' | 'weight';

const TOOL = 'tablespoons-in-an-ounce';
const MUTED =
  'Fluid ounces measure volume and ounces measure weight. A recipe that says ounces for a dry ingredient means weight.';

function cupsWord(cups: number) {
  return cups > 1 + 1e-9 ? 'cups' : 'cup';
}

export function OunceTbspTool() {
  const [ouncesText, setOuncesText] = useState('1');
  const [ozType, setOzType] = useState<OzType>('fluid');
  const [ingredientId, setIngredientId] = useState('ap-flour');
  const [source, setSource] = useState<SourceValue>('usda');

  const oz = useMemo(() => parseAmount(ouncesText), [ouncesText]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (oz != null) track('tool_used', { tool: TOOL });
    }, 150);
    return () => clearTimeout(t);
  }, [oz, ozType, ingredientId, source]);

  const typeToggle = (
    <div role="group" aria-label="Ounce type" className="inline-flex rounded-pill border border-line bg-surface p-1">
      {(
        [
          ['fluid', 'Fluid ounces'],
          ['weight', 'Ounces by weight'],
        ] as [OzType, string][]
      ).map(([v, label]) => {
        const active = ozType === v;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            onClick={() => setOzType(v)}
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ounces" htmlFor="ot-oz" hint="Fractions are fine">
          <TextInput id="ot-oz" inputMode="text" value={ouncesText} onChange={(e) => setOuncesText(e.target.value)} />
        </Field>
        <Field label="Ounce type" htmlFor="ot-type">
          <div id="ot-type">{typeToggle}</div>
        </Field>
        {ozType === 'weight' && (
          <>
            <Field label="Ingredient" htmlFor="ot-ingredient">
              <IngredientSelect id="ot-ingredient" value={ingredientId} onChange={setIngredientId} />
            </Field>
            <Field label="Data source" htmlFor="ot-source">
              <div id="ot-source">
                <SegmentedSource value={source} onChange={setSource} />
              </div>
            </Field>
          </>
        )}
      </div>
      {children}
    </div>
  );

  if (oz == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Type a number of ounces to convert.
      </div>,
    );
  }

  if (ozType === 'fluid') {
    const tbsp = oz * 2;
    const tbspStr = trimDecimal(tbsp, 2);
    const cups = oz / 8;
    const secondary = `${trimDecimal(oz * 6, 2)} tsp · ${cupToken(cups)} ${cupsWord(cups)} · ${roundTo(oz * ML_PER_FL_OZ, 1).toFixed(1)} mL`;
    return inputs(
      <ResultCard
        primary={tbspStr}
        unit={Math.abs(tbsp - 1) < 1e-9 ? 'tablespoon' : 'tablespoons'}
        secondary={secondary}
        sourceLine={MUTED}
        math={`${trimDecimal(oz, 2)} fl oz × 2 = ${tbspStr} tbsp`}
        shareParams={`oz=${encodeURIComponent(ouncesText.trim())}&type=fluid`}
        copyText={`${ouncesText.trim()} fl oz = ${tbspStr} tbsp (${secondary}).`}
        toolName={TOOL}
      />,
    );
  }

  const ing = getIngredient(ingredientId);
  const perCup = gramsPerCup(ing, source);
  const perTbsp = perCup / 16;
  const grams = oz * G_PER_OZ;
  const tbsp = grams / perTbsp;
  const tbspStr = roundTo(tbsp, 2).toFixed(2);
  const gramsStr = roundTo(grams, 2).toFixed(2);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';

  return inputs(
    <ResultCard
      primary={tbspStr}
      unit={Math.abs(tbsp - 1) < 1e-9 ? 'tablespoon' : 'tablespoons'}
      secondary={toKitchenMeasure(grams / perCup)}
      sourceLine={`${trimDecimal(oz, 2)} oz = ${gramsStr} g of ${ing.name.toLowerCase()}`}
      otherSourceLine={MUTED}
      math={`${gramsStr} g ÷ ${roundTo(perTbsp, 2).toFixed(2)} g per tbsp = ${tbspStr} tbsp`}
      shareParams={`oz=${encodeURIComponent(ouncesText.trim())}&type=weight&ing=${ingredientId}&src=${source}`}
      copyText={`${ouncesText.trim()} oz of ${ing.name.toLowerCase()} = ${tbspStr} tbsp (${sourceLabel}).`}
      ingredientForEvent={ingredientId}
      toolName={TOOL}
    />,
  );
}
