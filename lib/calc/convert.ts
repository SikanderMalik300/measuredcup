import {
  type DataSource,
  type Ingredient,
  gramsPerCup,
  getIngredient,
} from '../data/ingredients';
import {
  BUTTER_STICK_G,
  BUTTER_CUP_G,
  BUTTER_TBSP_G,
  BUTTER_TSP_G,
  BUTTER_POUND_G,
  G_PER_OZ,
  TBSP_PER_CUP,
  TSP_PER_CUP,
  ML_PER_CUP,
} from '../data/constants';
import { formatFraction } from './fraction';
import { roundTo } from './round';

// ---- Core ingredient conversions ----

export function gramsToCups(grams: number, ingredientId: string, source: DataSource): number {
  const ing = getIngredient(ingredientId);
  return grams / gramsPerCup(ing, source);
}

/** Milliliters for a weight of an ingredient: grams / grams-per-cup x mL-per-cup. */
export function gramsToMl(grams: number, ingredientId: string, source: DataSource): number {
  const ing = getIngredient(ingredientId);
  return (grams / gramsPerCup(ing, source)) * ML_PER_CUP;
}

/** Density in grams per millilitre for an ingredient and source. */
export function densityGml(ingredientId: string, source: DataSource): number {
  const ing = getIngredient(ingredientId);
  return gramsPerCup(ing, source) / ML_PER_CUP;
}

export function cupsToGrams(cups: number, ingredientId: string, source: DataSource): number {
  const ing = getIngredient(ingredientId);
  return cups * gramsPerCup(ing, source);
}

export type SpoonUnit = 'tablespoons' | 'teaspoons';

export function spoonsToGrams(
  amount: number,
  unit: SpoonUnit,
  ingredientId: string,
  source: DataSource,
): number {
  const ing = getIngredient(ingredientId);
  const perCup = gramsPerCup(ing, source);
  const divisor = unit === 'tablespoons' ? TBSP_PER_CUP : TSP_PER_CUP;
  return amount * (perCup / divisor);
}

/** Grams per tablespoon for an ingredient and source. */
export function gramsPerTbsp(ing: Ingredient, source: DataSource): number {
  return gramsPerCup(ing, source) / TBSP_PER_CUP;
}

/** Grams per teaspoon for an ingredient and source. */
export function gramsPerTsp(ing: Ingredient, source: DataSource): number {
  return gramsPerCup(ing, source) / TSP_PER_CUP;
}

/** Weight ounces from grams. */
export function gramsToOz(grams: number): number {
  return grams / G_PER_OZ;
}

/** Cups shown as a decimal to one place, e.g. 1.6. */
export function formatCupsDecimal(cups: number): string {
  return roundTo(cups, 1).toFixed(1);
}

// ---- Butter converter ----

export type ButterUnit =
  | 'sticks'
  | 'cups'
  | 'tablespoons'
  | 'teaspoons'
  | 'grams'
  | 'ounces'
  | 'pounds';

const BUTTER_TO_GRAMS: Record<ButterUnit, number> = {
  sticks: BUTTER_STICK_G,
  cups: BUTTER_CUP_G,
  tablespoons: BUTTER_TBSP_G,
  teaspoons: BUTTER_TSP_G,
  grams: 1,
  ounces: G_PER_OZ,
  pounds: BUTTER_POUND_G,
};

export interface ButterResult {
  grams: number;
  sticks: number;
  cups: number;
  tablespoons: number;
  teaspoons: number;
  ounces: number;
  pounds: number;
  /** A practical "N sticks + X tbsp" cut, e.g. "about 2 sticks + 1 1/2 tbsp". */
  stickCut: string;
}

export function butterToGrams(amount: number, from: ButterUnit): number {
  return amount * BUTTER_TO_GRAMS[from];
}

export function butterConvert(amount: number, from: ButterUnit): ButterResult {
  const grams = butterToGrams(amount, from);
  return {
    grams,
    sticks: grams / BUTTER_STICK_G,
    cups: grams / BUTTER_CUP_G,
    tablespoons: grams / BUTTER_TBSP_G,
    teaspoons: grams / BUTTER_TSP_G,
    ounces: grams / G_PER_OZ,
    pounds: grams / BUTTER_POUND_G,
    stickCut: butterStickCut(grams),
  };
}

/** Express grams of butter as whole sticks plus tablespoons cut from the next stick (nearest 1/2 tbsp). */
export function butterStickCut(grams: number): string {
  const sticks = grams / BUTTER_STICK_G;
  const wholeSticks = Math.floor(sticks + 1e-9);
  const leftoverStick = sticks - wholeSticks;
  let tbsp = leftoverStick * 8; // 8 tbsp per stick
  const roundedTbsp = Math.round(tbsp * 2) / 2; // nearest 1/2 tbsp
  const approx = Math.abs(roundedTbsp - tbsp) > 1e-9;

  if (wholeSticks === 0 && roundedTbsp === 0) return '0 sticks';

  const stickWord = wholeSticks === 1 ? 'stick' : 'sticks';
  if (roundedTbsp < 1e-9) {
    return `${wholeSticks} ${stickWord}`;
  }
  const tbspLabel = formatFraction(roundedTbsp);
  const prefix = approx ? 'about ' : '';
  if (wholeSticks === 0) return `${prefix}${tbspLabel} tbsp`;
  return `${prefix}${wholeSticks} ${stickWord} + ${tbspLabel} tbsp`;
}
