import { gramsToCups, cupsToGrams, spoonsToGrams } from './convert';
import { formatGrams, gramsCell, roundTo, trimDecimal } from './round';
import { formatFraction } from './fraction';
import { fewestScoops, tbspTspLabel } from './kitchen';
import { INGREDIENTS, getIngredient, gramsPerCup } from '../data/ingredients';
import {
  ML_PER_TSP,
  ML_PER_CUP,
  ML_PER_TBSP,
  ML_PER_FL_OZ,
  ML_PER_PINT,
  ML_PER_QUART,
  ML_PER_GALLON,
  ML_PER_DRY_QUART,
  ML_PER_IMPERIAL_QUART,
  ML_PER_IMPERIAL_GALLON,
  ML_PER_DRY_GALLON,
} from '../data/constants';

/** Format a cup amount for a reference table: kitchen fraction to the nearest 1/8 cup, or
 *  tablespoons when under 1/4 cup (build spec A8.1 Table 2). */
export function formatCupsForTable(cups: number): string {
  const eighths = Math.round(cups * 8);
  const rounded = eighths / 8;
  if (rounded < 0.25 - 1e-9) {
    const tbsp = Math.round(cups * 16);
    return `${tbsp} tbsp`;
  }
  const whole = Math.floor(rounded + 1e-9);
  const word = rounded > 1 + 1e-9 ? 'cups' : 'cup';
  return `${formatFraction(rounded)} ${word}`;
}

// ---- Grams to cups: "Common gram amounts in cups (USDA)" ----
export const GRAM_AMOUNT_ROWS = [50, 100, 125, 200, 250, 500];
export const GRAM_AMOUNT_COLS = ['ap-flour', 'sugar', 'brown-sugar', 'butter'];

export function gramAmountsInCups(): { grams: number; cells: string[] }[] {
  return GRAM_AMOUNT_ROWS.map((grams) => ({
    grams,
    cells: GRAM_AMOUNT_COLS.map((id) => formatCupsForTable(gramsToCups(grams, id, 'usda'))),
  }));
}

// ---- Cups to grams: "Cup fractions in grams (USDA)" ----
export const CUP_FRACTION_ROWS: { label: string; value: number }[] = [
  { label: '1/4', value: 1 / 4 },
  { label: '1/3', value: 1 / 3 },
  { label: '1/2', value: 1 / 2 },
  { label: '2/3', value: 2 / 3 },
  { label: '3/4', value: 3 / 4 },
  { label: '1', value: 1 },
];
export const CUP_FRACTION_COLS = ['ap-flour', 'sugar', 'brown-sugar', 'butter', 'milk', 'honey'];

export function cupFractionsInGrams(): { label: string; cells: string[] }[] {
  return CUP_FRACTION_ROWS.map((row) => ({
    label: row.label,
    cells: CUP_FRACTION_COLS.map((id) => formatGrams(cupsToGrams(row.value, id, 'usda'))),
  }));
}

// ---- Tablespoons to grams: "1 tablespoon and 1 teaspoon in grams (USDA)" ----
export function spoonGramsRows(): { id: string; name: string; tbsp: string; tsp: string }[] {
  return INGREDIENTS.map((ing) => ({
    id: ing.id,
    name: ing.name,
    tbsp: formatGrams(spoonsToGrams(1, 'tablespoons', ing.id, 'usda')),
    tsp: formatGrams(spoonsToGrams(1, 'teaspoons', ing.id, 'usda')),
  }));
}

// ---- Data page per-ingredient rows (cup, tbsp, tsp, KA, difference, food) ----
export function dataPageRows() {
  return INGREDIENTS.map((ing) => {
    const usdaTbsp = ing.usdaGramsPerCup / 16;
    const usdaTsp = ing.usdaGramsPerCup / 48;
    return {
      id: ing.id,
      name: ing.name,
      usdaCup: ing.usdaGramsPerCup,
      usdaTbsp: formatGrams(usdaTbsp),
      usdaTsp: formatGrams(usdaTsp),
      ka: ing.kaGramsPerCup,
      fdcId: ing.usdaFdcId,
      portion: ing.usdaPortionText,
    };
  });
}

// ---- Tablespoons to cups (page /tablespoons-to-cups/) ----

/** mL for a teaspoon amount, one decimal. */
export function mlFromTsp(totalTsp: number): string {
  return roundTo(totalTsp * ML_PER_TSP, 1).toFixed(1);
}

/** Fluid ounces for a teaspoon amount (1 tbsp = 1/2 fl oz exactly), trimmed. */
export function flOzFromTsp(totalTsp: number): string {
  return trimDecimal(totalTsp / 6, 2);
}

export const TBSP_TO_CUPS_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 24, 32];

export function tablespoonsToCupsRows() {
  return TBSP_TO_CUPS_ROWS.map((tbsp) => {
    const totalTsp = tbsp * 3;
    return {
      tbsp,
      cups: trimDecimal(totalTsp / 48, 4),
      measureWith: fewestScoops(totalTsp),
      ml: mlFromTsp(totalTsp),
      flOz: flOzFromTsp(totalTsp),
    };
  });
}

// Common spoon amounts in grams (USDA), page 1 table 2.
export const SPOON_GRAM_ROWS = [2, 4, 6, 8, 10, 12];
export const SPOON_GRAM_COLS = ['ap-flour', 'sugar', 'butter', 'vegetable-oil'];

export function spoonGramsByIngredient() {
  return SPOON_GRAM_ROWS.map((tbsp) => ({
    tbsp,
    cells: SPOON_GRAM_COLS.map((id) => gramsCell(spoonsToGrams(tbsp, 'tablespoons', id, 'usda'))),
  }));
}

// ---- Cup fractions (pages /tablespoons-in-1-8-cup/ and /tablespoons-in-1-4-cup/) ----

/** Label for a cup fraction, e.g. 1/8 -> "1/8". Supports 1/8, 1/4, 1/3 and 2/3. */
export function cupFractionLabel(fraction: number): string {
  if (Math.abs(fraction - 1 / 8) < 1e-9) return '1/8';
  if (Math.abs(fraction - 1 / 4) < 1e-9) return '1/4';
  if (Math.abs(fraction - 1 / 3) < 1e-9) return '1/3';
  if (Math.abs(fraction - 2 / 3) < 1e-9) return '2/3';
  return trimDecimal(fraction, 4);
}

export function cupFractionEquivalents(fraction: number): { label: string; value: string }[] {
  const tbspNum = 16 * fraction;
  const tsp = Math.round(48 * fraction); // 6, 12 or 16
  const label = cupFractionLabel(fraction);
  const tbspValue = Number.isInteger(tbspNum)
    ? String(tbspNum)
    : `${tbspTspLabel(tsp)} (${formatFraction(tbspNum)})`;
  const rows: { label: string; value: string }[] = [
    { label: 'Tablespoons', value: tbspValue },
    { label: 'Teaspoons', value: String(tsp) },
    { label: 'Fluid ounces', value: trimDecimal(8 * fraction, 2) },
    { label: 'Milliliters', value: mlFromTsp(tsp) },
    { label: 'Cups (decimal)', value: trimDecimal(fraction, 3) },
  ];
  if (Math.abs(fraction - 1 / 8) < 1e-9) {
    rows.push({ label: `Half of ${label} cup`, value: fewestScoops(tsp / 2) }); // 1 tbsp
    rows.push({ label: `Double ${label} cup`, value: fewestScoops(tsp * 2) }); // 1/4 cup
  } else if (Math.abs(fraction - 1 / 4) < 1e-9) {
    rows.push({ label: `Half of ${label} cup`, value: '2 tbsp (1/8 cup)' });
    rows.push({ label: `Double ${label} cup`, value: fewestScoops(tsp * 2) }); // 1/2 cup
    rows.push({ label: 'Butter', value: '1/2 stick' });
  } else if (Math.abs(fraction - 1 / 3) < 1e-9) {
    rows.push({ label: `Half of ${label} cup`, value: tbspTspLabel(tsp / 2) }); // 2 tbsp + 2 tsp
    rows.push({
      label: `Double ${label} cup`,
      value: `${fewestScoops(tsp * 2)} (${tbspTspLabel(tsp * 2)})`, // 2/3 cup (10 tbsp + 2 tsp)
    });
    rows.push({ label: 'Butter', value: '5 tbsp + 1 tsp, about 2/3 of a stick' });
  } else {
    // 2/3 cup
    rows.push({
      label: `Half of ${label} cup`,
      value: `${fewestScoops(tsp / 2)} (${tbspTspLabel(tsp / 2)})`, // 1/3 cup (5 tbsp + 1 tsp)
    });
    rows.push({ label: `Double ${label} cup`, value: fewestScoops(tsp * 2) }); // 1 1/3 cups
    rows.push({ label: 'Butter', value: '10 tbsp + 2 tsp, 1 1/3 sticks' });
  }
  return rows;
}

export function cupFractionByIngredient(fraction: number) {
  return INGREDIENTS.map((ing) => ({
    id: ing.id,
    name: ing.name,
    usda: gramsCell(ing.usdaGramsPerCup * fraction),
    ka: ing.kaGramsPerCup == null ? '-' : gramsCell(ing.kaGramsPerCup * fraction),
    perTbsp: gramsCell(ing.usdaGramsPerCup / 16),
  }));
}

/** Grams in a cup fraction for an ingredient and source. */
export function cupFractionGrams(
  id: string,
  source: 'usda' | 'kingArthur',
  fraction: number,
): string {
  return gramsCell(gramsPerCup(getIngredient(id), source) * fraction);
}

// Backwards-compatible 1/8 cup aliases (existing tests and the live page use these).
export const eighthCupEquivalents = () => cupFractionEquivalents(1 / 8);
export const eighthCupByIngredient = () => cupFractionByIngredient(1 / 8);
export function eighthCupGrams(id: string, source: 'usda' | 'kingArthur'): string {
  return cupFractionGrams(id, source, 1 / 8);
}

// ---- Grams to tablespoons (page /grams-to-tablespoons/) ----

export const G2TBSP_ROWS = [5, 10, 15, 20, 25, 30, 50, 100];
export const G2TBSP_COLS = ['ap-flour', 'sugar', 'butter', 'honey', 'cocoa'];

/** Tablespoons for grams of an ingredient: grams ÷ (grams per cup ÷ 16). */
export function gramsToTbsp(grams: number, id: string, source: 'usda' | 'kingArthur'): number {
  return grams / (gramsPerCup(getIngredient(id), source) / 16);
}

export function gramsToTablespoonsRows() {
  return G2TBSP_ROWS.map((grams) => ({
    grams,
    cells: G2TBSP_COLS.map((id) => trimDecimal(gramsToTbsp(grams, id, 'usda'), 2)),
  }));
}

// ---- Cups in a quart (page /cups-in-a-quart/) ----

function withComma(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** mL display: one decimal under 1,000, otherwise whole grams with a thousands comma. */
export function formatMl(ml: number): string {
  if (ml < 1000) return roundTo(ml, 1).toFixed(1);
  return withComma(Math.round(ml));
}

export type LiquidUnit =
  | 'gallons'
  | 'quarts'
  | 'pints'
  | 'cups'
  | 'fluid-ounces'
  | 'tablespoons'
  | 'milliliters'
  | 'liters';

export const ML_PER_LIQUID_UNIT: Record<LiquidUnit, number> = {
  gallons: ML_PER_GALLON,
  quarts: ML_PER_QUART,
  pints: ML_PER_PINT,
  cups: ML_PER_CUP,
  'fluid-ounces': ML_PER_FL_OZ,
  tablespoons: ML_PER_TBSP,
  milliliters: 1,
  liters: 1000,
};

export interface LiquidVolume {
  cups: number;
  gallons: number;
  quarts: number;
  pints: number;
  flOz: number;
  tbsp: number;
  ml: number;
  liters: number;
}

export function liquidVolumeConvert(amount: number, from: LiquidUnit): LiquidVolume {
  const ml = amount * ML_PER_LIQUID_UNIT[from];
  return {
    cups: ml / ML_PER_CUP,
    gallons: ml / ML_PER_GALLON,
    quarts: ml / ML_PER_QUART,
    pints: ml / ML_PER_PINT,
    flOz: ml / ML_PER_FL_OZ,
    tbsp: ml / ML_PER_TBSP,
    ml,
    liters: ml / 1000,
  };
}

// Table 1: quarts to cups chart.
const QUART_ROWS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

export function quartsToCupsRows() {
  return QUART_ROWS.map((q) => ({
    quarts: q === 4 ? '4 (1 gallon)' : formatFraction(q),
    cups: String(q * 4),
    pints: formatFraction(q * 2),
    flOz: String(q * 32),
    ml: formatMl(q * ML_PER_QUART),
  }));
}

// "Three kinds of quart" table.
export function threeQuartsRows() {
  const row = (name: string, ml: number) => ({
    name,
    ml: formatMl(ml),
    cups: trimDecimal(ml / ML_PER_CUP, 2),
  });
  return [
    row('US liquid quart', ML_PER_QUART),
    row('US dry quart', ML_PER_DRY_QUART),
    row('UK imperial quart', ML_PER_IMPERIAL_QUART),
  ];
}

// "What a quart/gallon weighs (USDA)" tables. cupsCount = cups in the unit (4 for a quart, 16 for a gallon).
const LIQUID_WEIGHT_IDS = ['water', 'milk', 'heavy-cream', 'vegetable-oil', 'maple-syrup', 'honey'];

function liquidWeightRows(cupsCount: number) {
  return LIQUID_WEIGHT_IDS.map((id) => {
    const ing = getIngredient(id);
    const grams = cupsCount * ing.usdaGramsPerCup;
    return {
      name: ing.name,
      grams: withComma(Math.round(grams)),
      pounds: roundTo(grams / 453.59237, 2).toFixed(2),
    };
  });
}

export const quartWeightRows = () => liquidWeightRows(4);
export const gallonWeightRows = () => liquidWeightRows(16);

// ---- Cups in a gallon (page /cups-in-a-gallon/) ----

const GALLON_ROWS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];

export function gallonsToCupsRows() {
  return GALLON_ROWS.map((g) => ({
    gallons: formatFraction(g),
    cups: String(g * 16),
    quarts: String(g * 4),
    pints: String(g * 8),
    flOz: String(g * 128),
    liters: roundTo((g * ML_PER_GALLON) / 1000, 2).toFixed(2),
  }));
}

export function threeGallonsRows() {
  const row = (name: string, ml: number) => ({
    name,
    liters: roundTo(ml / 1000, 2).toFixed(2),
    cups: trimDecimal(ml / ML_PER_CUP, 2),
  });
  return [
    row('US liquid gallon', ML_PER_GALLON),
    row('UK imperial gallon', ML_PER_IMPERIAL_GALLON),
    row('US dry gallon', ML_PER_DRY_GALLON),
  ];
}

// ---- Butter amounts (build spec A8.4). Static copy values. ----
export interface ButterRow {
  amount: string;
  sticks: string;
  tablespoons: string;
  grams: string;
  ounces: string;
}
export const BUTTER_ROWS: ButterRow[] = [
  { amount: '1 tbsp', sticks: '1/8 stick', tablespoons: '1 tbsp', grams: '14.2', ounces: '0.5 oz' },
  { amount: '2 tbsp', sticks: '1/4 stick', tablespoons: '2 tbsp', grams: '28.4', ounces: '1 oz' },
  { amount: '1/4 cup', sticks: '1/2 stick', tablespoons: '4 tbsp', grams: '56.7', ounces: '2 oz' },
  { amount: '1/3 cup', sticks: '2/3 stick', tablespoons: '5 1/3 tbsp', grams: '75.6', ounces: '2.7 oz' },
  { amount: '1/2 cup', sticks: '1 stick', tablespoons: '8 tbsp', grams: '113', ounces: '4 oz' },
  { amount: '2/3 cup', sticks: '1 1/3 sticks', tablespoons: '10 2/3 tbsp', grams: '151', ounces: '5.3 oz' },
  { amount: '3/4 cup', sticks: '1 1/2 sticks', tablespoons: '12 tbsp', grams: '170', ounces: '6 oz' },
  { amount: '1 cup', sticks: '2 sticks', tablespoons: '16 tbsp', grams: '227', ounces: '8 oz' },
  { amount: '1 pound', sticks: '4 sticks', tablespoons: '32 tbsp', grams: '454', ounces: '16 oz' },
];

// ---- Halves and thirds (build spec A8.5). Static copy values (two cells use the author's
// practical rounding, see notes in the spec). ----
export interface HalfThirdRow {
  amount: string;
  half: string;
  third: string;
}
export const HALF_THIRD_ROWS: HalfThirdRow[] = [
  { amount: '1 cup', half: '1/2 cup', third: '1/3 cup' },
  { amount: '3/4 cup', half: '1/4 cup + 2 tbsp', third: '1/4 cup' },
  { amount: '2/3 cup', half: '1/3 cup', third: 'about 3 tbsp + 1 1/2 tsp' },
  { amount: '1/2 cup', half: '1/4 cup', third: '2 tbsp + 2 tsp' },
  { amount: '1/3 cup', half: '2 tbsp + 2 tsp', third: 'about 1 tbsp + 2 1/4 tsp' },
  { amount: '1/4 cup', half: '2 tbsp', third: '1 tbsp + 1 tsp' },
  { amount: '1 tbsp', half: '1 1/2 tsp', third: '1 tsp' },
  { amount: '1 tsp', half: '1/2 tsp', third: 'about 1/4 tsp + a pinch' },
  { amount: '1/2 tsp', half: '1/4 tsp', third: 'about 1/8 tsp + a pinch' },
];

/** The CSV content for the data download, generated from the dataset. */
export function ingredientCsv(): string {
  const header = [
    'id',
    'name',
    'usda_g_per_cup',
    'usda_g_per_tbsp',
    'usda_g_per_tsp',
    'king_arthur_g_per_cup',
    'difference_percent',
    'usda_fdc_id',
    'usda_food_portion',
  ];
  const lines = [header.join(',')];
  for (const ing of INGREDIENTS) {
    const diff =
      ing.kaGramsPerCup == null
        ? ''
        : String(roundTo(((ing.usdaGramsPerCup - ing.kaGramsPerCup) / ing.usdaGramsPerCup) * 100, 1));
    const row = [
      ing.id,
      csvField(ing.name),
      String(ing.usdaGramsPerCup),
      formatGrams(ing.usdaGramsPerCup / 16),
      formatGrams(ing.usdaGramsPerCup / 48),
      ing.kaGramsPerCup == null ? '' : String(ing.kaGramsPerCup),
      diff,
      String(ing.usdaFdcId),
      csvField(ing.usdaPortionText),
    ];
    lines.push(row.join(','));
  }
  return lines.join('\n') + '\n';
}

function csvField(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export { getIngredient };
