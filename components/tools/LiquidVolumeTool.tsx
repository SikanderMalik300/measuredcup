'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Share2, Printer, Check } from 'lucide-react';
import { parseAmount } from '@/lib/calc/fraction';
import { trimDecimal } from '@/lib/calc/round';
import { liquidVolumeConvert, formatMl, ML_PER_LIQUID_UNIT, type LiquidUnit } from '@/lib/calc/tables';
import { track } from '@/lib/analytics';
import { Field, TextInput } from './ui';

const UNITS: { v: LiquidUnit; label: string }[] = [
  { v: 'gallons', label: 'Gallons' },
  { v: 'quarts', label: 'Quarts' },
  { v: 'pints', label: 'Pints' },
  { v: 'cups', label: 'Cups' },
  { v: 'fluid-ounces', label: 'Fluid ounces' },
  { v: 'tablespoons', label: 'Tablespoons' },
  { v: 'milliliters', label: 'Milliliters' },
  { v: 'liters', label: 'Liters' },
];

export function LiquidVolumeTool({
  defaultUnit = 'quarts',
  toolName = 'cups-in-a-quart',
}: {
  defaultUnit?: LiquidUnit;
  toolName?: string;
} = {}) {
  const [amountText, setAmountText] = useState('1');
  const [from, setFrom] = useState<LiquidUnit>(defaultUnit);
  const [copied, setCopied] = useState(false);
  const [showMath, setShowMath] = useState(false);

  const amount = useMemo(() => parseAmount(amountText), [amountText]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (amount != null) track('tool_used', { tool: toolName });
    }, 150);
    return () => clearTimeout(t);
  }, [amount, from, toolName]);

  const doCopy = async (text: string, event: 'copy_result' | 'share_link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
    track(event, { tool: toolName });
  };

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount" htmlFor="lv-amount" hint="Fractions like 1 1/2 work">
          <TextInput id="lv-amount" inputMode="text" value={amountText} onChange={(e) => setAmountText(e.target.value)} />
        </Field>
        <Field label="From unit" htmlFor="lv-from">
          <select
            id="lv-from"
            value={from}
            onChange={(e) => setFrom(e.target.value as LiquidUnit)}
            className="h-12 w-full rounded-pill border border-line bg-surface px-4 text-[16px] text-ink"
          >
            {UNITS.map((u) => (
              <option key={u.v} value={u.v}>{u.label}</option>
            ))}
          </select>
        </Field>
      </div>
      {children}
    </div>
  );

  if (amount == null) {
    return inputs(
      <div className="mt-4 rounded-card p-5 text-muted" style={{ background: 'var(--band-1)' }}>
        Type an amount to convert.
      </div>,
    );
  }

  const r = liquidVolumeConvert(amount, from);
  const cupsStr = trimDecimal(r.cups, 3);
  const cupsWord = Math.abs(r.cups - 1) < 1e-9 ? 'cup' : 'cups';

  const rows: { label: string; value: string }[] = [
    { label: 'Gallons', value: trimDecimal(r.gallons, 3) },
    { label: 'Quarts', value: trimDecimal(r.quarts, 3) },
    { label: 'Pints', value: trimDecimal(r.pints, 3) },
    { label: 'Fluid ounces', value: trimDecimal(r.flOz, 2) },
    { label: 'Tablespoons', value: trimDecimal(r.tbsp, 1) },
    { label: 'Milliliters', value: formatMl(r.ml) },
    { label: 'Liters', value: trimDecimal(r.liters, 2) },
  ];

  const cupsPerUnit = ML_PER_LIQUID_UNIT[from] / ML_PER_LIQUID_UNIT.cups;
  const math = `${amount} × ${trimDecimal(cupsPerUnit, 3)} = ${cupsStr} cups`;
  const copyText = `${amountText.trim()} ${from.replace('-', ' ')} = ${cupsStr} cups, ${trimDecimal(r.quarts, 3)} quarts, ${trimDecimal(r.pints, 3)} pints, ${trimDecimal(r.flOz, 2)} fl oz, ${formatMl(r.ml)} mL.`;
  const shareParams = `amt=${encodeURIComponent(amountText.trim())}&from=${from}`;
  const shareUrl = () =>
    typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}?${shareParams}`;

  return inputs(
    <div className="mt-4 rounded-card p-5" style={{ background: 'var(--band-1)' }}>
      <div aria-live="polite">
        <p className="tabular leading-none">
          <span className="text-result">{cupsStr}</span>
          <span className="ml-2 text-[20px] font-medium">{cupsWord}</span>
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-small sm:grid-cols-3">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-2 border-b border-line py-1">
              <dt className="text-muted">{row.label}</dt>
              <dd className="tabular text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary" aria-expanded={showMath} onClick={() => setShowMath((v) => !v)}>
          Show the math
        </button>
        <button type="button" className="btn-secondary" onClick={() => doCopy(copyText, 'copy_result')}>
          {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
          Copy
        </button>
        <button type="button" className="btn-secondary" onClick={() => doCopy(shareUrl(), 'share_link')}>
          <Share2 size={16} strokeWidth={1.5} />
          Share
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            track('print', { tool: toolName });
            window.print();
          }}
        >
          <Printer size={16} strokeWidth={1.5} />
          Print
        </button>
      </div>
      {showMath && <p className="mt-3 text-small text-ink">{math}</p>}
    </div>,
  );
}
