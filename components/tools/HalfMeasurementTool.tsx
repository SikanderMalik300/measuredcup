'use client';

import { useEffect, useMemo, useState } from 'react';
import { parseAmount } from '@/lib/calc/fraction';
import { toKitchenMeasure } from '@/lib/calc/kitchen';
import { roundTo } from '@/lib/calc/round';
import { ML_PER_CUP } from '@/lib/data/constants';
import { track } from '@/lib/analytics';
import { Field, TextInput, ResultCard } from './ui';

type Unit = 'cups' | 'tbsp' | 'tsp';
type Op = 'half' | 'third' | 'double' | 'custom';

const TO_CUPS: Record<Unit, number> = { cups: 1, tbsp: 1 / 16, tsp: 1 / 48 };

export function HalfMeasurementTool() {
  const [amountText, setAmountText] = useState('3/4');
  const [unit, setUnit] = useState<Unit>('cups');
  const [op, setOp] = useState<Op>('half');
  const [customFactor, setCustomFactor] = useState('1.5');

  const amount = useMemo(() => parseAmount(amountText), [amountText]);
  const factor = useMemo(() => {
    switch (op) {
      case 'half':
        return 0.5;
      case 'third':
        return 1 / 3;
      case 'double':
        return 2;
      case 'custom':
        return parseAmount(customFactor) ?? 1;
    }
  }, [op, customFactor]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (amount != null) track('tool_used', { tool: 'half-a-measurement' });
    }, 150);
    return () => clearTimeout(t);
  }, [amount, unit, factor]);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount" htmlFor="half-amount" hint="Fractions are fine, like 3/4 or 1 1/2">
          <TextInput id="half-amount" inputMode="text" value={amountText} onChange={(e) => setAmountText(e.target.value)} />
        </Field>
        <Field label="Unit" htmlFor="half-unit">
          <select
            id="half-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="h-12 w-full rounded-pill border border-line bg-surface px-4 text-[16px] text-ink"
          >
            <option value="cups">Cups</option>
            <option value="tbsp">Tablespoons</option>
            <option value="tsp">Teaspoons</option>
          </select>
        </Field>
        <Field label="Operation" htmlFor="half-op">
          <select
            id="half-op"
            value={op}
            onChange={(e) => setOp(e.target.value as Op)}
            className="h-12 w-full rounded-pill border border-line bg-surface px-4 text-[16px] text-ink"
          >
            <option value="half">Half</option>
            <option value="third">One third</option>
            <option value="double">Double</option>
            <option value="custom">Custom factor</option>
          </select>
        </Field>
        {op === 'custom' && (
          <Field label="Factor" htmlFor="half-factor">
            <TextInput id="half-factor" inputMode="decimal" value={customFactor} onChange={(e) => setCustomFactor(e.target.value)} />
          </Field>
        )}
      </div>
      {children}
    </div>
  );

  if (amount == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Type an amount to halve, third or double.
      </div>,
    );
  }

  const resultCups = amount * TO_CUPS[unit] * factor;
  const primary = toKitchenMeasure(resultCups);
  const totalTbsp = roundTo(resultCups * 16, 2);
  const ml = roundTo(resultCups * ML_PER_CUP, 1);
  const secondary = `= ${trimNum(totalTbsp)} tbsp = ${ml} mL`;
  const opLabel = op === 'half' ? 'Half' : op === 'third' ? 'One third' : op === 'double' ? 'Double' : `×${trimNum(factor)}`;
  const copyText = `${opLabel} of ${amountText.trim()} ${unit} = ${primary}.`;
  const shareParams = `amt=${encodeURIComponent(amountText.trim())}&unit=${unit}&op=${op}${op === 'custom' ? `&f=${encodeURIComponent(customFactor)}` : ''}`;

  return inputs(
    <ResultCard
      primary={primary}
      secondary={secondary}
      copyText={copyText}
      shareParams={shareParams}
      toolName="half-a-measurement"
    />,
  );
}

function trimNum(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n);
}
