'use client';

import { useId, useState } from 'react';
import { Copy, Share2, Printer, Check } from 'lucide-react';
import { track } from '@/lib/analytics';
import { INGREDIENT_GROUPS, INGREDIENTS } from '@/lib/data/ingredients';
import { useEmbed } from './embed-context';

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-small font-medium text-muted">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {hint && <p className="mt-1 text-small text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full rounded-pill border border-line bg-surface px-4 text-[16px] tabular text-ink"
    />
  );
}

export function IngredientSelect({
  id,
  value,
  onChange,
  extraOption,
}: {
  id: string;
  value: string;
  onChange: (id: string) => void;
  extraOption?: { value: string; label: string };
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-pill border border-line bg-surface px-4 text-[16px] text-ink"
    >
      {extraOption && <option value={extraOption.value}>{extraOption.label}</option>}
      {INGREDIENT_GROUPS.map((group) => (
        <optgroup key={group} label={group}>
          {INGREDIENTS.filter((i) => i.group === group).map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export type SourceValue = 'usda' | 'kingArthur';

export function SegmentedSource({
  value,
  onChange,
}: {
  value: SourceValue;
  onChange: (v: SourceValue) => void;
}) {
  const options: { v: SourceValue; label: string }[] = [
    { v: 'usda', label: 'USDA' },
    { v: 'kingArthur', label: 'King Arthur' },
  ];
  return (
    <div
      role="group"
      aria-label="Data source"
      className="inline-flex rounded-pill border border-line bg-surface p-1"
    >
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.v)}
            className="min-h-[36px] rounded-pill px-4 text-small"
            style={
              active
                ? { background: 'var(--brand)', color: '#fff' }
                : { color: 'var(--ink)' }
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ResultCard({
  primary,
  unit,
  secondary,
  sourceLine,
  otherSourceLine,
  math,
  shareParams,
  copyText,
  ingredientForEvent,
  toolName,
}: {
  primary: string;
  unit?: string;
  secondary?: string;
  sourceLine?: string;
  otherSourceLine?: string;
  math?: string;
  shareParams?: string;
  copyText: string;
  ingredientForEvent?: string;
  toolName: string;
}) {
  const [showMath, setShowMath] = useState(false);
  const [copied, setCopied] = useState(false);
  const mathId = useId();
  const embed = useEmbed();

  const copy = async (text: string, event: 'copy_result' | 'share_link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
    if (!embed) track(event, { tool: toolName, ingredient: ingredientForEvent });
  };

  const shareUrl = () => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return shareParams ? `${base}?${shareParams}` : base;
  };

  return (
    <div className="mt-4 rounded-card p-5" style={{ background: 'var(--band-1)' }}>
      <div aria-live="polite">
        <p className="tabular leading-none">
          <span className="text-result">{primary}</span>
          {unit && <span className="ml-2 text-[20px] font-medium">{unit}</span>}
        </p>
        {secondary && <p className="mt-2 tabular text-ink">{secondary}</p>}
        {sourceLine && <p className="mt-1 text-small text-muted">{sourceLine}</p>}
        {otherSourceLine && <p className="mt-1 text-small text-muted">{otherSourceLine}</p>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {math && (
          <button
            type="button"
            className="btn-secondary"
            aria-expanded={showMath}
            aria-controls={mathId}
            onClick={() => setShowMath((v) => !v)}
          >
            Show the math
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={() => copy(copyText, 'copy_result')}>
          {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
          Copy
        </button>
        {!embed && (
          <>
            <button type="button" className="btn-secondary" onClick={() => copy(shareUrl(), 'share_link')}>
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
          </>
        )}
      </div>

      {math && showMath && (
        <p id={mathId} className="mt-3 text-small text-ink">
          {math}
        </p>
      )}
    </div>
  );
}
