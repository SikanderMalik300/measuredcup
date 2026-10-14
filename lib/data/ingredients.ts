// USDA FoodData Central is in the public domain (catalog.data.gov). King Arthur figures are facts
// quoted from their published chart with attribution.
//
// USDA values: from FoodData Central SR Legacy 2018-04 release, food_portion.csv (public domain),
// https://fdc.nal.usda.gov/download-datasets/ (accessed 2026-10-14). Each row's usdaFdcId and
// usdaPortionText record the exact food and household portion read from the file.
// King Arthur values: from https://www.kingarthurbaking.com/learn/ingredient-weight-chart
// (accessed 2026-10-14). Where King Arthur lists 1/2 cup or 1/4 cup, the per-cup figure is doubled
// or quadrupled.
//
// Verified 2026-10-14 against the SR Legacy CSV: every USDA value below matches the file exactly.

export type IngredientGroup =
  | 'Flours'
  | 'Sugars'
  | 'Fats and dairy'
  | 'Liquids and syrups'
  | 'Grains'
  | 'Other';

export type DataSource = 'usda' | 'kingArthur';

export interface Ingredient {
  id: string;
  name: string;
  group: IngredientGroup;
  usdaGramsPerCup: number;
  usdaFdcId: number;
  usdaPortionText: string;
  kaGramsPerCup: number | null;
  kaNote: string | null;
}

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'ap-flour',
    name: 'All-purpose flour',
    group: 'Flours',
    usdaGramsPerCup: 125,
    usdaFdcId: 168894,
    usdaPortionText: 'Wheat flour, white, all-purpose, enriched, bleached; 1 cup',
    kaGramsPerCup: 120,
    kaNote: null,
  },
  {
    id: 'bread-flour',
    name: 'Bread flour',
    group: 'Flours',
    usdaGramsPerCup: 137,
    usdaFdcId: 168896,
    usdaPortionText: 'Wheat flour, white, bread, enriched; 1 cup',
    kaGramsPerCup: 120,
    kaNote: null,
  },
  {
    id: 'cake-flour',
    name: 'Cake flour',
    group: 'Flours',
    usdaGramsPerCup: 137,
    usdaFdcId: 169723,
    usdaPortionText: 'Wheat flour, white, cake, enriched; 1 cup unsifted, dipped',
    kaGramsPerCup: 120,
    kaNote: null,
  },
  {
    id: 'ww-flour',
    name: 'Whole wheat flour',
    group: 'Flours',
    usdaGramsPerCup: 120,
    usdaFdcId: 168893,
    usdaPortionText: 'Wheat flour, whole-grain; 1 cup',
    kaGramsPerCup: null,
    kaNote: 'not in chart',
  },
  {
    id: 'sugar',
    name: 'Granulated sugar',
    group: 'Sugars',
    usdaGramsPerCup: 200,
    usdaFdcId: 169655,
    usdaPortionText: 'Sugars, granulated; 1 cup',
    kaGramsPerCup: 198,
    kaNote: null,
  },
  {
    id: 'brown-sugar',
    name: 'Brown sugar (packed)',
    group: 'Sugars',
    usdaGramsPerCup: 220,
    usdaFdcId: 168833,
    usdaPortionText: 'Sugars, brown; 1 cup packed',
    kaGramsPerCup: 213,
    kaNote: null,
  },
  {
    id: 'powdered-sugar',
    name: 'Powdered sugar (unsifted)',
    group: 'Sugars',
    usdaGramsPerCup: 120,
    usdaFdcId: 169656,
    usdaPortionText: 'Sugars, powdered; 1 cup unsifted',
    kaGramsPerCup: 113,
    kaNote: null,
  },
  {
    id: 'butter',
    name: 'Butter',
    group: 'Fats and dairy',
    usdaGramsPerCup: 227,
    usdaFdcId: 173410,
    usdaPortionText: 'Butter, salted; 1 cup',
    kaGramsPerCup: 226,
    kaNote: null,
  },
  {
    id: 'honey',
    name: 'Honey',
    group: 'Liquids and syrups',
    usdaGramsPerCup: 339,
    usdaFdcId: 169640,
    usdaPortionText: 'Honey; 1 cup',
    kaGramsPerCup: 336,
    kaNote: '21 g per tbsp x 16',
  },
  {
    id: 'maple-syrup',
    name: 'Maple syrup',
    group: 'Liquids and syrups',
    usdaGramsPerCup: 315,
    usdaFdcId: 169661,
    usdaPortionText: 'Syrups, maple; 1 cup',
    kaGramsPerCup: 312,
    kaNote: '156 g per 1/2 cup',
  },
  {
    id: 'milk',
    name: 'Whole milk',
    group: 'Liquids and syrups',
    usdaGramsPerCup: 244,
    usdaFdcId: 171265,
    usdaPortionText: 'Milk, whole, 3.25% milkfat, with added vitamin D; 1 cup',
    kaGramsPerCup: 227,
    kaNote: null,
  },
  {
    id: 'water',
    name: 'Water',
    group: 'Liquids and syrups',
    usdaGramsPerCup: 237,
    usdaFdcId: 173647,
    usdaPortionText: 'Beverages, water, tap, drinking; 1 cup (8 fl oz)',
    kaGramsPerCup: null,
    kaNote: null,
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil',
    group: 'Liquids and syrups',
    usdaGramsPerCup: 218,
    usdaFdcId: 172336,
    usdaPortionText: 'Oil, canola; 1 cup',
    kaGramsPerCup: 198,
    kaNote: null,
  },
  {
    id: 'heavy-cream',
    name: 'Heavy cream',
    group: 'Fats and dairy',
    usdaGramsPerCup: 238,
    usdaFdcId: 170859,
    usdaPortionText: 'Cream, fluid, heavy whipping; 1 cup, fluid (yields 2 cups whipped)',
    kaGramsPerCup: 227,
    kaNote: null,
  },
  {
    id: 'sour-cream',
    name: 'Sour cream',
    group: 'Fats and dairy',
    usdaGramsPerCup: 230,
    usdaFdcId: 171257,
    usdaPortionText: 'Cream, sour, cultured; 1 cup',
    kaGramsPerCup: 227,
    kaNote: null,
  },
  {
    id: 'yogurt',
    name: 'Plain whole-milk yogurt',
    group: 'Fats and dairy',
    usdaGramsPerCup: 245,
    usdaFdcId: 171284,
    usdaPortionText: 'Yogurt, plain, whole milk; 1 cup (8 fl oz)',
    kaGramsPerCup: null,
    kaNote: null,
  },
  {
    id: 'cocoa',
    name: 'Unsweetened cocoa powder',
    group: 'Other',
    usdaGramsPerCup: 86,
    usdaFdcId: 169593,
    usdaPortionText: 'Cocoa, dry powder, unsweetened; 1 cup',
    kaGramsPerCup: 84,
    kaNote: '42 g per 1/2 cup',
  },
  {
    id: 'oats',
    name: 'Rolled oats',
    group: 'Grains',
    usdaGramsPerCup: 81,
    usdaFdcId: 173904,
    usdaPortionText: 'Cereals, oats, regular and quick, not fortified, dry; 1 cup',
    kaGramsPerCup: 89,
    kaNote: 'old-fashioned or quick',
  },
  {
    id: 'rice',
    name: 'Long-grain white rice (uncooked)',
    group: 'Grains',
    usdaGramsPerCup: 185,
    usdaFdcId: 168877,
    usdaPortionText: 'Rice, white, long-grain, regular, raw, enriched; 1 cup',
    kaGramsPerCup: 198,
    kaNote: '99 g per 1/2 cup',
  },
  {
    id: 'cornstarch',
    name: 'Cornstarch',
    group: 'Other',
    usdaGramsPerCup: 128,
    usdaFdcId: 169698,
    usdaPortionText: 'Cornstarch; 1 cup',
    kaGramsPerCup: 112,
    kaNote: '28 g per 1/4 cup',
  },
  {
    id: 'peanut-butter',
    name: 'Peanut butter',
    group: 'Other',
    usdaGramsPerCup: 258,
    usdaFdcId: 174266,
    usdaPortionText: 'Peanut butter, smooth style, with salt; 1 cup',
    kaGramsPerCup: 270,
    kaNote: '135 g per 1/2 cup',
  },
  {
    id: 'choc-chips',
    name: 'Semisweet chocolate chips',
    group: 'Other',
    usdaGramsPerCup: 168,
    usdaFdcId: 167976,
    usdaPortionText: 'Candies, semisweet chocolate; 1 cup chips (6 oz package)',
    kaGramsPerCup: 170,
    kaNote: null,
  },
  {
    id: 'salt',
    name: 'Table salt',
    group: 'Other',
    usdaGramsPerCup: 292,
    usdaFdcId: 173468,
    usdaPortionText: 'Salt, table; 1 cup',
    kaGramsPerCup: 288,
    kaNote: '18 g per tbsp x 16',
  },
];

export const INGREDIENT_GROUPS: IngredientGroup[] = [
  'Flours',
  'Sugars',
  'Fats and dairy',
  'Liquids and syrups',
  'Grains',
  'Other',
];

const BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]));

export function getIngredient(id: string): Ingredient {
  const ing = BY_ID.get(id);
  if (!ing) throw new Error(`Unknown ingredient: ${id}`);
  return ing;
}

export function findIngredient(id: string): Ingredient | undefined {
  return BY_ID.get(id);
}

/**
 * Grams per cup for an ingredient and data source. Falls back to USDA when a
 * King Arthur figure is not published for that ingredient.
 */
export function gramsPerCup(ing: Ingredient, source: DataSource): number {
  if (source === 'kingArthur' && ing.kaGramsPerCup != null) return ing.kaGramsPerCup;
  return ing.usdaGramsPerCup;
}

/** Difference percent = (USDA - King Arthur) / USDA, rounded to a whole percent. Null when no KA figure. */
export function differencePercent(ing: Ingredient): number | null {
  if (ing.kaGramsPerCup == null) return null;
  const raw = ((ing.usdaGramsPerCup - ing.kaGramsPerCup) / ing.usdaGramsPerCup) * 100;
  return Math.round(raw);
}

/** Difference percent to one decimal place. Used by tests and the data page. */
export function differencePercentExact(ing: Ingredient): number | null {
  if (ing.kaGramsPerCup == null) return null;
  const raw = ((ing.usdaGramsPerCup - ing.kaGramsPerCup) / ing.usdaGramsPerCup) * 100;
  return Math.round(Number((raw * 10).toPrecision(15))) / 10;
}

/** Whole percent with an explicit sign, for the comparison table (e.g. "+4%", "-10%"). */
export function differencePercentLabel(ing: Ingredient): string {
  const d = differencePercent(ing);
  if (d == null) return '-';
  const sign = d > 0 ? '+' : d < 0 ? '' : '';
  return `${sign}${d}%`;
}
