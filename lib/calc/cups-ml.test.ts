import { describe, it, expect } from 'vitest';
import {
  cupSizesRows,
  cupsToMlRows,
  mlToCupsRows,
  mlToTbsp,
  mlToFlOz,
  formatMl,
} from './tables';
import { toKitchenMeasure } from './kitchen';
import { trimDecimal, roundTo } from './round';

const ML_PER_CUP = 236.5882365;

describe('cups to mL chart VERIFY', () => {
  const byCups = Object.fromEntries(cupsToMlRows().map((r) => [r.cups, r]));
  const expected: Record<string, [string, string, string]> = {
    // cups -> [US, label, metric]
    '1/8': ['29.6', '30.0', '31.3'],
    '1/4': ['59.1', '60.0', '62.5'],
    '1/3': ['78.9', '80.0', '83.3'],
    '1/2': ['118.3', '120.0', '125.0'],
    '2/3': ['157.7', '160.0', '166.7'],
    '3/4': ['177.4', '180.0', '187.5'],
    '1': ['236.6', '240.0', '250.0'],
    '1 1/2': ['354.9', '360.0', '375.0'],
    '2': ['473.2', '480.0', '500.0'],
    '3': ['709.8', '720.0', '750.0'],
    '4': ['946.4', '960.0', '1,000'],
  };
  for (const [c, [us, label, metric]] of Object.entries(expected)) {
    it(`${c} cup`, () => expect(byCups[c]).toMatchObject({ us, label, metric }));
  }
});

describe('mL to cups chart VERIFY', () => {
  const byMl = Object.fromEntries(mlToCupsRows().map((r) => [r.ml, r]));
  const expected: Record<number, [string, string]> = {
    // mL -> [US cups, metric cups]
    30: ['0.127', '0.12'],
    50: ['0.211', '0.2'],
    60: ['0.254', '0.24'],
    100: ['0.423', '0.4'],
    120: ['0.507', '0.48'],
    150: ['0.634', '0.6'],
    200: ['0.845', '0.8'],
    240: ['1.014', '0.96'],
    250: ['1.057', '1'],
    300: ['1.268', '1.2'],
    500: ['2.113', '2'],
    750: ['3.17', '3'],
    1000: ['4.227', '4'],
  };
  for (const [ml, [us, metric]] of Object.entries(expected)) {
    it(`${ml} mL`, () => expect(byMl[Number(ml)]).toMatchObject({ us, metric }));
  }
  it('measureWith comes from toKitchenMeasure (F7 single-fraction sub-tsp)', () => {
    expect(byMl[250].measureWith).toBe(toKitchenMeasure(250 / ML_PER_CUP));
    expect(byMl[200].measureWith).toBe('3/4 cup + 1 tbsp + 1 1/2 tsp');
    expect(byMl[30].measureWith).toBe('about 2 tbsp + a pinch');
    expect(byMl[240].measureWith).toBe('1 cup + 3/4 tsp');
    expect(byMl[300].measureWith).toBe('1 1/4 cups + 3/4 tsp');
  });
});

describe('cup sizes compared', () => {
  const byName = Object.fromEntries(cupSizesRows().map((r) => [r.name, r]));
  it('matches the spec', () => {
    expect(byName['US customary cup']).toMatchObject({ ml: '236.6', vs: '-' });
    expect(byName['US nutrition label cup']).toMatchObject({ ml: '240', vs: '+1.4%' });
    expect(byName['Metric cup (UK, AU, NZ, CA)']).toMatchObject({ ml: '250', vs: '+5.7%' });
    expect(byName['Japanese cup']).toMatchObject({ ml: '200', vs: '-15.5%' });
  });
  it('percentages (2 dp) match the spec note', () => {
    expect(roundTo((240 / ML_PER_CUP - 1) * 100, 2)).toBe(1.44);
    expect(roundTo((250 / ML_PER_CUP - 1) * 100, 2)).toBe(5.67);
    expect(roundTo((200 / ML_PER_CUP - 1) * 100, 2)).toBe(-15.46);
  });
});

describe('tool defaults and FAQ numbers', () => {
  it('cups to mL default: 1 US cup = 236.6 mL, 16 tbsp, 8 fl oz', () => {
    expect(formatMl(1 * ML_PER_CUP)).toBe('236.6');
    expect(mlToTbsp(1 * ML_PER_CUP)).toBe('16');
    expect(mlToFlOz(1 * ML_PER_CUP)).toBe('8');
    expect(formatMl(1 * 240)).toBe('240.0');
    expect(formatMl(1 * 250)).toBe('250.0');
  });
  it('mL to cups default: 250 mL US = 1.057 cups, 16.9 tbsp, 8.45 fl oz', () => {
    expect(trimDecimal(250 / ML_PER_CUP, 3)).toBe('1.057');
    expect(mlToTbsp(250)).toBe('16.9');
    expect(mlToFlOz(250)).toBe('8.45');
    expect(toKitchenMeasure(250 / ML_PER_CUP)).toBe('1 cup + 2 3/4 tsp');
  });
  it('FAQ: 100 mL = 6.8 tbsp; 250 mL = 16.9 tbsp (1 cup + ~1 tbsp)', () => {
    expect(mlToTbsp(100)).toBe('6.8');
    expect(roundTo(250 / ML_PER_CUP * 16 - 16, 1)).toBe(0.9); // 16.9 - 16
  });
  it('worked example wording matches the function at 0.8453', () => {
    expect(toKitchenMeasure(0.8453)).toBe('3/4 cup + 1 tbsp + 1 1/2 tsp');
  });
});
