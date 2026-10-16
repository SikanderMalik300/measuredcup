import { describe, it, expect } from 'vitest';
import {
  cupFractionByIngredient,
  cupFractionEquivalents,
  cupFractionGrams,
  gramsToTablespoonsRows,
  gramsToTbsp,
  eighthCupByIngredient,
  eighthCupEquivalents,
} from './tables';
import { toKitchenMeasure } from './kitchen';
import { gramsToOz } from './convert';
import { roundTo, trimDecimal } from './round';

describe('refactor keeps the 1/8 cup output identical', () => {
  it('eighthCupByIngredient == cupFractionByIngredient(1/8)', () => {
    expect(eighthCupByIngredient()).toEqual(cupFractionByIngredient(1 / 8));
  });
  it('eighthCupEquivalents == cupFractionEquivalents(1/8)', () => {
    expect(eighthCupEquivalents()).toEqual(cupFractionEquivalents(1 / 8));
  });
});

describe('1/4 cup equivalents', () => {
  const eq = Object.fromEntries(cupFractionEquivalents(1 / 4).map((r) => [r.label, r.value]));
  it('matches the spec', () => {
    expect(eq['Tablespoons']).toBe('4');
    expect(eq['Teaspoons']).toBe('12');
    expect(eq['Fluid ounces']).toBe('2');
    expect(eq['Milliliters']).toBe('59.1');
    expect(eq['Cups (decimal)']).toBe('0.25');
    expect(eq['Half of 1/4 cup']).toBe('2 tbsp (1/8 cup)');
    expect(eq['Double 1/4 cup']).toBe('1/2 cup');
    expect(eq['Butter']).toBe('1/2 stick');
  });
});

describe('1/4 cup grams by ingredient VERIFY', () => {
  const rows = cupFractionByIngredient(1 / 4);
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]));
  // [usda, ka, perTbsp]
  const expected: Record<string, [string, string, string]> = {
    'ap-flour': ['31.3', '30.0', '7.8'],
    'bread-flour': ['34.3', '30.0', '8.6'],
    'cake-flour': ['34.3', '30.0', '8.6'],
    'ww-flour': ['30.0', '-', '7.5'],
    sugar: ['50.0', '49.5', '12.5'],
    'brown-sugar': ['55.0', '53.3', '13.8'],
    'powdered-sugar': ['30.0', '28.3', '7.5'],
    butter: ['56.8', '56.5', '14.2'],
    honey: ['84.8', '84.0', '21.2'],
    'maple-syrup': ['78.8', '78.0', '19.7'],
    milk: ['61.0', '56.8', '15.3'],
    water: ['59.3', '-', '14.8'],
    'vegetable-oil': ['54.5', '49.5', '13.6'],
    'heavy-cream': ['59.5', '56.8', '14.9'],
    'sour-cream': ['57.5', '56.8', '14.4'],
    yogurt: ['61.3', '-', '15.3'],
    cocoa: ['21.5', '21.0', '5.4'],
    oats: ['20.3', '22.3', '5.1'],
    rice: ['46.3', '49.5', '11.6'],
    cornstarch: ['32.0', '28.0', '8.0'],
    'peanut-butter': ['64.5', '67.5', '16.1'],
    'choc-chips': ['42.0', '42.5', '10.5'],
    salt: ['73.0', '72.0', '18.3'],
  };
  it('has all 23 ingredients', () => expect(rows).toHaveLength(23));
  for (const [id, [usda, ka, perTbsp]] of Object.entries(expected)) {
    it(`${id} = ${usda} / ${ka} / ${perTbsp}`, () => {
      expect(byId[id].usda).toBe(usda);
      expect(byId[id].ka).toBe(ka);
      expect(byId[id].perTbsp).toBe(perTbsp);
    });
  }
  it('default flour: 31.3 USDA, 30.0 KA', () => {
    expect(cupFractionGrams('ap-flour', 'usda', 1 / 4)).toBe('31.3');
    expect(cupFractionGrams('ap-flour', 'kingArthur', 1 / 4)).toBe('30.0');
  });
  it('FAQ oz values: 1/4 cup flour ~1.1 oz, honey ~3 oz', () => {
    expect(roundTo(gramsToOz(31.25), 1)).toBe(1.1);
    expect(roundTo(gramsToOz(84.75), 2)).toBe(2.99); // written as "about 3"
  });
});

describe('grams to tablespoons chart VERIFY (USDA)', () => {
  const rows = gramsToTablespoonsRows();
  const byG = Object.fromEntries(rows.map((r) => [r.grams, r.cells]));
  // cols: flour, sugar, butter, honey, cocoa
  const expected: Record<number, string[]> = {
    5: ['0.64', '0.4', '0.35', '0.24', '0.93'],
    10: ['1.28', '0.8', '0.7', '0.47', '1.86'],
    15: ['1.92', '1.2', '1.06', '0.71', '2.79'],
    20: ['2.56', '1.6', '1.41', '0.94', '3.72'],
    25: ['3.2', '2', '1.76', '1.18', '4.65'],
    30: ['3.84', '2.4', '2.11', '1.42', '5.58'],
    50: ['6.4', '4', '3.52', '2.36', '9.3'],
    100: ['12.8', '8', '7.05', '4.72', '18.6'],
  };
  for (const [g, cells] of Object.entries(expected)) {
    it(`${g} g`, () => expect(byG[Number(g)]).toEqual(cells));
  }
});

describe('grams to tablespoons defaults and FAQ numbers', () => {
  it('default 20 g sugar: 1.6 tbsp, 4.8 tsp', () => {
    expect(trimDecimal(gramsToTbsp(20, 'sugar', 'usda'), 2)).toBe('1.6');
    expect(trimDecimal(20 / (200 / 48), 2)).toBe('4.8');
  });
  it('line 2 is toKitchenMeasure(0.1)', () => {
    expect(toKitchenMeasure(20 / 200)).toBe(toKitchenMeasure(0.1));
    expect(toKitchenMeasure(0.1)).toBe('about 1 tbsp + 1 3/4 tsp');
  });
  it('FAQ: 10 g sugar = 0.8 tbsp / 2.4 tsp', () => {
    expect(trimDecimal(gramsToTbsp(10, 'sugar', 'usda'), 2)).toBe('0.8');
    expect(trimDecimal(10 / (200 / 48), 2)).toBe('2.4');
  });
  it('FAQ: 100 g butter = 7.05 tbsp', () => {
    expect(trimDecimal(gramsToTbsp(100, 'butter', 'usda'), 2)).toBe('7.05');
  });
  it('FAQ: 20 g flour = 2.56 USDA, 2.67 KA', () => {
    expect(trimDecimal(gramsToTbsp(20, 'ap-flour', 'usda'), 2)).toBe('2.56');
    expect(trimDecimal(gramsToTbsp(20, 'ap-flour', 'kingArthur'), 2)).toBe('2.67');
  });
});
