'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Share2, Printer, Check } from 'lucide-react';
import { parseAmount } from '@/lib/calc/fraction';
import { trimDecimal } from '@/lib/calc/round';
import { tspTbspResult } from '@/lib/calc/tables';
import { track } from '@/lib/analytics';
import { Field, TextInput } from './ui';

type From = 'tablespoons' | 'teaspoons';

const TOOL = 'teaspoons-in-a-tablespoon';
const MUTED = 'US tablespoon. An Australian tablespoon is 20 mL, which is 4 teaspoons.';

export function TspTbspTool() {
  const [amountText, setAmountText] = useState('1');
  const [from, setFrom] = useState<From>('tablespoons');
  const [copied, setCopied] = useState(false);
  const [showMath, setShowMath] = useState(false);

  const amount = useMemo(() => parseAmount(amountText), [amountText]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (amount != null) track('tool_used', { tool: TOOL });
    }, 150);
    return () => clearTimeout(t);
  }, [amount, from]);

  const toggle = (
    <div role="group" aria-label="Convert from" className="inline-flex rounded-pill border border-line bg-surface p-1">
      {(['tablespoons', 'teaspoons'] as From[]).map((v) => {
        const active = from === v;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            onClick={() => setFrom(v)}
            className="min-h-[36px] rounded-pill px-4 text-small capitalize"
            style={active ? { background: 'var(--brand)', color: '#fff' } : { color: 'var(--ink)' }}
          >
            {v}
          </button>
        );
      })}
    </div>
  );

  const inputs = (children: React.ReactNode) => (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount" htmlFor="tt-amount" hint="Fractions like 1/2 work">
          <TextInput id="tt-amount" inputMode="text" value={amountText} onChange={(e) => setAmountText(e.target.value)} />
        </Field>
        <Field label="From" htmlFor="tt-from">
          <div id="tt-from">{toggle}</div>
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

  const r = tspTbspResult(amount, from);
  const lineThree = `${r.cupsLabel} ${r.cupsWord} · ${r.flOzLabel} fl oz · ${r.mlLabel} mL`;

  let big: string;
  let bigWord: string;
  let secondary: string;
  let third: string | null;
  let math: string;

  if (from === 'tablespoons') {
    big = r.tspBig;
    bigWord = Math.abs(r.tsp - 1) < 1e-9 ? 'teaspoon' : 'teaspoons';
    secondary = `${r.amountToken} tbsp · ${lineThree}`;
    third = null;
    math = `${r.amountToken} tbsp × 3 = ${r.tspBig} tsp`;
  } else {
    big = r.tbspBig;
    bigWord = Math.abs(r.tbsp - 1) < 1e-9 ? 'tablespoon' : 'tablespoons';
    secondary = r.spoonLabel;
    third = lineThree;
    math = `${r.amountToken} tsp ÷ 3 = ${trimDecimal(r.tbsp, 3)} tbsp = ${r.spoonLabel}`;
  }

  const copyText =
    from === 'tablespoons'
      ? `${amountText.trim()} tbsp = ${r.tspBig} tsp (${r.amountToken} tbsp · ${lineThree}).`
      : `${amountText.trim()} tsp = ${r.tbspBig} tbsp (${r.spoonLabel}; ${lineThree}).`;
  const shareParams = `amt=${encodeURIComponent(amountText.trim())}&from=${from}`;
  const shareUrl = () =>
    typeof window === 'undefined' ? '' : `${window.location.origin}${window.location.pathname}?${shareParams}`;

  const doCopy = async (text: string, event: 'copy_result' | 'share_link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
    track(event, { tool: TOOL });
  };

  return inputs(
    <div className="mt-4 rounded-card p-5" style={{ background: 'var(--band-1)' }}>
      <div aria-live="polite">
        <p className="tabular leading-none">
          <span className="text-result">{big}</span>
          <span className="ml-2 text-[20px] font-medium">{bigWord}</span>
        </p>
        <p className="mt-2 tabular text-ink">{secondary}</p>
        {third && <p className="mt-1 text-small text-muted">{third}</p>}
        <p className="mt-1 text-small text-muted">{MUTED}</p>
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
            track('print', { tool: TOOL });
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
