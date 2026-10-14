import { gramsToCups, cupsToGrams, spoonsToGrams } from './convert';
import { formatGrams, roundTo } from './round';
import { formatFraction } from './fraction';
import { INGREDIENTS, getIngredient } from '../data/ingredients';

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
