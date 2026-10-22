'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup } from '@/lib/data/ingredients';
import { spoonsToGrams, type SpoonUnit } from '@/lib/calc/convert';
import { parseAmount } from '@/lib/calc/fraction';
import { formatGrams, roundTo } from '@/lib/calc/round';
import { track } from '@/lib/analytics';
import { useEmbed } from './embed-context';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

const STORAGE_KEY = 'mc-ingredient';

export function TablespoonsToGramsTool() {
  const embed = useEmbed();
  const [amountText, setAmountText] = useState('3');
  const [unit, setUnit] = useState<SpoonUnit>('tablespoons');
  const [ingredientId, setIngredientId] = useState('butter');
  const [source, setSource] = useState<SourceValue>('usda');

  useEffect(() => {
    if (embed) return;
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
    if (embed) return;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  };

  const ing = getIngredient(ingredientId);
  const amount = useMemo(() => parseAmount(amountText), [amountText]);

  useEffect(() => {
    if (embed) return;
    const t = setTimeout(() => {
      if (amount != null) track('tool_used', { tool: 'tablespoons-to-grams', ingredient: ingredientId });
    }, 150);
    return () => clearTimeout(t);
  }, [amount, unit, ingredientId, source, embed]);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount" htmlFor="t2g-amount" hint="Fractions are fine">
          <TextInput id="t2g-amount" inputMode="text" value={amountText} onChange={(e) => setAmountText(e.target.value)} />
        </Field>
        <Field label="Unit" htmlFor="t2g-unit">
          <select
            id="t2g-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as SpoonUnit)}
            className="h-12 w-full rounded-pill border border-line bg-surface px-4 text-[16px] text-ink"
          >
            <option value="tablespoons">Tablespoons</option>
            <option value="teaspoons">Teaspoons</option>
          </select>
        </Field>
        <Field label="Ingredient" htmlFor="t2g-ingredient">
          <IngredientSelect id="t2g-ingredient" value={ingredientId} onChange={onIngredient} />
        </Field>
        <Field label="Data source" htmlFor="t2g-source">
          <div id="t2g-source">
            <SegmentedSource value={source} onChange={setSource} />
          </div>
        </Field>
      </div>
      {children}
    </div>
  );

  if (amount == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Type how many spoons to convert.
      </div>,
    );
  }

  const grams = spoonsToGrams(amount, unit, ingredientId, source);
  const gramsStr = formatGrams(grams);
  const perUnit = unit === 'tablespoons' ? gramsPerCup(ing, source) / 16 : gramsPerCup(ing, source) / 48;
  const perUnitStr = roundTo(perUnit, unit === 'tablespoons' ? 1 : 1);
  const unitShort = unit === 'tablespoons' ? 'tbsp' : 'tsp';
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';

  // Second line: express the amount in cup terms (e.g. 3 tbsp = 3/16 cup).
  const inCups = unit === 'tablespoons' ? amount / 16 : amount / 48;
  const secondary = `${amountText.trim()} ${unitShort} = ${fracOfCup(inCups)}`;
  const sourceLine = `Using ${sourceLabel}: 1 ${unitShort} ${ing.name.toLowerCase()} = ${perUnitStr} g`;
  const math = `${perCupExpr(ing, source)} ÷ ${unit === 'tablespoons' ? 16 : 48} = ${roundTo(perUnit, 2)} g per ${unitShort}. ${amount} × ${roundTo(perUnit, 2)} = ${roundTo(grams, 1)} g.`;
  const copyText = `${amountText.trim()} ${unitShort} ${ing.name.toLowerCase()} = ${gramsStr} g, using ${sourceLabel}.`;
  const shareParams = `amt=${encodeURIComponent(amountText.trim())}&unit=${unit}&ing=${ingredientId}&src=${source}`;

  return inputs(
    <ResultCard
      primary={gramsStr}
      unit="g"
      secondary={secondary}
      sourceLine={sourceLine}
      math={math}
      shareParams={shareParams}
      copyText={copyText}
      ingredientForEvent={ingredientId}
      toolName="tablespoons-to-grams"
    />,
  );
}

function perCupExpr(ing: ReturnType<typeof getIngredient>, source: SourceValue) {
  return `${gramsPerCup(ing, source)}`;
}

function fracOfCup(cups: number): string {
  // Express small cup fractions with a denominator of 16 where tidy (3 tbsp = 3/16 cup).
  const sixteenths = Math.round(cups * 16);
  if (Math.abs(sixteenths / 16 - cups) < 1e-9 && sixteenths > 0 && sixteenths < 16) {
    return `${sixteenths}/16 cup`;
  }
  const r = Math.round(cups * 1000) / 1000;
  return `${r} cup`;
}
