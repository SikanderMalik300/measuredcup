import { describe, it, expect } from 'vitest';
import { tbspTspLabel } from './kitchen';
import {
  cupFractionEquivalents,
  cupFractionByIngredient,
  cupFractionGrams,
  eighthCupByIngredient,
  eighthCupEquivalents,
  quartsToCupsRows,
  threeQuartsRows,
  quartWeightRows,
  liquidVolumeConvert,
  formatMl,
} from './tables';
import { spoonsToGrams } from './convert';
import { roundTo, trimDecimal } from './round';

describe('tbspTspLabel', () => {
  const cases: [number, string][] = [
    [16, '5 tbsp + 1 tsp'],
    [8, '2 tbsp + 2 tsp'],
    [32, '10 tbsp + 2 tsp'],
    [12, '4 tbsp'],
    [6, '2 tbsp'],
  ];
  for (const [tsp, expected] of cases) {
    it(`${tsp} tsp -> ${expected}`, () => expect(tbspTspLabel(tsp)).toBe(expected));
  }
});

describe('refactor keeps 1/8 and 1/4 output identical', () => {
  it('1/8 equivalents and by-ingredient unchanged', () => {
    const eq = Object.fromEntries(eighthCupEquivalents().map((r) => [r.label, r.value]));
    expect(eq['Tablespoons']).toBe('2');
    expect(eq['Fluid ounces']).toBe('1');
    expect(eq['Cups (decimal)']).toBe('0.125');
    expect(eq['Half of 1/8 cup']).toBe('1 tbsp');
    expect(eighthCupByIngredient().find((r) => r.id === 'ap-flour')!.usda).toBe('15.6');
  });
  it('1/4 equivalents unchanged', () => {
    const eq = Object.fromEntries(cupFractionEquivalents(1 / 4).map((r) => [r.label, r.value]));
    expect(eq['Tablespoons']).toBe('4');
    expect(eq['Cups (decimal)']).toBe('0.25');
    expect(eq['Half of 1/4 cup']).toBe('2 tbsp (1/8 cup)');
    expect(eq['Butter']).toBe('1/2 stick');
  });
});

describe('1/3 cup equivalents', () => {
  const eq = Object.fromEntries(cupFractionEquivalents(1 / 3).map((r) => [r.label, r.value]));
  it('matches the spec', () => {
    expect(eq['Tablespoons']).toBe('5 tbsp + 1 tsp (5 1/3)');
    expect(eq['Teaspoons']).toBe('16');
    expect(eq['Fluid ounces']).toBe('2.67');
    expect(eq['Milliliters']).toBe('78.9');
    expect(eq['Cups (decimal)']).toBe('0.333');
    expect(eq['Half of 1/3 cup']).toBe('2 tbsp + 2 tsp');
    expect(eq['Double 1/3 cup']).toBe('2/3 cup (10 tbsp + 2 tsp)');
    expect(eq['Butter']).toBe('5 tbsp + 1 tsp, about 2/3 of a stick');
  });
});

describe('1/3 cup grams by ingredient VERIFY', () => {
  const byId = Object.fromEntries(cupFractionByIngredient(1 / 3).map((r) => [r.id, r]));
  const expected: Record<string, [string, string, string]> = {
    'ap-flour': ['41.7', '40.0', '7.8'],
    'bread-flour': ['45.7', '40.0', '8.6'],
    'cake-flour': ['45.7', '40.0', '8.6'],
    'ww-flour': ['40.0', '-', '7.5'],
    sugar: ['66.7', '66.0', '12.5'],
    'brown-sugar': ['73.3', '71.0', '13.8'],
    'powdered-sugar': ['40.0', '37.7', '7.5'],
    butter: ['75.7', '75.3', '14.2'],
    honey: ['113', '112', '21.2'],
    'maple-syrup': ['105', '104', '19.7'],
    milk: ['81.3', '75.7', '15.3'],
    water: ['79.0', '-', '14.8'],
    'vegetable-oil': ['72.7', '66.0', '13.6'],
    'heavy-cream': ['79.3', '75.7', '14.9'],
    'sour-cream': ['76.7', '75.7', '14.4'],
    yogurt: ['81.7', '-', '15.3'],
    cocoa: ['28.7', '28.0', '5.4'],
    oats: ['27.0', '29.7', '5.1'],
    rice: ['61.7', '66.0', '11.6'],
    cornstarch: ['42.7', '37.3', '8.0'],
    'peanut-butter': ['86.0', '90.0', '16.1'],
    'choc-chips': ['56.0', '56.7', '10.5'],
    salt: ['97.3', '96.0', '18.3'],
  };
  for (const [id, [usda, ka, perTbsp]] of Object.entries(expected)) {
    it(`${id} = ${usda} / ${ka} / ${perTbsp}`, () => {
      expect(byId[id].usda).toBe(usda);
      expect(byId[id].ka).toBe(ka);
      expect(byId[id].perTbsp).toBe(perTbsp);
    });
  }
  it('default flour: 41.7 USDA, 40.0 KA', () => {
    expect(cupFractionGrams('ap-flour', 'usda', 1 / 3)).toBe('41.7');
    expect(cupFractionGrams('ap-flour', 'kingArthur', 1 / 3)).toBe('40.0');
  });
  it('FAQ: 5 tbsp sugar = 62.5 g, 1 tsp sugar = 4.2 g', () => {
    expect(roundTo(spoonsToGrams(5, 'tablespoons', 'sugar', 'usda'), 1)).toBe(62.5);
    expect(roundTo(spoonsToGrams(1, 'teaspoons', 'sugar', 'usda'), 1)).toBe(4.2);
  });
});

describe('quarts to cups chart VERIFY', () => {
  const byQuarts = Object.fromEntries(quartsToCupsRows().map((r) => [r.quarts, r]));
  const expected: Record<string, [string, string, string, string]> = {
    // quarts label -> [cups, pints, flOz, mL]
    '1/4': ['1', '1/2', '8', '236.6'],
    '1/2': ['2', '1', '16', '473.2'],
    '3/4': ['3', '1 1/2', '24', '709.8'],
    '1': ['4', '2', '32', '946.4'],
    '1 1/2': ['6', '3', '48', '1,420'],
    '2': ['8', '4', '64', '1,893'],
    '3': ['12', '6', '96', '2,839'],
    '4 (1 gallon)': ['16', '8', '128', '3,785'],
  };
  for (const [q, [cups, pints, flOz, ml]] of Object.entries(expected)) {
    it(`${q} quart`, () => {
      expect(byQuarts[q]).toMatchObject({ cups, pints, flOz, ml });
    });
  }
});

describe('three kinds of quart', () => {
  const byName = Object.fromEntries(threeQuartsRows().map((r) => [r.name, r]));
  it('matches the spec', () => {
    expect(byName['US liquid quart']).toMatchObject({ ml: '946.4', cups: '4' });
    expect(byName['US dry quart']).toMatchObject({ ml: '1,101', cups: '4.65' });
    expect(byName['UK imperial quart']).toMatchObject({ ml: '1,137', cups: '4.8' });
  });
});

describe('what a quart weighs (USDA)', () => {
  const byName = Object.fromEntries(quartWeightRows().map((r) => [r.name, r]));
  it('matches the spec', () => {
    expect(byName['Water']).toMatchObject({ grams: '948', pounds: '2.09' });
    expect(byName['Whole milk']).toMatchObject({ grams: '976', pounds: '2.15' });
    expect(byName['Heavy cream']).toMatchObject({ grams: '952', pounds: '2.10' });
    expect(byName['Vegetable oil']).toMatchObject({ grams: '872', pounds: '1.92' });
    expect(byName['Maple syrup']).toMatchObject({ grams: '1,260', pounds: '2.78' });
    expect(byName['Honey']).toMatchObject({ grams: '1,356', pounds: '2.99' });
  });
});

describe('LiquidVolumeTool default (1 quart) and FAQ numbers', () => {
  it('1 quart = 4 cups and the rest', () => {
    const r = liquidVolumeConvert(1, 'quarts');
    expect(trimDecimal(r.cups, 3)).toBe('4');
    expect(trimDecimal(r.gallons, 3)).toBe('0.25');
    expect(trimDecimal(r.pints, 3)).toBe('2');
    expect(trimDecimal(r.flOz, 2)).toBe('32');
    expect(trimDecimal(r.tbsp, 1)).toBe('64');
    expect(formatMl(r.ml)).toBe('946.4');
    expect(trimDecimal(r.liters, 2)).toBe('0.95');
  });
  it('FAQ: 1 liter = 4.23 cups, quart/liter about 95%', () => {
    expect(trimDecimal(liquidVolumeConvert(1, 'liters').cups, 2)).toBe('4.23');
    expect(roundTo((946.352946 / 1000) * 100, 1)).toBe(94.6); // "about 95%"
  });
  it('FAQ: 2 quarts = 8 cups', () => {
    expect(trimDecimal(liquidVolumeConvert(2, 'quarts').cups, 3)).toBe('8');
  });
});
