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
// ---- fewestScoops: measure an amount with the fewest standard US scoops ----

const CUP_TSP = 48;
const TBSP_TSP = 3;

interface ScoopFraction {
  tsp: number;
  label: string;
  value: number;
  isThird: boolean;
}

// One cup fraction may be used, chosen from this set (build spec addendum section 1).
const SCOOP_FRACTIONS: ScoopFraction[] = [
  { tsp: 36, label: '3/4', value: 0.75, isThird: false },
  { tsp: 32, label: '2/3', value: 2 / 3, isThird: true },
  { tsp: 24, label: '1/2', value: 0.5, isThird: false },
  { tsp: 16, label: '1/3', value: 1 / 3, isThird: true },
  { tsp: 12, label: '1/4', value: 0.25, isThird: false },
  { tsp: 6, label: '1/8', value: 0.125, isThird: false },
];

/** Count the 1/2, 1/4 and 1/8 tsp spoons needed for a sub-teaspoon amount. */
function countEighthScoops(frac: number): number {
  let eighths = Math.round(frac * 8); // 0..7
  let count = 0;
  for (const v of [4, 2, 1]) {
    if (eighths >= v) {
      count++;
      eighths -= v;
    }
  }
  return count;
}

interface ScoopOption {
  frac: ScoopFraction | null;
  tbsp: number;
  tspRounded: number;
  isExact: boolean;
  scoops: number;
}

/**
 * Return the way to measure `totalTsp` teaspoons with standard US tools (whole cups, one cup
 * fraction from {3/4, 2/3, 1/2, 1/3, 1/4, 1/8}, tablespoons, teaspoons) using the fewest scoops.
 * Ties prefer the option without a third, then the larger cup fraction. Non-whole teaspoon leftovers
 * round to the nearest 1/8 tsp and the result is prefixed "about " unless the amount was exact.
 */
export function fewestScoops(totalTsp: number): string {
  if (totalTsp <= EPS) return '0';
  const wholeCups = Math.floor(totalTsp / CUP_TSP + EPS);
  const rem = totalTsp - wholeCups * CUP_TSP; // 0 .. <48

  const options: ScoopOption[] = [];
  const build = (frac: ScoopFraction | null) => {
    const fracTsp = frac ? frac.tsp : 0;
    if (fracTsp > rem + 1e-6) return;
    const leftover = rem - fracTsp;
    const tbsp = Math.floor(leftover / TBSP_TSP + 1e-6);
    const tspExact = leftover - tbsp * TBSP_TSP; // 0 .. <3
    const tspRounded = Math.round(tspExact * 8) / 8;
    const isExact = Math.abs(tspRounded - tspExact) < 1e-6;
    const wholeTsp = Math.floor(tspRounded + EPS);
    const parts = countEighthScoops(tspRounded - wholeTsp);
    const scoops = wholeCups + (frac ? 1 : 0) + tbsp + wholeTsp + parts;
    options.push({ frac, tbsp, tspRounded, isExact, scoops });
  };
  build(null);
  for (const f of SCOOP_FRACTIONS) build(f);

  options.sort((a, b) => {
    if (a.scoops !== b.scoops) return a.scoops - b.scoops;
    const aThird = a.frac?.isThird ? 1 : 0;
    const bThird = b.frac?.isThird ? 1 : 0;
    if (aThird !== bThird) return aThird - bThird; // prefer no third
    return (b.frac?.value ?? 0) - (a.frac?.value ?? 0); // prefer the larger cup fraction
  });

  return formatScoops(wholeCups, options[0]);
}

function formatScoops(wholeCups: number, opt: ScoopOption): string {
  const parts: string[] = [];
  const fracLabel = opt.frac?.label;
  const cupValue = wholeCups + (opt.frac?.value ?? 0);
  const word = cupValue > 1 + EPS ? 'cups' : 'cup';
  if (wholeCups > 0 && fracLabel) parts.push(`${wholeCups} ${fracLabel} ${word}`);
  else if (wholeCups > 0) parts.push(`${wholeCups} ${word}`);
  else if (fracLabel) parts.push(`${fracLabel} ${word}`);

  if (opt.tbsp > 0) parts.push(`${opt.tbsp} tbsp`);
  if (opt.tspRounded > EPS) parts.push(`${formatFraction(opt.tspRounded)} tsp`);

  const out = parts.join(' + ');
  return opt.isExact ? out : `about ${out}`;
}

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
