// Fraction parsing and kitchen-fraction formatting.

const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 1 / 2,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '¼': 1 / 4,
  '¾': 3 / 4,
  '⅛': 1 / 8,
  '⅜': 3 / 8,
  '⅝': 5 / 8,
  '⅞': 7 / 8,
  '⅙': 1 / 6,
  '⅕': 1 / 5,
};

/**
 * Parse an amount from recipe text. Accepts whole numbers, decimals, simple fractions ("3/4"),
 * mixed numbers ("2 1/4"), and unicode fractions (½ ⅓ ¼ ¾ ⅔ ⅛). Returns null when nothing parses.
 */
export function parseAmount(input: string): number | null {
  if (input == null) return null;
  let s = String(input).trim().toLowerCase();
  if (s === '') return null;

  // Replace unicode fractions with " a/b", keeping a space so "1½" becomes "1 1/2".
  for (const [glyph, value] of Object.entries(UNICODE_FRACTIONS)) {
    if (s.includes(glyph)) {
      const frac = unicodeToFraction(value);
      s = s.split(glyph).join(' ' + frac + ' ');
    }
  }
  s = s.replace(/\s+/g, ' ').trim();

  // Mixed number: "2 1/4"
  const mixed = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const [, whole, num, den] = mixed;
    const d = Number(den);
    if (d === 0) return null;
    return Number(whole) + Number(num) / d;
  }

  // Simple fraction: "3/4"
  const frac = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const d = Number(frac[2]);
    if (d === 0) return null;
    return Number(frac[1]) / d;
  }

  // Decimal or whole number.
  const num = s.match(/^\d*\.?\d+$/);
  if (num) return Number(s);

  return null;
}

function unicodeToFraction(value: number): string {
  const map: Record<string, string> = {
    [String(1 / 2)]: '1/2',
    [String(1 / 3)]: '1/3',
    [String(2 / 3)]: '2/3',
    [String(1 / 4)]: '1/4',
    [String(3 / 4)]: '3/4',
    [String(1 / 8)]: '1/8',
    [String(3 / 8)]: '3/8',
    [String(5 / 8)]: '5/8',
    [String(7 / 8)]: '7/8',
    [String(1 / 6)]: '1/6',
    [String(1 / 5)]: '1/5',
  };
  return map[String(value)] ?? String(value);
}

// Kitchen fractions the site is allowed to show (build spec A2).
export const KITCHEN_FRACTIONS: { value: number; label: string }[] = [
  { value: 1 / 8, label: '1/8' },
  { value: 1 / 4, label: '1/4' },
  { value: 1 / 3, label: '1/3' },
  { value: 3 / 8, label: '3/8' },
  { value: 1 / 2, label: '1/2' },
  { value: 5 / 8, label: '5/8' },
  { value: 2 / 3, label: '2/3' },
  { value: 3 / 4, label: '3/4' },
  { value: 7 / 8, label: '7/8' },
];

/**
 * Format a value as kitchen fractions only. Returns the whole number plus the nearest kitchen
 * fraction, e.g. 1.6667 -> "1 2/3", 0.75 -> "3/4", 2 -> "2".
 */
export function formatFraction(x: number): string {
  const whole = Math.floor(x + 1e-9);
  const frac = x - whole;
  if (frac < 1e-9) return String(whole);

  // Nearest kitchen fraction, allowing rounding up to the next whole number.
  let best = KITCHEN_FRACTIONS[0];
  let bestDiff = Math.abs(frac - best.value);
  for (const kf of KITCHEN_FRACTIONS) {
    const d = Math.abs(frac - kf.value);
    if (d < bestDiff) {
      bestDiff = d;
      best = kf;
    }
  }
  // Rounds up to a whole number?
  if (Math.abs(frac - 1) < bestDiff) {
    return String(whole + 1);
  }
  return whole === 0 ? best.label : `${whole} ${best.label}`;
}

/** True when x is (within tolerance) a whole multiple of 1/8. */
export function isEighthMultiple(x: number, tol = 1e-6): boolean {
  const eighths = x * 8;
  return Math.abs(eighths - Math.round(eighths)) < tol;
}
