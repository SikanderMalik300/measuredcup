import { describe, it, expect } from 'vitest';
import { parseAmount, formatFraction } from './fraction';
import { roundTo, formatGrams, ceilCount } from './round';
import { toKitchenMeasure } from './kitchen';
import {
  gramsToCups,
  cupsToGrams,
  spoonsToGrams,
  gramsToOz,
  formatCupsDecimal,
  butterConvert,
  butterStickCut,
} from './convert';
import { scaleLine } from './scale';
import {
  INGREDIENTS,
  getIngredient,
  differencePercentExact,
} from '../data/ingredients';

describe('parseAmount', () => {
  it('parses whole numbers, decimals, fractions, mixed and unicode', () => {
    expect(parseAmount('2')).toBe(2);
    expect(parseAmount('2.5')).toBe(2.5);
    expect(parseAmount('3/4')).toBeCloseTo(0.75, 10);
    expect(parseAmount('2 1/4')).toBeCloseTo(2.25, 10);
    expect(parseAmount('½')).toBeCloseTo(0.5, 10);
    expect(parseAmount('⅔')).toBeCloseTo(2 / 3, 10);
    expect(parseAmount('⅛')).toBeCloseTo(0.125, 10);
    expect(parseAmount('1 1/2')).toBeCloseTo(1.5, 10);
  });
  it('returns null for empty and unreadable input', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('   ')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('1/0')).toBeNull();
  });
});

describe('formatFraction', () => {
  it('returns kitchen fractions only', () => {
    expect(formatFraction(0.75)).toBe('3/4');
    expect(formatFraction(2 / 3)).toBe('2/3');
    expect(formatFraction(1 / 3)).toBe('1/3');
    expect(formatFraction(0.125)).toBe('1/8');
    expect(formatFraction(1.5)).toBe('1 1/2');
    expect(formatFraction(2)).toBe('2');
  });
});

describe('rounding helpers', () => {
  it('roundTo handles binary edge cases', () => {
    expect(roundTo(28.35, 1)).toBe(28.4);
    expect(roundTo(14.175, 1)).toBe(14.2);
    expect(roundTo(56.7, 1)).toBe(56.7);
  });
  it('formatGrams: 1 decimal under 100 g, whole at 100 g and above', () => {
    expect(formatGrams(14.175)).toBe('14.2');
    expect(formatGrams(56.7)).toBe('56.7');
    expect(formatGrams(83.33)).toBe('83.3');
    expect(formatGrams(99.9)).toBe('99.9');
    expect(formatGrams(100)).toBe('100');
    expect(formatGrams(133.33)).toBe('133');
    expect(formatGrams(226.8)).toBe('227');
    expect(formatGrams(50)).toBe('50');
  });
  it('ceilCount rounds up after removing float noise', () => {
    expect(ceilCount(2.0000001)).toBe(2);
    expect(ceilCount(2.4)).toBe(3);
  });
});

describe('toKitchenMeasure', () => {
  const cases: [number, string][] = [
    [0.5, '1/2 cup'],
    [0.8, '3/4 cup + 2 1/2 tsp'],
    [100 / 120, '3/4 cup + 1 tbsp + 1 tsp'],
    [100 / 81, 'about 1 1/4 cups'],
    [1.6, '1 1/2 cups + 1 tbsp + 1 3/4 tsp'],
    [2, '2 cups'],
    [0.75, '3/4 cup'],
    [1.125, '1 cup + 2 tbsp'],
    [1 / 3, '1/3 cup'],
    [2 / 3, '2/3 cup'],
    [1, '1 cup'],
    // half-a-measurement clean cells
    [0.375, '1/4 cup + 2 tbsp'], // half of 3/4 cup
    [0.25, '1/4 cup'], // third of 3/4 cup
    [1 / 6, '2 tbsp + 2 tsp'], // third of 1/2 cup, half of 1/3 cup
    [1 / 12, '1 tbsp + 1 tsp'], // third of 1/4 cup
    [0.125, '2 tbsp'], // half of 1/4 cup
    [0.625, '1/2 cup + 2 tbsp'], // half of 1 1/4 cups
    // teaspoon-scale (cups = tsp / 48)
    [1.5 / 48, '1 1/2 tsp'],
    [1 / 48, '1 tsp'],
    [0.5 / 48, '1/2 tsp'],
    [0.25 / 48, '1/4 tsp'],
    [0.375 / 48, '1/4 tsp + 1/8 tsp'],
    [1 / 3 / 48, 'about 1/4 tsp + a pinch'],
    [1 / 6 / 48, 'about 1/8 tsp + a pinch'],
  ];
  for (const [cups, expected] of cases) {
    it(`${cups} cups -> ${expected}`, () => {
      expect(toKitchenMeasure(cups)).toBe(expected);
    });
  }
});

describe('grams to cups', () => {
  it('matches the quick answer and FAQ numbers', () => {
    // 200 g flour USDA = 1.6 cups
    expect(formatCupsDecimal(gramsToCups(200, 'ap-flour', 'usda'))).toBe('1.6');
    expect(toKitchenMeasure(gramsToCups(200, 'ap-flour', 'usda'))).toBe(
      '1 1/2 cups + 1 tbsp + 1 3/4 tsp',
    );
    // 200 g flour KA = 1 2/3 cups
    expect(formatFraction(gramsToCups(200, 'ap-flour', 'kingArthur'))).toBe('1 2/3');
    // 200 g granulated sugar = exactly 1 cup
    expect(gramsToCups(200, 'sugar', 'usda')).toBeCloseTo(1, 10);
    // 100 g flour USDA = 0.8 cups = 3/4 cup + 2 1/2 tsp
    expect(formatCupsDecimal(gramsToCups(100, 'ap-flour', 'usda'))).toBe('0.8');
    expect(toKitchenMeasure(gramsToCups(100, 'ap-flour', 'usda'))).toBe('3/4 cup + 2 1/2 tsp');
    // 100 g flour KA = 0.833 cups = 3/4 cup + 1 tbsp + 1 tsp
    expect(toKitchenMeasure(gramsToCups(100, 'ap-flour', 'kingArthur'))).toBe(
      '3/4 cup + 1 tbsp + 1 tsp',
    );
    // 100 g sugar = 1/2 cup
    expect(toKitchenMeasure(gramsToCups(100, 'sugar', 'usda'))).toBe('1/2 cup');
    // 100 g oats = about 1 1/4 cups
    expect(formatCupsDecimal(gramsToCups(100, 'oats', 'usda'))).toBe('1.2');
    expect(toKitchenMeasure(gramsToCups(100, 'oats', 'usda'))).toBe('about 1 1/4 cups');
  });
  it('250 g flour: USDA 2 cups, KA 2 cups + 1 tbsp + 1 tsp', () => {
    expect(gramsToCups(250, 'ap-flour', 'usda')).toBeCloseTo(2, 10);
    expect(toKitchenMeasure(gramsToCups(250, 'ap-flour', 'kingArthur'))).toBe(
      '2 cups + 1 tbsp + 1 tsp',
    );
  });
  it('100 g butter = 0.44 cups', () => {
    expect(formatCupsDecimal(gramsToCups(100, 'butter', 'usda'))).toBe('0.4');
  });
  it('handles zero and large input without NaN', () => {
    expect(gramsToCups(0, 'ap-flour', 'usda')).toBe(0);
    expect(Number.isFinite(gramsToCups(10000, 'ap-flour', 'usda'))).toBe(true);
  });
});

describe('cups to grams', () => {
  it('matches worked examples and FAQ', () => {
    // 1 1/2 cups flour USDA = 187.5 -> 188 g
    expect(formatGrams(cupsToGrams(1.5, 'ap-flour', 'usda'))).toBe('188');
    // KA 180 g
    expect(formatGrams(cupsToGrams(1.5, 'ap-flour', 'kingArthur'))).toBe('180');
    // 3/4 cup brown sugar USDA = 165 g, KA 159.75 -> 160 g
    expect(formatGrams(cupsToGrams(0.75, 'brown-sugar', 'usda'))).toBe('165');
    expect(formatGrams(cupsToGrams(0.75, 'brown-sugar', 'kingArthur'))).toBe('160');
    // 3/4 cup sugar = 150 g
    expect(formatGrams(cupsToGrams(0.75, 'sugar', 'usda'))).toBe('150');
    // 1/2 cup butter = 113 g (butter-stick convention, as in the FAQ copy)
    expect(formatGrams(butterConvert(0.5, 'cups').grams)).toBe('113');
    // 2/3 cup: flour 83.3, sugar 133, milk 162.7 (raw to 1 dp, matching the FAQ)
    expect(roundTo(cupsToGrams(2 / 3, 'ap-flour', 'usda'), 1)).toBe(83.3);
    expect(formatGrams(cupsToGrams(2 / 3, 'sugar', 'usda'))).toBe('133');
    expect(roundTo(cupsToGrams(2 / 3, 'milk', 'usda'), 1)).toBe(162.7);
  });
  it('1 1/2 cups flour USDA shows 6.6 oz', () => {
    expect(roundTo(gramsToOz(cupsToGrams(1.5, 'ap-flour', 'usda')), 1)).toBe(6.6);
  });
});

describe('tablespoons/teaspoons to grams', () => {
  it('matches quick answer and worked examples', () => {
    // 1 tbsp water 14.8, flour 7.8, sugar 12.5, butter 14.2, honey 21.2
    expect(roundTo(spoonsToGrams(1, 'tablespoons', 'water', 'usda'), 1)).toBe(14.8);
    expect(roundTo(spoonsToGrams(1, 'tablespoons', 'ap-flour', 'usda'), 1)).toBe(7.8);
    expect(roundTo(spoonsToGrams(1, 'tablespoons', 'sugar', 'usda'), 1)).toBe(12.5);
    expect(roundTo(spoonsToGrams(1, 'tablespoons', 'butter', 'usda'), 1)).toBe(14.2);
    expect(roundTo(spoonsToGrams(1, 'tablespoons', 'honey', 'usda'), 1)).toBe(21.2);
    // 3 tbsp butter = 42.6 g (default example)
    expect(roundTo(spoonsToGrams(3, 'tablespoons', 'butter', 'usda'), 1)).toBe(42.6);
    // 2 tbsp honey = 42.4 g
    expect(roundTo(spoonsToGrams(2, 'tablespoons', 'honey', 'usda'), 1)).toBe(42.4);
    // 1 tsp sugar about 4.2 g
    expect(roundTo(spoonsToGrams(1, 'teaspoons', 'sugar', 'usda'), 1)).toBe(4.2);
    // salt 1 tsp about 6.1 g (292/48)
    expect(roundTo(spoonsToGrams(1, 'teaspoons', 'salt', 'usda'), 1)).toBe(6.1);
  });
});

describe('butter converter', () => {
  it('250 g butter breaks down as in the spec', () => {
    const r = butterConvert(250, 'grams');
    expect(roundTo(r.sticks, 1)).toBe(2.2);
    expect(roundTo(r.cups, 1)).toBe(1.1);
    expect(roundTo(r.tablespoons, 1)).toBe(17.6);
    expect(roundTo(r.ounces, 1)).toBe(8.8);
    expect(r.stickCut).toBe('about 2 sticks + 1 1/2 tbsp');
  });
  it('1 stick = 1/2 cup = 8 tbsp = 4 oz = 113.4 g', () => {
    const r = butterConvert(1, 'sticks');
    expect(roundTo(r.grams, 1)).toBe(113.4);
    expect(roundTo(r.cups, 3)).toBe(0.5);
    expect(roundTo(r.tablespoons, 3)).toBe(8);
    expect(roundTo(r.ounces, 3)).toBe(4);
  });
  it('6 tbsp = 3/4 stick = 85 g = 3 oz', () => {
    const r = butterConvert(6, 'tablespoons');
    expect(roundTo(r.sticks, 2)).toBe(0.75);
    // 3/4 stick = 85.05 g; the worked-example prose rounds this to 85 g.
    expect(Math.round(r.grams)).toBe(85);
    expect(roundTo(r.ounces, 2)).toBe(3);
  });
  it('butterStickCut of 1 cup (2 sticks) is a clean 2 sticks', () => {
    expect(butterStickCut(226.8)).toBe('2 sticks');
  });
});

describe('recipe scaler', () => {
  it('default example, factor 1.5', () => {
    const f = 1.5;
    expect(scaleLine('2 cups all-purpose flour', f).scaled).toBe('3 cups all-purpose flour');
    expect(scaleLine('3/4 cup sugar', f).scaled).toBe('1 cup + 2 tbsp sugar');
    expect(scaleLine('1/2 cup butter', f).scaled).toBe('3/4 cup butter');
    expect(scaleLine('2 eggs', f).scaled).toBe('3 eggs');
    expect(scaleLine('1 tsp baking powder', f).scaled).toBe('1 1/2 tsp baking powder');
    expect(scaleLine('1/4 tsp salt', f).scaled).toBe('1/4 tsp + 1/8 tsp salt');
  });
  it('worked example 2, factor 1/3', () => {
    const f = 1 / 3;
    expect(scaleLine('2 1/4 cups flour', f).scaled).toBe('3/4 cup flour');
    expect(scaleLine('3 eggs', f).scaled).toBe('1 egg');
    expect(scaleLine('1 tsp vanilla', f).scaled).toBe('about 1/4 tsp + a pinch vanilla');
  });
  it('explicit scaler checks', () => {
    expect(scaleLine('3/4 cup', 1.5).scaled).toBe('1 cup + 2 tbsp');
    expect(scaleLine('1/4 tsp', 1.5).scaled).toBe('1/4 tsp + 1/8 tsp');
  });
  it('grams are multiplied and kept in grams', () => {
    expect(scaleLine('200 g bread flour', 1.5).scaled).toBe('300 g bread flour');
  });
  it('an unreadable line is copied and marked not scaled', () => {
    const r = scaleLine('salt to taste', 2);
    expect(r.notScaled).toBe(true);
    expect(r.scaled).toBe('salt to taste');
  });
});

describe('ingredient dataset', () => {
  it('has 23 ingredients, each with a USDA fdc id and source comment fields', () => {
    expect(INGREDIENTS).toHaveLength(23);
    for (const ing of INGREDIENTS) {
      expect(ing.usdaFdcId).toBeGreaterThan(0);
      expect(ing.usdaPortionText.length).toBeGreaterThan(0);
      expect(ing.usdaGramsPerCup).toBeGreaterThan(0);
    }
  });
  it('difference percentages match the spec', () => {
    const exact = (id: string) => differencePercentExact(getIngredient(id));
    expect(exact('ap-flour')).toBe(4);
    expect(exact('bread-flour')).toBe(12.4);
    expect(exact('cornstarch')).toBe(12.5);
    expect(exact('vegetable-oil')).toBe(9.2);
    expect(exact('oats')).toBe(-9.9);
    expect(exact('milk')).toBe(7);
    expect(exact('rice')).toBe(-7);
    expect(exact('powdered-sugar')).toBe(5.8);
  });
});
