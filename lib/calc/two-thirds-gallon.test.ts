import { describe, it, expect } from 'vitest';
import { tbspTspLabel } from './kitchen';
import {
  cupFractionEquivalents,
  cupFractionByIngredient,
  cupFractionGrams,
  gallonsToCupsRows,
  threeGallonsRows,
  gallonWeightRows,
  quartWeightRows,
  liquidVolumeConvert,
  formatMl,
} from './tables';
import { spoonsToGrams } from './convert';
import { roundTo, trimDecimal } from './round';

describe('refactor keeps 1/3 output identical', () => {
  it('1/3 equivalents unchanged', () => {
    const eq = Object.fromEntries(cupFractionEquivalents(1 / 3).map((r) => [r.label, r.value]));
    expect(eq['Tablespoons']).toBe('5 tbsp + 1 tsp (5 1/3)');
    expect(eq['Cups (decimal)']).toBe('0.333');
    expect(eq['Double 1/3 cup']).toBe('2/3 cup (10 tbsp + 2 tsp)');
    expect(eq['Butter']).toBe('5 tbsp + 1 tsp, about 2/3 of a stick');
  });
  it('quart weight table unchanged', () => {
    const byName = Object.fromEntries(quartWeightRows().map((r) => [r.name, r]));
    expect(byName['Water']).toMatchObject({ grams: '948', pounds: '2.09' });
  });
});

describe('2/3 cup equivalents', () => {
  const eq = Object.fromEntries(cupFractionEquivalents(2 / 3).map((r) => [r.label, r.value]));
  it('matches the spec', () => {
    expect(eq['Tablespoons']).toBe('10 tbsp + 2 tsp (10 2/3)');
    expect(eq['Teaspoons']).toBe('32');
    expect(eq['Fluid ounces']).toBe('5.33');
    expect(eq['Milliliters']).toBe('157.7');
    expect(eq['Cups (decimal)']).toBe('0.667');
    expect(eq['Half of 2/3 cup']).toBe('1/3 cup (5 tbsp + 1 tsp)');
    expect(eq['Double 2/3 cup']).toBe('1 1/3 cups');
    expect(eq['Butter']).toBe('10 tbsp + 2 tsp, 1 1/3 sticks');
  });
  it('tbspTspLabel(32) = 10 tbsp + 2 tsp', () => {
    expect(tbspTspLabel(32)).toBe('10 tbsp + 2 tsp');
  });
});

describe('2/3 cup grams by ingredient VERIFY', () => {
  const byId = Object.fromEntries(cupFractionByIngredient(2 / 3).map((r) => [r.id, r]));
  const expected: Record<string, [string, string, string]> = {
    'ap-flour': ['83.3', '80.0', '7.8'],
    'bread-flour': ['91.3', '80.0', '8.6'],
    'cake-flour': ['91.3', '80.0', '8.6'],
    'ww-flour': ['80.0', '-', '7.5'],
    sugar: ['133', '132', '12.5'],
    'brown-sugar': ['147', '142', '13.8'],
    'powdered-sugar': ['80.0', '75.3', '7.5'],
    butter: ['151', '151', '14.2'],
    honey: ['226', '224', '21.2'],
    'maple-syrup': ['210', '208', '19.7'],
    milk: ['163', '151', '15.3'],
    water: ['158', '-', '14.8'],
    'vegetable-oil': ['145', '132', '13.6'],
    'heavy-cream': ['159', '151', '14.9'],
    'sour-cream': ['153', '151', '14.4'],
    yogurt: ['163', '-', '15.3'],
    cocoa: ['57.3', '56.0', '5.4'],
    oats: ['54.0', '59.3', '5.1'],
    rice: ['123', '132', '11.6'],
    cornstarch: ['85.3', '74.7', '8.0'],
    'peanut-butter': ['172', '180', '16.1'],
    'choc-chips': ['112', '113', '10.5'],
    salt: ['195', '192', '18.3'],
  };
  for (const [id, [usda, ka, perTbsp]] of Object.entries(expected)) {
    it(`${id} = ${usda} / ${ka} / ${perTbsp}`, () => {
      expect(byId[id].usda).toBe(usda);
      expect(byId[id].ka).toBe(ka);
      expect(byId[id].perTbsp).toBe(perTbsp);
    });
  }
  it('default flour: 83.3 USDA, 80.0 KA', () => {
    expect(cupFractionGrams('ap-flour', 'usda', 2 / 3)).toBe('83.3');
    expect(cupFractionGrams('ap-flour', 'kingArthur', 2 / 3)).toBe('80.0');
  });
  it('FAQ/worked: 2/3 cup milk = 163 g; 2 1/4 cups = 8 tbsp + 2 tbsp + 2 tsp', () => {
    expect(cupFractionGrams('milk', 'usda', 2 / 3)).toBe('163');
    // 2 quarter cups = 8 tbsp (24 tsp); 2/3 cup = 32 tsp; remainder 8 tsp = 2 tbsp + 2 tsp
    expect(roundTo(spoonsToGrams(2, 'tablespoons', 'sugar', 'usda'), 1)).toBe(25); // sanity
    expect(tbspTspLabel(32 - 24)).toBe('2 tbsp + 2 tsp');
  });
});

describe('gallons to cups chart VERIFY', () => {
  const byG = Object.fromEntries(gallonsToCupsRows().map((r) => [r.gallons, r]));
  const expected: Record<string, [string, string, string, string, string]> = {
    // gallons -> [cups, quarts, pints, flOz, liters]
    '1/4': ['4', '1', '2', '32', '0.95'],
    '1/2': ['8', '2', '4', '64', '1.89'],
    '3/4': ['12', '3', '6', '96', '2.84'],
    '1': ['16', '4', '8', '128', '3.79'],
    '1 1/2': ['24', '6', '12', '192', '5.68'],
    '2': ['32', '8', '16', '256', '7.57'],
    '3': ['48', '12', '24', '384', '11.36'],
    '5': ['80', '20', '40', '640', '18.93'],
  };
  for (const [g, [cups, quarts, pints, flOz, liters]] of Object.entries(expected)) {
    it(`${g} gallon`, () => {
      expect(byG[g]).toMatchObject({ cups, quarts, pints, flOz, liters });
    });
  }
});

describe('three kinds of gallon', () => {
  const byName = Object.fromEntries(threeGallonsRows().map((r) => [r.name, r]));
  it('matches the spec', () => {
    expect(byName['US liquid gallon']).toMatchObject({ liters: '3.79', cups: '16' });
    expect(byName['UK imperial gallon']).toMatchObject({ liters: '4.55', cups: '19.22' });
    expect(byName['US dry gallon']).toMatchObject({ liters: '4.40', cups: '18.62' });
  });
});

describe('what a gallon weighs (USDA)', () => {
  const byName = Object.fromEntries(gallonWeightRows().map((r) => [r.name, r]));
  it('matches the spec', () => {
    expect(byName['Water']).toMatchObject({ grams: '3,792', pounds: '8.36' });
    expect(byName['Whole milk']).toMatchObject({ grams: '3,904', pounds: '8.61' });
    expect(byName['Heavy cream']).toMatchObject({ grams: '3,808', pounds: '8.40' });
    expect(byName['Vegetable oil']).toMatchObject({ grams: '3,488', pounds: '7.69' });
    expect(byName['Maple syrup']).toMatchObject({ grams: '5,040', pounds: '11.11' });
    expect(byName['Honey']).toMatchObject({ grams: '5,424', pounds: '11.96' });
  });
  it('water at 1 g/mL is 8.35 lb per gallon', () => {
    expect(roundTo((3785.411784 * 1) / 453.59237, 2).toFixed(2)).toBe('8.35');
  });
});

describe('LiquidVolumeTool gallon default and FAQ numbers', () => {
  it('1 gallon = 16 cups and the rest', () => {
    const r = liquidVolumeConvert(1, 'gallons');
    expect(trimDecimal(r.cups, 3)).toBe('16');
    expect(trimDecimal(r.gallons, 3)).toBe('1');
    expect(trimDecimal(r.quarts, 3)).toBe('4');
    expect(trimDecimal(r.pints, 3)).toBe('8');
    expect(trimDecimal(r.flOz, 2)).toBe('128');
    expect(trimDecimal(r.tbsp, 1)).toBe('256');
    expect(formatMl(r.ml)).toBe('3,785');
    expect(trimDecimal(r.liters, 2)).toBe('3.79');
  });
  it('quart default unchanged: 1 quart = 4 cups', () => {
    expect(trimDecimal(liquidVolumeConvert(1, 'quarts').cups, 3)).toBe('4');
  });
  it('FAQ: half gallon = 8 cups; gallon of milk ~8.61 lb', () => {
    expect(trimDecimal(liquidVolumeConvert(0.5, 'gallons').cups, 3)).toBe('8');
    expect(roundTo((16 * 244) / 453.59237, 2).toFixed(2)).toBe('8.61');
  });
});
