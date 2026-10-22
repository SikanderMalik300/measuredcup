'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Printer, Check } from 'lucide-react';
import { scaleRecipe, scaleFactor } from '@/lib/calc/scale';
import { track } from '@/lib/analytics';
import { useEmbed } from './embed-context';
import { Field, TextInput } from './ui';

const DEFAULT_LIST = `2 cups all-purpose flour
3/4 cup sugar
1/2 cup butter
2 eggs
1 tsp baking powder
1/4 tsp salt`;

export function RecipeScalerTool() {
  const embed = useEmbed();
  const [original, setOriginal] = useState('4');
  const [next, setNext] = useState('6');
  const [list, setList] = useState(DEFAULT_LIST);
  const [copied, setCopied] = useState(false);

  const factor = useMemo(() => {
    const o = Number(original);
    const n = Number(next);
    if (!Number.isFinite(o) || !Number.isFinite(n)) return 1;
    return scaleFactor(o, n);
  }, [original, next]);

  const results = useMemo(() => scaleRecipe(list, factor), [list, factor]);

  useEffect(() => {
    if (embed) return;
    const t = setTimeout(() => track('tool_used', { tool: 'recipe-scaler' }), 150);
    return () => clearTimeout(t);
  }, [factor, list, embed]);

  const copyText = results
    .filter((r) => r.original.trim() !== '')
    .map((r) => r.scaled)
    .join('\n');

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
    if (!embed) track('copy_result', { tool: 'recipe-scaler' });
  };

  return (
    <div className="card p-4 shadow-panel md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Original servings" htmlFor="rs-original">
          <TextInput id="rs-original" inputMode="decimal" value={original} onChange={(e) => setOriginal(e.target.value)} />
        </Field>
        <Field label="New servings" htmlFor="rs-new" hint={`Scale factor ${trim(factor)}`}>
          <TextInput id="rs-new" inputMode="decimal" value={next} onChange={(e) => setNext(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Ingredient list (one per line)" htmlFor="rs-list">
          <textarea
            id="rs-list"
            rows={7}
            value={list}
            onChange={(e) => setList(e.target.value)}
            className="w-full rounded-card border border-line bg-surface p-3 text-[16px] text-ink"
          />
        </Field>
      </div>

      <div className="mt-4 rounded-card p-5" style={{ background: 'var(--band-1)' }}>
        <div aria-live="polite">
          <h3 className="text-h3">Scaled recipe</h3>
          <ul className="mt-3 space-y-1">
            {results.map((r, i) =>
              r.original.trim() === '' ? (
                <li key={i} aria-hidden="true" className="h-2" />
              ) : (
                <li key={i} className="tabular text-ink">
                  {r.scaled}
                  {r.notScaled && (
                    <span className="ml-2 rounded-pill border border-line px-2 py-0.5 text-small text-muted">
                      not scaled
                    </span>
                  )}
                  {r.note && <span className="ml-2 text-small text-muted">{r.note}</span>}
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" className="btn-secondary" onClick={doCopy}>
            {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
            Copy
          </button>
          {!embed && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                track('print', { tool: 'recipe-scaler' });
                window.print();
              }}
            >
              <Printer size={16} strokeWidth={1.5} />
              Print
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function trim(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 1000) / 1000);
}
