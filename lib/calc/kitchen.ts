import { formatFraction, isEighthMultiple } from './fraction';

const TSP_PER_CUP = 48;
const TSP_PER_TBSP = 3;
const EPS = 1e-9;

// Leftover within this many tsp below a quarter-cup boundary is absorbed into the cup fraction
// (so 1.2346 cups reads "about 1 1/4 cups", not "1 cup + 3 tbsp + 2 1/4 tsp").
const ABSORB_UP = 1.0;

const QUARTER_LABELS: Record<number, string> = { 0: '', 12: '1/4', 24: '1/2', 36: '3/4' };

/**
 * Convert a cup amount into the nearest practical combination of cups, tablespoons and teaspoons.
 *
 * Rules (build spec A2, A8.5):
 *  - Leftover teaspoons round to the nearest 1/4 tsp when the total is 1/4 cup or more, and to the
 *    nearest 1/8 tsp below that.
 *  - For amounts under 1/4 cup, "about" is prefixed when the exact value is not a whole multiple of
 *    1/8 tsp. For larger amounts, "about" is prefixed only when a leftover is folded into a cup
 *    fraction (e.g. oats at 1.23 cups -> "about 1 1/4 cups").
 *  - Sub-teaspoon remainders are built from 1/2, 1/4 and 1/8 tsp spoons, with "a pinch" for the rest.
 *
 * Example: 1.6 cups -> "1 1/2 cups + 1 tbsp + 1 3/4 tsp".
 */
export function toKitchenMeasure(cups: number): string {
  const totalTsp = cups * TSP_PER_CUP;
  if (totalTsp <= EPS) return '0';

  if (totalTsp < TSP_PER_CUP / 4 - EPS) {
    // Under 1/4 cup: tablespoons and teaspoons only.
    const approx = !isEighthMultiple(totalTsp);
    const body = formatTbspTsp(totalTsp, false);
    return (approx ? 'about ' : '') + body;
  }

  // 1/4 cup or more: whole cups + a cup fraction, then the leftover as tbsp/tsp.
  let wholeCups = Math.floor(cups + EPS);
  let fracTsp = totalTsp - wholeCups * TSP_PER_CUP; // 0 .. 48
  let absorbed = false;
  let cupFracLabel = '';

  // Exact third or two-thirds of a cup.
  if (Math.abs(fracTsp - 16) < 1e-6) {
    cupFracLabel = '1/3';
    fracTsp = 0;
  } else if (Math.abs(fracTsp - 32) < 1e-6) {
    cupFracLabel = '2/3';
    fracTsp = 0;
  }

  let leftoverTsp = 0;
  if (cupFracLabel === '') {
    let quarters = Math.floor((fracTsp + EPS) / 12); // 0..4
    leftoverTsp = fracTsp - quarters * 12; // 0..12
    if (12 - leftoverTsp <= ABSORB_UP) {
      quarters += 1;
      absorbed = leftoverTsp > EPS;
      leftoverTsp = 0;
    }
    let cupQuarterTsp = quarters * 12; // 0..48
    const totalCupTsp = wholeCups * TSP_PER_CUP + cupQuarterTsp;
    wholeCups = Math.floor(totalCupTsp / TSP_PER_CUP + EPS);
    const remQuarter = totalCupTsp - wholeCups * TSP_PER_CUP; // 0,12,24,36
    cupFracLabel = QUARTER_LABELS[remQuarter] ?? '';
  }

  const cupValue = wholeCups + labelToValue(cupFracLabel);
  const cupWord = cupValue > 1 + EPS ? 'cups' : 'cup';
  let cupStr = '';
  if (wholeCups > 0 && cupFracLabel) cupStr = `${wholeCups} ${cupFracLabel} ${cupWord}`;
  else if (wholeCups > 0) cupStr = `${wholeCups} ${cupWord}`;
  else if (cupFracLabel) cupStr = `${cupFracLabel} ${cupWord}`;

  const parts: string[] = [];
  if (cupStr) parts.push(cupStr);

  if (leftoverTsp > EPS) {
    // Round leftover to 1/4 tsp (we are at 1/4 cup or more).
    const body = formatTbspTsp(leftoverTsp, true);
    if (body && body !== '0') parts.push(body);
  }

  const result = parts.join(' + ');
  return absorbed ? 'about ' + result : result;
}

function labelToValue(label: string): number {
  switch (label) {
    case '1/4':
      return 0.25;
    case '1/3':
      return 1 / 3;
    case '1/2':
      return 0.5;
    case '2/3':
      return 2 / 3;
    case '3/4':
      return 0.75;
    default:
      return 0;
  }
}

/** Build "N tbsp + X tsp" from a teaspoon amount under one cup. */
function formatTbspTsp(tsp: number, quarterStep: boolean): string {
  let tbsp = Math.floor((tsp + EPS) / TSP_PER_TBSP);
  let remTsp = tsp - tbsp * TSP_PER_TBSP;

  if (quarterStep) {
    remTsp = Math.round(remTsp * 4) / 4; // nearest 1/4 tsp
    if (remTsp >= TSP_PER_TBSP - EPS) {
      tbsp += 1;
      remTsp -= TSP_PER_TBSP;
    }
  }

  const parts: string[] = [];
  if (tbsp > 0) parts.push(`${tbsp} tbsp`);
  const tspPiece = formatTspPiece(remTsp);
  if (tspPiece) parts.push(tspPiece);
  if (parts.length === 0) return '0';
  return parts.join(' + ');
}

/** Format a teaspoon remainder (0 .. <3) as a measuring-spoon expression. */
function formatTspPiece(tsp: number): string {
  if (tsp <= EPS) return '';

  if (tsp >= 1 - EPS) {
    // Whole teaspoons plus the nearest kitchen fraction.
    return `${formatFraction(tsp)} tsp`;
  }

  // Sub-teaspoon: build from 1/2, 1/4, 1/8 tsp spoons, then "a pinch".
  const spoons: { value: number; label: string }[] = [
    { value: 1 / 2, label: '1/2' },
    { value: 1 / 4, label: '1/4' },
    { value: 1 / 8, label: '1/8' },
  ];
  let remaining = tsp;
  const labels: string[] = [];
  for (const spoon of spoons) {
    if (remaining >= spoon.value - 1e-6) {
      labels.push(`${spoon.label} tsp`);
      remaining -= spoon.value;
    }
  }
  if (remaining > 1e-6) labels.push('a pinch');
  return labels.join(' + ');
}
