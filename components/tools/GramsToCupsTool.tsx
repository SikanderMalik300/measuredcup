'use client';

import { useEffect, useMemo, useState } from 'react';
import { getIngredient, gramsPerCup, differencePercent } from '@/lib/data/ingredients';
import { gramsToCups, formatCupsDecimal } from '@/lib/calc/convert';
import { toKitchenMeasure } from '@/lib/calc/kitchen';
import { formatFraction } from '@/lib/calc/fraction';
import { track } from '@/lib/analytics';
import { useEmbed } from './embed-context';
import { Field, TextInput, IngredientSelect, SegmentedSource, ResultCard, type SourceValue } from './ui';

const STORAGE_KEY = 'mc-ingredient';

function cupsWord(cups: number) {
  return cups > 1 + 1e-9 ? 'cups' : 'cup';
}

export function GramsToCupsTool() {
  const embed = useEmbed();
  const [grams, setGrams] = useState('200');
  const [ingredientId, setIngredientId] = useState('ap-flour');
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
  const g = useMemo(() => {
    const n = Number(grams);
    return Number.isFinite(n) && grams.trim() !== '' ? n : null;
  }, [grams]);

  useEffect(() => {
    if (embed) return;
    const t = setTimeout(() => {
      if (g != null) track('tool_used', { tool: 'grams-to-cups', ingredient: ingredientId });
    }, 150);
    return () => clearTimeout(t);
  }, [g, ingredientId, source, embed]);

  if (g == null) {
    return (
      <Inputs
        grams={grams}
        setGrams={setGrams}
        ingredientId={ingredientId}
        onIngredient={onIngredient}
        source={source}
        setSource={setSource}
      >
        <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
          Enter a weight in grams to see the cups.
        </div>
      </Inputs>
    );
  }

  const perCup = gramsPerCup(ing, source);
  const cups = gramsToCups(g, ingredientId, source);
  const cupsDec = formatCupsDecimal(cups);
  const secondary = toKitchenMeasure(cups);
  const sourceLabel = source === 'usda' ? 'USDA' : 'King Arthur';
  const sourceLine = `Using ${sourceLabel}: 1 cup ${ing.name.toLowerCase()} = ${perCup} g`;

  // Other source line when the two differ by more than 3%.
  let otherSourceLine: string | undefined;
  const diff = differencePercent(ing);
  if (ing.kaGramsPerCup != null && diff != null && Math.abs(diff) > 3) {
    const otherIsKa = source === 'usda';
    const otherPerCup = otherIsKa ? ing.kaGramsPerCup : ing.usdaGramsPerCup;
    const otherName = otherIsKa ? 'King Arthur' : 'USDA';
    const otherCups = g / otherPerCup;
    otherSourceLine = `${otherName}'s figure (${otherPerCup} g per cup) gives ${formatFraction(otherCups)} ${cupsWord(otherCups)}.`;
  }

  const math = `${g} g ÷ ${perCup} g per cup = ${cupsDec} cups, which is ${secondary}.`;
  const copyText = `${g} g ${ing.name.toLowerCase()} = ${cupsDec} cups (${secondary}), using ${sourceLabel}.`;
  const shareParams = `g=${g}&ing=${ingredientId}&src=${source}`;

  return (
    <Inputs
      grams={grams}
      setGrams={setGrams}
      ingredientId={ingredientId}
      onIngredient={onIngredient}
      source={source}
      setSource={setSource}
    >
      <ResultCard
        primary={cupsDec}
        unit={cupsWord(cups) === 'cups' ? 'cups' : 'cup'}
        secondary={secondary}
        sourceLine={sourceLine}
        otherSourceLine={otherSourceLine}
        math={math}
        shareParams={shareParams}
        copyText={copyText}
        ingredientForEvent={ingredientId}
        toolName="grams-to-cups"
      />
    </Inputs>
  );
}

function Inputs({
  grams,
  setGrams,
  ingredientId,
  onIngredient,
  source,
  setSource,
  children,
}: {
  grams: string;
  setGrams: (v: string) => void;
  ingredientId: string;
  onIngredient: (id: string) => void;
  source: SourceValue;
  setSource: (v: SourceValue) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Grams" htmlFor="g2c-grams">
          <TextInput
            id="g2c-grams"
            inputMode="decimal"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
        </Field>
        <Field label="Ingredient" htmlFor="g2c-ingredient">
          <IngredientSelect id="g2c-ingredient" value={ingredientId} onChange={onIngredient} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Data source" htmlFor="g2c-source">
          <div id="g2c-source">
            <SegmentedSource value={source} onChange={setSource} />
          </div>
        </Field>
      </div>
      {children}
    </div>
  );
}
