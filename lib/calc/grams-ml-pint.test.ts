import { describe, it, expect } from 'vitest';
import { gramsToMl, gramsToCups } from './convert';
import {
  gramsToMlRows,
  gramsToMlDensityRows,
  densityDisplay,
  pintsToCupsRows,
  threePintsRows,
  pintWeightRows,
  quartWeightRows,
  gallonWeightRows,
  liquidVolumeConvert,
  formatMl,
} from './tables';
import { toKitchenMeasure } from './kitchen';
import { roundTo, trimDecimal } from './round';

describe('grams to mL chart VERIFY (USDA)', () => {
  const byG = Object.fromEntries(gramsToMlRows().map((r) => [r.grams, r.cells]));
  // cols: flour, sugar, butter, milk, water, honey
  const expected: Record<number, string[]> = {
    10: ['18.9', '11.8', '10.4', '9.7', '10.0', '7.0'],
    25: ['47.3', '29.6', '26.1', '24.2', '25.0', '17.4'],
    50: ['94.6', '59.1', '52.1', '48.5', '49.9', '34.9'],
    100: ['189.3', '118.3', '104.2', '97.0', '99.8', '69.8'],
    200: ['378.5', '236.6', '208.4', '193.9', '199.7', '139.6'],
    250: ['473.2', '295.7', '260.6', '242.4', '249.6', '174.5'],
    500: ['946.4', '591.5', '521.1', '484.8', '499.1', '349.0'],
  };
  for (const [g, cells] of Object.entries(expected)) {
    it(`${g} g`, () => expect(byG[Number(g)]).toEqual(cells));
  }
});

describe('density and mL per 100 g VERIFY', () => {
  const byId = Object.fromEntries(gramsToMlDensityRows().map((r) => [r.id, r]));
  // [g/mL, mL USDA, mL KA]
  const expected: Record<string, [string, string, string]> = {
    'ap-flour': ['0.528', '189.3', '197.2'],
    'bread-flour': ['0.579', '172.7', '197.2'],
    'cake-flour': ['0.579', '172.7', '197.2'],
    'ww-flour': ['0.507', '197.2', '-'],
    sugar: ['0.845', '118.3', '119.5'],
    'brown-sugar': ['0.930', '107.5', '111.1'],
    'powdered-sugar': ['0.507', '197.2', '209.4'],
    butter: ['0.959', '104.2', '104.7'],
    honey: ['1.433', '69.8', '70.4'],
    'maple-syrup': ['1.331', '75.1', '75.8'],
    milk: ['1.031', '97.0', '104.2'],
    water: ['1.002', '99.8', '-'],
    'vegetable-oil': ['0.921', '108.5', '119.5'],
    'heavy-cream': ['1.006', '99.4', '104.2'],
    'sour-cream': ['0.972', '102.9', '104.2'],
    yogurt: ['1.036', '96.6', '-'],
    cocoa: ['0.364', '275.1', '281.7'],
    oats: ['0.342', '292.1', '265.8'],
    rice: ['0.782', '127.9', '119.5'],
    cornstarch: ['0.541', '184.8', '211.2'],
    'peanut-butter': ['1.091', '91.7', '87.6'],
    'choc-chips': ['0.710', '140.8', '139.2'],
    salt: ['1.234', '81.0', '82.1'],
  };
  it('has all 23 ingredients', () => expect(gramsToMlDensityRows()).toHaveLength(23));
  for (const [id, [dens, usda, ka]] of Object.entries(expected)) {
    it(`${id} = ${dens} / ${usda} / ${ka}`, () => {
      expect(byId[id].density).toBe(dens);
      expect(byId[id].mlUsda).toBe(usda);
      expect(byId[id].mlKa).toBe(ka);
    });
  }
});

describe('grams to mL tool: defaults and FAQ numbers', () => {
  it('default 100 g flour: 189.3 mL USDA, 197.2 mL KA', () => {
    expect(formatMl(gramsToMl(100, 'ap-flour', 'usda'))).toBe('189.3');
    expect(formatMl(gramsToMl(100, 'ap-flour', 'kingArthur'))).toBe('197.2');
  });
  it('default line 2 = "0.8 cups · 3/4 cup + 2 1/2 tsp"', () => {
    const cups = gramsToCups(100, 'ap-flour', 'usda');
    const line2 = `${trimDecimal(cups, 2)} cups · ${toKitchenMeasure(cups)}`;
    expect(line2).toBe('0.8 cups · 3/4 cup + 2 1/2 tsp');
  });
  it('default density = 0.528', () => {
    expect(densityDisplay('ap-flour', 'usda')).toBe('0.528');
  });
  it('FAQ: 1 g flour ~1.89 mL, 1 g honey ~0.70 mL', () => {
    expect(roundTo(gramsToMl(1, 'ap-flour', 'usda'), 2)).toBe(1.89);
    expect(roundTo(gramsToMl(1, 'honey', 'usda'), 2)).toBe(0.7);
  });
  it('FAQ: 100 g sugar = 118.3 mL; 100 g butter ~104 mL', () => {
    expect(formatMl(gramsToMl(100, 'sugar', 'usda'))).toBe('118.3');
    expect(formatMl(gramsToMl(100, 'butter', 'usda'))).toBe('104.2');
  });
});

describe('pints to cups chart VERIFY', () => {
  const byP = Object.fromEntries(pintsToCupsRows().map((r) => [r.pints, r]));
  const expected: Record<string, [string, string, string, string]> = {
    // pints -> [cups, flOz, quarts, mL]
    '1/2': ['1', '8', '1/4', '236.6'],
    '1': ['2', '16', '1/2', '473.2'],
    '1 1/2': ['3', '24', '3/4', '709.8'],
    '2': ['4', '32', '1', '946.4'],
    '3': ['6', '48', '1 1/2', '1,420'],
    '4': ['8', '64', '2', '1,893'],
    '8 (1 gallon)': ['16', '128', '4', '3,785'],
  };
  for (const [p, [cups, flOz, quarts, ml]] of Object.entries(expected)) {
    it(`${p} pint`, () => {
      expect(byP[p]).toMatchObject({ cups, flOz, quarts, ml });
    });
  }
});

describe('three kinds of pint', () => {
  const byName = Object.fromEntries(threePintsRows().map((r) => [r.name, r]));
  it('matches the spec', () => {
    expect(byName['US liquid pint']).toMatchObject({ ml: '473.2', cups: '2' });
    expect(byName['US dry pint']).toMatchObject({ ml: '550.6', cups: '2.33' });
    expect(byName['UK imperial pint']).toMatchObject({ ml: '568.3', cups: '2.4' });
  });
});

describe('what a pint weighs (USDA)', () => {
  const byName = Object.fromEntries(pintWeightRows().map((r) => [r.name, r]));
  it('matches the spec', () => {
    expect(byName['Water']).toMatchObject({ grams: '474', pounds: '1.04' });
    expect(byName['Whole milk']).toMatchObject({ grams: '488', pounds: '1.08' });
    expect(byName['Heavy cream']).toMatchObject({ grams: '476', pounds: '1.05' });
    expect(byName['Vegetable oil']).toMatchObject({ grams: '436', pounds: '0.96' });
    expect(byName['Maple syrup']).toMatchObject({ grams: '630', pounds: '1.39' });
    expect(byName['Honey']).toMatchObject({ grams: '678', pounds: '1.49' });
  });
});

describe('LiquidVolumeTool pint default and other defaults unchanged', () => {
  it('1 pint = 2 cups and the rest', () => {
    const r = liquidVolumeConvert(1, 'pints');
    expect(trimDecimal(r.cups, 3)).toBe('2');
    expect(trimDecimal(r.gallons, 3)).toBe('0.125');
    expect(trimDecimal(r.quarts, 3)).toBe('0.5');
    expect(trimDecimal(r.pints, 3)).toBe('1');
    expect(trimDecimal(r.flOz, 2)).toBe('16');
    expect(trimDecimal(r.tbsp, 1)).toBe('32');
    expect(formatMl(r.ml)).toBe('473.2');
    expect(trimDecimal(r.liters, 2)).toBe('0.47');
  });
  it('quart default still 4 cups, gallon default still 16 cups', () => {
    expect(trimDecimal(liquidVolumeConvert(1, 'quarts').cups, 3)).toBe('4');
    expect(trimDecimal(liquidVolumeConvert(1, 'gallons').cups, 3)).toBe('16');
  });
  it('FAQ: UK/US pint ratio about 20% (1.2009)', () => {
    expect(roundTo(568.26125 / 473.176473, 4)).toBe(1.2009);
  });
  it('quart and gallon weight tables unchanged', () => {
    const q = Object.fromEntries(quartWeightRows().map((r) => [r.name, r]));
    expect(q['Water']).toMatchObject({ grams: '948', pounds: '2.09' });
    const g = Object.fromEntries(gallonWeightRows().map((r) => [r.name, r]));
    expect(g['Water']).toMatchObject({ grams: '3,792', pounds: '8.36' });
  });
});
