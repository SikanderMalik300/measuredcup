import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  tspToTbspRows,
  spoonWeightRows,
  tablespoonSizeRows,
  tspTbspResult,
  litersToCupsRows,
  cupsToLitersRows,
  cupsPerLiterBySize,
  literWeightRows,
  liquidVolumeConvert,
  formatMl,
} from '@/lib/calc/tables';
import { tbspTspLabel } from '@/lib/calc/kitchen';
import { trimDecimal } from '@/lib/calc/round';
import { getPage } from '@/lib/data/pages';

const ROOT = process.cwd();

// ---- B1: /teaspoons-in-a-tablespoon/ ----

describe('teaspoons in a tablespoon (B1)', () => {
  it('teaspoons to tablespoons chart matches the spec', () => {
    expect(tspToTbspRows()).toEqual([
      { tsp: '1', tbsp: '1/3', cups: '-', ml: '4.9' },
      { tsp: '1 1/2', tbsp: '1/2', cups: '-', ml: '7.4' },
      { tsp: '2', tbsp: '2/3', cups: '-', ml: '9.9' },
      { tsp: '3', tbsp: '1', cups: '1/16', ml: '14.8' },
      { tsp: '4', tbsp: '1 1/3', cups: '-', ml: '19.7' },
      { tsp: '6', tbsp: '2', cups: '1/8', ml: '29.6' },
      { tsp: '9', tbsp: '3', cups: '-', ml: '44.4' },
      { tsp: '12', tbsp: '4', cups: '1/4', ml: '59.1' },
      { tsp: '24', tbsp: '8', cups: '1/2', ml: '118.3' },
      { tsp: '48', tbsp: '16', cups: '1', ml: '236.6' },
    ]);
  });

  it('grams per teaspoon and tablespoon match the VERIFY table', () => {
    const want: Record<string, [string, string]> = {
      'All-purpose flour': ['2.6', '7.8'],
      'Bread flour': ['2.9', '8.6'],
      'Cake flour': ['2.9', '8.6'],
      'Whole wheat flour': ['2.5', '7.5'],
      'Granulated sugar': ['4.2', '12.5'],
      'Brown sugar (packed)': ['4.6', '13.8'],
      'Powdered sugar (unsifted)': ['2.5', '7.5'],
      Butter: ['4.7', '14.2'],
      Honey: ['7.1', '21.2'],
      'Maple syrup': ['6.6', '19.7'],
      'Whole milk': ['5.1', '15.3'],
      Water: ['4.9', '14.8'],
      'Vegetable oil': ['4.5', '13.6'],
      'Heavy cream': ['5.0', '14.9'],
      'Sour cream': ['4.8', '14.4'],
      'Plain whole-milk yogurt': ['5.1', '15.3'],
      'Unsweetened cocoa powder': ['1.8', '5.4'],
      'Rolled oats': ['1.7', '5.1'],
      'Long-grain white rice (uncooked)': ['3.9', '11.6'],
      Cornstarch: ['2.7', '8.0'],
      'Peanut butter': ['5.4', '16.1'],
      'Semisweet chocolate chips': ['3.5', '10.5'],
      'Table salt': ['6.1', '18.3'],
    };
    const rows = spoonWeightRows();
    expect(rows).toHaveLength(23);
    for (const r of rows) {
      expect([r.tsp, r.tbsp], r.name).toEqual(want[r.name]);
    }
  });

  it('tablespoon sizes table matches the spec', () => {
    expect(tablespoonSizeRows()).toEqual([
      { name: 'US tablespoon', ml: '14.8', tsp: '3' },
      { name: 'UK and metric tablespoon', ml: '15', tsp: '3' },
      { name: 'Australian tablespoon', ml: '20', tsp: '4' },
    ]);
  });

  it('default tool output, both directions', () => {
    const fromTbsp = tspTbspResult(1, 'tablespoons');
    expect(fromTbsp.tspBig).toBe('3');
    expect(fromTbsp.amountToken).toBe('1');
    expect(fromTbsp.cupsLabel).toBe('1/16');
    expect(fromTbsp.cupsWord).toBe('cup');
    expect(fromTbsp.flOzLabel).toBe('1/2');
    expect(fromTbsp.mlLabel).toBe('14.8');

    const fromTsp = tspTbspResult(3, 'teaspoons');
    expect(fromTsp.tbspBig).toBe('1');
    expect(fromTsp.spoonLabel).toBe('1 tbsp');
    expect(fromTsp.cupsLabel).toBe('1/16');

    const four = tspTbspResult(4, 'teaspoons');
    expect(four.tbspBig).toBe('1 1/3');
    expect(four.spoonLabel).toBe('1 tbsp + 1 tsp');
    expect(trimDecimal(four.tbsp, 3)).toBe('1.333');
  });

  it('tbspTspLabel for 4 and 5 teaspoons', () => {
    expect(tbspTspLabel(4)).toBe('1 tbsp + 1 tsp');
    expect(tbspTspLabel(5)).toBe('1 tbsp + 2 tsp');
  });

  it('FAQ numbers match', () => {
    const faq = getPage('/teaspoons-in-a-tablespoon/').faq!;
    expect(faq[0].a).toContain('3 teaspoons');
    expect(faq[1].a).toContain('6');
    expect(faq[4].a).toContain('1 1/3 tablespoons');
    const grams = faq.find((f) => f.q === 'How many grams is a teaspoon of sugar?')!;
    expect(grams.a).toContain('4.2 g');
    expect(grams.a).toContain('6.1 g');
    expect(grams.a).toContain('2.6 g');
  });
});

// ---- B2: /cups-in-a-liter/ ----

describe('cups in a liter (B2)', () => {
  it('liters to cups chart matches the spec', () => {
    expect(litersToCupsRows()).toEqual([
      { liters: '1/4', cups: '1.06', quarts: '0.26', flOz: '8.5' },
      { liters: '1/2', cups: '2.11', quarts: '0.53', flOz: '16.9' },
      { liters: '3/4', cups: '3.17', quarts: '0.79', flOz: '25.4' },
      { liters: '1', cups: '4.23', quarts: '1.06', flOz: '33.8' },
      { liters: '1 1/2', cups: '6.34', quarts: '1.59', flOz: '50.7' },
      { liters: '2', cups: '8.45', quarts: '2.11', flOz: '67.6' },
      { liters: '3', cups: '12.68', quarts: '3.17', flOz: '101.4' },
      { liters: '4', cups: '16.91', quarts: '4.23', flOz: '135.3' },
    ]);
  });

  it('cups to liters chart matches the spec', () => {
    expect(cupsToLitersRows()).toEqual([
      { cups: '1', ml: '236.6', liters: '0.237' },
      { cups: '2', ml: '473.2', liters: '0.473' },
      { cups: '3', ml: '709.8', liters: '0.71' },
      { cups: '4', ml: '946.4', liters: '0.946' },
      { cups: '6', ml: '1,420', liters: '1.42' },
      { cups: '8', ml: '1,893', liters: '1.893' },
      { cups: '10', ml: '2,366', liters: '2.366' },
      { cups: '16', ml: '3,785', liters: '3.785' },
    ]);
  });

  it('cups per liter by cup size matches the spec', () => {
    expect(cupsPerLiterBySize()).toEqual([
      { name: 'US customary cup', ml: '236.6', cupsPerLiter: '4.23' },
      { name: 'US legal cup', ml: '240', cupsPerLiter: '4.17' },
      { name: 'Metric cup', ml: '250', cupsPerLiter: '4' },
      { name: 'Japanese cup', ml: '200', cupsPerLiter: '5' },
    ]);
  });

  it('what a liter weighs matches the VERIFY table (pounds from unrounded grams)', () => {
    expect(literWeightRows()).toEqual([
      { name: 'Water', grams: '1,002', pounds: '2.21' },
      { name: 'Whole milk', grams: '1,031', pounds: '2.27' },
      { name: 'Heavy cream', grams: '1,006', pounds: '2.22' },
      { name: 'Vegetable oil', grams: '921', pounds: '2.03' },
      { name: 'Maple syrup', grams: '1,331', pounds: '2.94' },
      { name: 'Honey', grams: '1,433', pounds: '3.16' },
    ]);
  });

  it('default tool outputs for 1 liter', () => {
    const r = liquidVolumeConvert(1, 'liters');
    expect(trimDecimal(r.cups, 3)).toBe('4.227');
    expect(trimDecimal(r.gallons, 3)).toBe('0.264');
    expect(trimDecimal(r.quarts, 3)).toBe('1.057');
    expect(trimDecimal(r.pints, 3)).toBe('2.113');
    expect(trimDecimal(r.flOz, 2)).toBe('33.81');
    expect(trimDecimal(r.tbsp, 1)).toBe('67.6');
    expect(formatMl(r.ml)).toBe('1,000');
    expect(trimDecimal(r.liters, 2)).toBe('1');
  });

  it('FAQ numbers match', () => {
    const faq = getPage('/cups-in-a-liter/').faq!;
    expect(faq[0].a).toContain('4.23 US cups');
    expect(faq[2].a).toContain('8.45 US cups');
    const fourCups = faq.find((f) => f.q === 'How many liters is 4 cups?')!;
    expect(fourCups.a).toContain('0.946 liters (946 mL)');
  });
});

// ---- The existing liquid pages keep their defaults ----

describe('existing liquid pages unchanged', () => {
  const read = (slug: string) =>
    fs.readFileSync(path.join(ROOT, 'app/(site)', slug, 'page.tsx'), 'utf8');

  it('quart page still defaults to quarts', () => {
    expect(read('cups-in-a-quart')).toContain('<LiquidVolumeTool />');
  });
  it('gallon page still defaults to gallons', () => {
    expect(read('cups-in-a-gallon')).toContain('defaultUnit="gallons"');
  });
  it('pint page still defaults to pints', () => {
    expect(read('cups-in-a-pint')).toContain('defaultUnit="pints"');
  });
});
