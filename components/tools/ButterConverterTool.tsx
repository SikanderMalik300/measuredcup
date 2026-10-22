'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Share2, Printer, Check } from 'lucide-react';
import { butterConvert, type ButterUnit } from '@/lib/calc/convert';
import { parseAmount } from '@/lib/calc/fraction';
import { formatGrams, roundTo } from '@/lib/calc/round';
import { track } from '@/lib/analytics';
import { useEmbed } from './embed-context';
import { Field, TextInput } from './ui';

const UNITS: { v: ButterUnit; label: string }[] = [
  { v: 'sticks', label: 'Sticks' },
  { v: 'cups', label: 'Cups' },
  { v: 'tablespoons', label: 'Tablespoons' },
  { v: 'teaspoons', label: 'Teaspoons' },
  { v: 'grams', label: 'Grams' },
  { v: 'ounces', label: 'Ounces' },
  { v: 'pounds', label: 'Pounds' },
];

export function ButterConverterTool() {
  const embed = useEmbed();
  const [amountText, setAmountText] = useState('250');
  const [from, setFrom] = useState<ButterUnit>('grams');
  const [copied, setCopied] = useState(false);

  const amount = useMemo(() => parseAmount(amountText), [amountText]);

  useEffect(() => {
    if (embed) return;
    const t = setTimeout(() => {
      if (amount != null) track('tool_used', { tool: 'butter-converter' });
    }, 150);
    return () => clearTimeout(t);
  }, [amount, from, embed]);

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount" htmlFor="btr-amount" hint="Fractions are fine">
          <TextInput id="btr-amount" inputMode="text" value={amountText} onChange={(e) => setAmountText(e.target.value)} />
        </Field>
        <Field label="From unit" htmlFor="btr-from">
          <select
            id="btr-from"
            value={from}
            onChange={(e) => setFrom(e.target.value as ButterUnit)}
            className="h-12 w-full rounded-pill border border-line bg-surface px-4 text-[16px] text-ink"
          >
            {UNITS.map((u) => (
              <option key={u.v} value={u.v}>
                {u.label}
              </option>
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
        Type an amount of butter to convert.
      </div>,
    );
  }

  const r = butterConvert(amount, from);
  const rows: { label: string; value: string }[] = [
    { label: 'Sticks', value: `${roundTo(r.sticks, 1)}` },
    { label: 'Closest cut', value: r.stickCut },
    { label: 'Cups', value: `${roundTo(r.cups, 1)}` },
    { label: 'Tablespoons', value: `${roundTo(r.tablespoons, 1)}` },
    { label: 'Teaspoons', value: `${roundTo(r.teaspoons, 1)}` },
    { label: 'Grams', value: `${formatGrams(r.grams)} g` },
    { label: 'Ounces', value: `${roundTo(r.ounces, 1)} oz` },
    { label: 'Pounds', value: `${roundTo(r.pounds, 2)} lb` },
  ];

  const copyText = `${amountText.trim()} ${from} butter = ${roundTo(r.sticks, 1)} sticks, ${roundTo(
    r.cups,
    1,
  )} cups, ${roundTo(r.tablespoons, 1)} tbsp, ${formatGrams(r.grams)} g, ${roundTo(r.ounces, 1)} oz.`;
  const shareParams = `amt=${encodeURIComponent(amountText.trim())}&from=${from}`;

  const doCopy = async (text: string, event: 'copy_result' | 'share_link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
    if (!embed) track(event, { tool: 'butter-converter' });
  };
  const shareUrl = () =>
    typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}?${shareParams}`;

  return inputs(
    <div className="mt-4 rounded-card p-5" style={{ background: 'var(--band-1)' }}>
      <div aria-live="polite">
        <p className="tabular leading-none">
          <span className="text-result">{roundTo(r.sticks, 1)}</span>
          <span className="ml-2 text-[20px] font-medium">sticks</span>
        </p>
        <p className="mt-2 tabular text-ink">{r.stickCut}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-small sm:grid-cols-3">
          {rows.slice(2).map((row) => (
            <div key={row.label} className="flex justify-between gap-2 border-b border-line py-1">
              <dt className="text-muted">{row.label}</dt>
              <dd className="tabular text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary" onClick={() => doCopy(copyText, 'copy_result')}>
          {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
          Copy
        </button>
        {!embed && (
          <>
            <button type="button" className="btn-secondary" onClick={() => doCopy(shareUrl(), 'share_link')}>
              <Share2 size={16} strokeWidth={1.5} />
              Share
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                track('print', { tool: 'butter-converter' });
                window.print();
              }}
            >
              <Printer size={16} strokeWidth={1.5} />
              Print
            </button>
          </>
        )}
      </div>
    </div>,
  );
}
