import { describe, it, expect } from 'vitest';
import {
  tablespoonsToCupsRows,
  spoonGramsByIngredient,
  eighthCupByIngredient,
  eighthCupEquivalents,
  eighthCupGrams,
  mlFromTsp,
  flOzFromTsp,
} from './tables';

describe('tablespoons-to-cups chart', () => {
  const rows = tablespoonsToCupsRows();
  const byTbsp = Object.fromEntries(rows.map((r) => [r.tbsp, r]));
  it('has 19 rows', () => expect(rows).toHaveLength(19));
  it('default example 10 tbsp', () => {
    expect(byTbsp[10]).toMatchObject({
      cups: '0.625',
      measureWith: '1/2 cup + 2 tbsp',
      ml: '147.9',
      flOz: '5',
    });
  });
  it('1 tbsp and 11 tbsp and 16 tbsp', () => {
    expect(byTbsp[1]).toMatchObject({ cups: '0.0625', ml: '14.8', flOz: '0.5' });
    expect(byTbsp[11]).toMatchObject({ measureWith: '2/3 cup + 1 tsp', ml: '162.7', flOz: '5.5' });
    expect(byTbsp[16]).toMatchObject({ cups: '1', measureWith: '1 cup', ml: '236.6', flOz: '8' });
    expect(byTbsp[6].measureWith).toBe('1/4 cup + 2 tbsp');
  });
});

describe('page 1 table 2 VERIFY (spoon grams, USDA)', () => {
  const rows = spoonGramsByIngredient();
  const byTbsp = Object.fromEntries(rows.map((r) => [r.tbsp, r.cells]));
  // cols: ap-flour, sugar, butter, vegetable-oil
  it('4 tbsp', () => expect(byTbsp[4]).toEqual(['31.3', '50.0', '56.8', '54.5']));
  it('10 tbsp', () => expect(byTbsp[10]).toEqual(['78.1', '125', '142', '136']));
  it('12 tbsp', () => expect(byTbsp[12]).toEqual(['93.8', '150', '170', '164']));
});

describe('1/8 cup equivalents', () => {
  const eq = Object.fromEntries(eighthCupEquivalents().map((r) => [r.label, r.value]));
  it('matches the spec', () => {
    expect(eq['Tablespoons']).toBe('2');
    expect(eq['Teaspoons']).toBe('6');
    expect(eq['Fluid ounces']).toBe('1');
    expect(eq['Milliliters']).toBe('29.6');
    expect(eq['Cups (decimal)']).toBe('0.125');
    expect(eq['Half of 1/8 cup']).toBe('1 tbsp');
    expect(eq['Double 1/8 cup']).toBe('1/4 cup');
  });
});

describe('1/8 cup in grams by ingredient VERIFY', () => {
  const rows = eighthCupByIngredient();
  const byId = Object.fromEntries(rows.map((r) => [r.id, r]));
  const expectUsda: Record<string, string> = {
    'ap-flour': '15.6',
    'bread-flour': '17.1',
    sugar: '25.0',
    'brown-sugar': '27.5',
    'powdered-sugar': '15.0',
    butter: '28.4',
    honey: '42.4',
    'maple-syrup': '39.4',
    milk: '30.5',
    water: '29.6',
    'vegetable-oil': '27.3',
    'heavy-cream': '29.8',
    'sour-cream': '28.8',
    yogurt: '30.6',
    cocoa: '10.8',
    oats: '10.1',
    rice: '23.1',
    cornstarch: '16.0',
    'peanut-butter': '32.3',
    'choc-chips': '21.0',
    salt: '36.5',
  };
  it('has all 23 ingredients', () => expect(rows).toHaveLength(23));
  for (const [id, g] of Object.entries(expectUsda)) {
    it(`USDA ${id} = ${g}`, () => expect(byId[id].usda).toBe(g));
  }
  it('King Arthur values', () => {
    expect(byId['ap-flour'].ka).toBe('15.0');
    expect(byId['sugar'].ka).toBe('24.8');
    expect(byId['butter'].ka).toBe('28.3');
    expect(byId['vegetable-oil'].ka).toBe('24.8');
    expect(byId['ww-flour'].ka).toBe('-'); // no KA figure
  });
  it('per-tablespoon USDA', () => {
    expect(byId['ap-flour'].perTbsp).toBe('7.8');
    expect(byId['butter'].perTbsp).toBe('14.2');
  });
});

describe('page defaults and FAQ numbers', () => {
  it('1/8 cup flour default: 15.6 USDA, 15.0 KA', () => {
    expect(eighthCupGrams('ap-flour', 'usda')).toBe('15.6');
    expect(eighthCupGrams('ap-flour', 'kingArthur')).toBe('15.0');
  });
  it('1/8 cup sugar 25.0, honey 42.4, oil 27.3', () => {
    expect(eighthCupGrams('sugar', 'usda')).toBe('25.0');
    expect(eighthCupGrams('honey', 'usda')).toBe('42.4');
    expect(eighthCupGrams('vegetable-oil', 'usda')).toBe('27.3');
  });
  it('mL and fl oz helpers', () => {
    expect(mlFromTsp(6)).toBe('29.6');
    expect(flOzFromTsp(6)).toBe('1');
    expect(flOzFromTsp(3)).toBe('0.5');
  });
});
