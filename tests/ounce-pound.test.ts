import { describe, it, expect } from 'vitest';
import {
  flOzToTbspRows,
  tbspPerOunceRows,
  cupsPerPoundRows,
  poundsToCupsRows,
  bagSizeRows,
} from '@/lib/calc/tables';
import { trimDecimal, roundTo } from '@/lib/calc/round';
import { G_PER_OZ, G_PER_LB } from '@/lib/data/constants';
import { getPage } from '@/lib/data/pages';

// VERIFY: tablespoons per ounce by weight = cups per pound = 453.59237 / g per cup, 2 dp.
const PER16: Record<string, [string, string]> = {
  'All-purpose flour': ['3.63', '3.78'],
  'Bread flour': ['3.31', '3.78'],
  'Cake flour': ['3.31', '3.78'],
  'Whole wheat flour': ['3.78', '-'],
  'Granulated sugar': ['2.27', '2.29'],
  'Brown sugar (packed)': ['2.06', '2.13'],
  'Powdered sugar (unsifted)': ['3.78', '4.01'],
  Butter: ['2.00', '2.01'],
  Honey: ['1.34', '1.35'],
  'Maple syrup': ['1.44', '1.45'],
  'Whole milk': ['1.86', '2.00'],
  Water: ['1.91', '-'],
  'Vegetable oil': ['2.08', '2.29'],
  'Heavy cream': ['1.91', '2.00'],
  'Sour cream': ['1.97', '2.00'],
  'Plain whole-milk yogurt': ['1.85', '-'],
  'Unsweetened cocoa powder': ['5.27', '5.40'],
  'Rolled oats': ['5.60', '5.10'],
  'Long-grain white rice (uncooked)': ['2.45', '2.29'],
  Cornstarch: ['3.54', '4.05'],
  'Peanut butter': ['1.76', '1.68'],
  'Semisweet chocolate chips': ['2.70', '2.67'],
  'Table salt': ['1.55', '1.57'],
};

describe('tablespoons in an ounce (B1)', () => {
  it('fluid ounces to tablespoons chart matches the spec', () => {
    expect(flOzToTbspRows()).toEqual([
      { flOz: '1/2', tbsp: '1', tsp: '3', cups: '1/16', ml: '14.8' },
      { flOz: '1', tbsp: '2', tsp: '6', cups: '1/8', ml: '29.6' },
      { flOz: '2', tbsp: '4', tsp: '12', cups: '1/4', ml: '59.1' },
      { flOz: '3', tbsp: '6', tsp: '18', cups: '3/8', ml: '88.7' },
      { flOz: '4', tbsp: '8', tsp: '24', cups: '1/2', ml: '118.3' },
      { flOz: '6', tbsp: '12', tsp: '36', cups: '3/4', ml: '177.4' },
      { flOz: '8', tbsp: '16', tsp: '48', cups: '1', ml: '236.6' },
      { flOz: '16', tbsp: '32', tsp: '96', cups: '2', ml: '473.2' },
    ]);
  });

  it('tablespoons per ounce by weight matches the VERIFY table', () => {
    const rows = tbspPerOunceRows();
    expect(rows).toHaveLength(23);
    for (const r of rows) {
      expect([r.usda, r.ka], r.name).toEqual(PER16[r.name]);
    }
  });

  it('tool defaults, fluid and weight', () => {
    expect(trimDecimal(1 * 2, 2)).toBe('2'); // 1 fl oz = 2 tbsp
    expect(roundTo((1 * G_PER_OZ) / (125 / 16), 2).toFixed(2)).toBe('3.63'); // AP flour USDA
    expect(roundTo((1 * G_PER_OZ) / (120 / 16), 2).toFixed(2)).toBe('3.78'); // AP flour King Arthur
  });

  it('FAQ numbers match', () => {
    const faq = getPage('/tablespoons-in-an-ounce/').faq!;
    expect(faq[0].a).toContain('3.6 for flour and 2.3 for sugar');
    expect(faq[1].a).toContain('cocoa about 5.3');
    expect(faq[4].a).toContain('6 teaspoons');
  });
});

describe('cups in a pound (B2)', () => {
  it('cups per pound matches the VERIFY table', () => {
    const rows = cupsPerPoundRows();
    expect(rows).toHaveLength(23);
    for (const r of rows) {
      expect([r.usda, r.ka], r.name).toEqual(PER16[r.name]);
    }
  });

  it('pounds to cups chart matches the spec', () => {
    expect(poundsToCupsRows()).toEqual([
      { pounds: '1/4', cells: ['0.91', '0.57', '0.94', '0.50'] },
      { pounds: '1/2', cells: ['1.81', '1.13', '1.89', '1.00'] },
      { pounds: '1', cells: ['3.63', '2.27', '3.78', '2.00'] },
      { pounds: '2', cells: ['7.26', '4.54', '7.56', '4.00'] },
      { pounds: '5', cells: ['18.14', '11.34', '18.90', '9.99'] },
    ]);
  });

  it('common bag sizes match the spec', () => {
    expect(bagSizeRows()).toEqual([
      { label: '5 lb all-purpose flour', cups: '18.14' },
      { label: '4 lb granulated sugar', cups: '9.07' },
      { label: '2 lb packed brown sugar', cups: '4.12' },
      { label: '2 lb powdered sugar', cups: '7.56' },
      { label: '1 lb butter (4 sticks)', cups: '2.00' },
    ]);
  });

  it('tool defaults', () => {
    expect(roundTo((1 * G_PER_LB) / 125, 2).toFixed(2)).toBe('3.63'); // AP flour USDA
    expect(roundTo((1 * G_PER_LB) / 120, 2).toFixed(2)).toBe('3.78'); // AP flour King Arthur
  });

  it('FAQ numbers match', () => {
    const faq = getPage('/cups-in-a-pound/').faq!;
    expect(faq[1].a).toContain('3.78 cups (3 3/4)');
    expect(faq[2].a).toContain('3.63 cups');
    expect(faq[5].a).toContain('About 18 cups');
  });
});

describe('the 16:1 identity (B1 Table 2 == B2 Table 1)', () => {
  it('tablespoons per ounce equals cups per pound, row by row', () => {
    expect(tbspPerOunceRows()).toEqual(cupsPerPoundRows());
  });
});
