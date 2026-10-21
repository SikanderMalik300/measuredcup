'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { parseAmount } from '@/lib/calc/fraction';
import { trimDecimal } from '@/lib/calc/round';
import { toKitchenMeasure } from '@/lib/calc/kitchen';
import { formatMl, mlToTbsp, mlToFlOz, CUP_TYPES, type CupType } from '@/lib/calc/tables';
import { ML_PER_LEGAL_CUP, ML_PER_METRIC_CUP } from '@/lib/data/constants';
import { track } from '@/lib/analytics';
import { Field, TextInput, ResultCard } from './ui';

const CUP_OPTIONS: { v: CupType; label: string }[] = [
  { v: 'us', label: 'US cup' },
  { v: 'label', label: 'Label cup' },
  { v: 'metric', label: 'Metric cup' },
];

export function CupsMlTool({ direction }: { direction: 'cupsToMl' | 'mlToCups' }) {
  const isCupsToMl = direction === 'cupsToMl';
  const [amountText, setAmountText] = useState(isCupsToMl ? '1' : '250');
  const [cupType, setCupType] = useState<CupType>('us');

  const amount = useMemo(() => parseAmount(amountText), [amountText]);
  const cupMl = CUP_TYPES[cupType].ml;
  const toolName = isCupsToMl ? 'cups-to-ml' : 'ml-to-cups';
  const swap = isCupsToMl
    ? { href: '/ml-to-cups/', text: 'Switch to mL to cups' }
    : { href: '/cups-to-ml/', text: 'Switch to cups to mL' };

  useEffect(() => {
    const t = setTimeout(() => {
      if (amount != null) track('tool_used', { tool: toolName });
    }, 150);
    return () => clearTimeout(t);
  }, [amount, cupType, toolName]);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={isCupsToMl ? 'Cups' : 'Milliliters'}
          htmlFor="cml-amount"
          hint={isCupsToMl ? 'Fractions like 2/3 or 1 1/2 work' : undefined}
        >
          <TextInput
            id="cml-amount"
            inputMode={isCupsToMl ? 'text' : 'decimal'}
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
          />
        </Field>
        <Field label="Cup type" htmlFor="cml-cup">
          <div id="cml-cup" role="group" aria-label="Cup type" className="inline-flex flex-wrap rounded-pill border border-line bg-surface p-1">
            {CUP_OPTIONS.map((o) => {
              const active = cupType === o.v;
              return (
                <button
                  key={o.v}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCupType(o.v)}
                  className="min-h-[36px] rounded-pill px-3 text-small"
                  style={active ? { background: 'var(--brand)', color: '#fff' } : { color: 'var(--ink)' }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </Field>
      </div>
      <p className="mt-3 text-small">
        <Link href={swap.href} prefetch={false} className="link">{swap.text}</Link>
      </p>
      {children}
    </div>
  );

  if (amount == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        {isCupsToMl ? 'Type a cup amount to convert.' : 'Type a millilitre amount to convert.'}
      </div>,
    );
  }

  const cupMlDisplay = trimDecimal(cupMl, 1);

  if (isCupsToMl) {
    const ml = amount * cupMl;
    const mlStr = formatMl(ml);
    const secondary = `= ${mlToTbsp(ml)} tbsp · ${mlToFlOz(ml)} fl oz (US)`;
    const sourceLine = `Same amount in other cups: ${formatMl(amount * ML_PER_LEGAL_CUP)} mL (label cup) · ${formatMl(amount * ML_PER_METRIC_CUP)} mL (metric cup)`;
    const math = `${amount} × ${cupMlDisplay} = ${mlStr} mL`;
    const copyText = `${amountText.trim()} ${CUP_TYPES[cupType].label} = ${mlStr} mL.`;
    const shareParams = `amt=${encodeURIComponent(amountText.trim())}&cup=${cupType}`;
    return inputs(
      <ResultCard
        primary={mlStr}
        unit="mL"
        secondary={secondary}
        sourceLine={sourceLine}
        math={math}
        shareParams={shareParams}
        copyText={copyText}
        toolName={toolName}
      />,
    );
  }

  // mL to cups
  const cups = amount / cupMl;
  const cupsStr = trimDecimal(cups, 3);
  const cupsWord = Math.abs(cups - 1) < 1e-9 ? 'cup' : 'cups';
  const secondary = cupType === 'us' ? toKitchenMeasure(cups) : undefined;
  const sourceLine = `= ${mlToTbsp(amount)} tbsp · ${mlToFlOz(amount)} fl oz`;
  const math = `${amount} ÷ ${cupMlDisplay} = ${cupsStr} cups`;
  const copyText = `${amountText.trim()} mL = ${cupsStr} ${cupsWord} (${CUP_TYPES[cupType].label}).`;
  const shareParams = `amt=${encodeURIComponent(amountText.trim())}&cup=${cupType}`;
  return inputs(
    <ResultCard
      primary={cupsStr}
      unit={cupsWord}
      secondary={secondary}
      sourceLine={sourceLine}
      math={math}
      shareParams={shareParams}
      copyText={copyText}
      toolName={toolName}
    />,
  );
}
