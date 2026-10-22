import { parseAmount, formatFraction } from './fraction';
import { toKitchenMeasure } from './kitchen';
import { roundTo } from './round';

export interface ScaledLine {
  original: string;
  scaled: string;
  notScaled: boolean;
  note?: string;
}

type UnitKind =
  | 'cups'
  | 'tbsp'
  | 'tsp'
  | 'grams'
  | 'kg'
  | 'oz'
  | 'lb'
  | 'ml'
  | 'l'
  | 'sticks'
  | 'eggs'
  | 'pinch'
  | 'clove'
  | 'count';

// Case-sensitive single letters: T = tablespoon, t = teaspoon, c = cup.
function detectUnit(word: string): { kind: UnitKind; label: string } | null {
  if (word === 'T') return { kind: 'tbsp', label: 'tbsp' };
  if (word === 't') return { kind: 'tsp', label: 'tsp' };
  const w = word.toLowerCase().replace(/[.,]$/, '');
  switch (w) {
    case 'c':
    case 'cup':
    case 'cups':
      return { kind: 'cups', label: 'cup' };
    case 'tbsp':
    case 'tbsps':
    case 'tablespoon':
    case 'tablespoons':
      return { kind: 'tbsp', label: 'tbsp' };
    case 'tsp':
    case 'tsps':
    case 'teaspoon':
    case 'teaspoons':
      return { kind: 'tsp', label: 'tsp' };
    case 'g':
    case 'gram':
    case 'grams':
      return { kind: 'grams', label: 'g' };
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return { kind: 'kg', label: 'kg' };
    case 'oz':
    case 'ounce':
    case 'ounces':
      return { kind: 'oz', label: 'oz' };
    case 'lb':
    case 'lbs':
    case 'pound':
    case 'pounds':
      return { kind: 'lb', label: 'lb' };
    case 'ml':
      return { kind: 'ml', label: 'ml' };
    case 'l':
    case 'liter':
    case 'liters':
    case 'litre':
    case 'litres':
      return { kind: 'l', label: 'l' };
    case 'stick':
    case 'sticks':
      return { kind: 'sticks', label: 'stick' };
    case 'egg':
    case 'eggs':
      return { kind: 'eggs', label: 'egg' };
    case 'pinch':
    case 'pinches':
      return { kind: 'pinch', label: 'pinch' };
    case 'clove':
    case 'cloves':
      return { kind: 'clove', label: 'clove' };
    default:
      return null;
  }
}

const UNICODE_RE = /[½⅓⅔¼¾⅛⅜⅝⅞⅙⅕]/;

function parseLeadingAmount(line: string): { amount: number; rest: string } | null {
  const trimmed = line.trim();
  if (trimmed === '') return null;
  // Split a glued unicode fraction, e.g. "1½" -> "1 ½".
  const s = trimmed.replace(/(\d)([½⅓⅔¼¾⅛⅜⅝⅞⅙⅕])/g, '$1 $2');
  const tokens = s.split(/\s+/);
  if (tokens.length === 0) return null;

  // Mixed number "2 1/4".
  if (tokens.length >= 2 && /^\d+$/.test(tokens[0]) && /^\d+\/\d+$/.test(tokens[1])) {
    const amount = parseAmount(`${tokens[0]} ${tokens[1]}`);
    if (amount != null) return { amount, rest: tokens.slice(2).join(' ') };
  }
  // Whole plus unicode "1 ½".
  if (tokens.length >= 2 && /^\d+$/.test(tokens[0]) && UNICODE_RE.test(tokens[1]) && tokens[1].length === 1) {
    const amount = parseAmount(`${tokens[0]} ${tokens[1]}`);
    if (amount != null) return { amount, rest: tokens.slice(2).join(' ') };
  }
  // Single token.
  const amount = parseAmount(tokens[0]);
  if (amount != null) return { amount, rest: tokens.slice(1).join(' ') };
  return null;
}

function formatPlainNumber(n: number): string {
  const r = roundTo(n, 2);
  return Number.isInteger(r) ? String(r) : String(r);
}

export function scaleLine(line: string, factor: number): ScaledLine {
  const original = line;
  if (line.trim() === '') return { original, scaled: line, notScaled: false };

  const parsed = parseLeadingAmount(line);
  if (!parsed) {
    return { original, scaled: line, notScaled: true };
  }

  const { amount, rest } = parsed;
  const words = rest.split(/\s+/).filter(Boolean);
  const unitInfo = words.length > 0 ? detectUnit(words[0]) : null;
  const unit = unitInfo?.kind ?? 'count';
  const name = unitInfo ? words.slice(1).join(' ') : rest;
  const scaledAmount = amount * factor;

  const withName = (value: string) => (name ? `${value} ${name}` : value);

  switch (unit) {
    case 'cups':
      return { original, scaled: withName(toKitchenMeasure(scaledAmount, true)), notScaled: false };
    case 'tbsp':
      return { original, scaled: withName(toKitchenMeasure(scaledAmount / 16, true)), notScaled: false };
    case 'tsp':
      return { original, scaled: withName(toKitchenMeasure(scaledAmount / 48, true)), notScaled: false };
    case 'eggs': {
      const rounded = Math.round(scaledAmount * 2) / 2;
      const whole = Number.isInteger(rounded);
      const label = rounded === 1 ? 'egg' : 'eggs';
      const text = whole ? `${rounded} ${label}` : `${formatFraction(rounded)} ${label}`;
      const note = whole ? undefined : 'Beat an extra egg and use half.';
      return { original, scaled: withName(text), notScaled: false, note };
    }
    case 'grams':
      return { original, scaled: withName(`${formatPlainNumber(scaledAmount)} g`), notScaled: false };
    case 'kg':
      return { original, scaled: withName(`${formatPlainNumber(scaledAmount)} kg`), notScaled: false };
    case 'oz':
      return { original, scaled: withName(`${formatPlainNumber(scaledAmount)} oz`), notScaled: false };
    case 'lb':
      return { original, scaled: withName(`${formatPlainNumber(scaledAmount)} lb`), notScaled: false };
    case 'ml':
      return { original, scaled: withName(`${formatPlainNumber(scaledAmount)} ml`), notScaled: false };
    case 'l':
      return { original, scaled: withName(`${formatPlainNumber(scaledAmount)} l`), notScaled: false };
    case 'sticks': {
      const label = Math.abs(scaledAmount - 1) < 1e-9 ? 'stick' : 'sticks';
      const text = Number.isInteger(scaledAmount)
        ? `${scaledAmount} ${label}`
        : `${formatFraction(scaledAmount)} ${label}`;
      return { original, scaled: withName(text), notScaled: false };
    }
    case 'pinch':
    case 'clove':
    case 'count':
    default: {
      const text = Number.isInteger(scaledAmount)
        ? String(scaledAmount)
        : formatFraction(scaledAmount);
      return { original, scaled: withName(text), notScaled: false };
    }
  }
}

export function scaleRecipe(text: string, factor: number): ScaledLine[] {
  return text.split(/\r?\n/).map((line) => scaleLine(line, factor));
}

/** Scale factor from servings; falls back to 1 when inputs are invalid. */
export function scaleFactor(originalServings: number, newServings: number): number {
  if (!originalServings || originalServings <= 0) return 1;
  return newServings / originalServings;
}
