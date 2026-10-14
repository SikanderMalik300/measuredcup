// Rounding helpers. Binary floating point makes values like 28.35 round the wrong way with a naive
// Math.round, so roundTo collapses the tiny error with toPrecision before rounding.

export function roundTo(x: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(Number((x * f).toPrecision(15))) / f;
}

/** Round up a count, pre-rounding to remove floating-point noise (build spec A11). */
export const ceilCount = (x: number): number => Math.ceil(Math.round(x * 1e6) / 1e6);

/**
 * Grams display rule (build spec A6.2): never more than 1 decimal under 100 g, whole grams at
 * 100 g and above.
 */
export function formatGrams(grams: number): string {
  if (grams >= 100) return String(Math.round(grams));
  const r = roundTo(grams, 1);
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}
