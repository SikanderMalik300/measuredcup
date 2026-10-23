import { describe, it, expect } from 'vitest';
import {
  cupFractionLabel,
  cupFractionEquivalents,
  cupFractionByIngredient,
  cupsToFlOzRows,
  cupSizesInFlOz,
  ouncesPerCupByIngredient,
} from '@/lib/calc/tables';
import { tbspTspLabel } from '@/lib/calc/kitchen';
import { roundTo, gramsCell, trimDecimal } from '@/lib/calc/round';
import { G_PER_OZ, ML_PER_IMPERIAL_FL_OZ, ML_PER_FL_OZ } from '@/lib/data/constants';
import { getPage } from '@/lib/data/pages';

// ---- B1: /tablespoons-in-1-2-cup/ ----

// VERIFY table from the spec: [USDA, King Arthur, per tbsp], computed from ingredients.ts.
const HALF_CUP: Record<string, [string, string, string]> = {
  'All-purpose flour': ['62.5', '60.0', '7.8'],
  'Bread flour': ['68.5', '60.0', '8.6'],
  'Cake flour': ['68.5', '60.0', '8.6'],
  'Whole wheat flour': ['60.0', '-', '7.5'],
  'Granulated sugar': ['100', '99.0', '12.5'],
  'Brown sugar (packed)': ['110', '107', '13.8'],
  'Powdered sugar (unsifted)': ['60.0', '56.5', '7.5'],
  Butter: ['114', '113', '14.2'],
  Honey: ['170', '168', '21.2'],
  'Maple syrup': ['158', '156', '19.7'],
  'Whole milk': ['122', '114', '15.3'],
  Water: ['119', '-', '14.8'],
  'Vegetable oil': ['109', '99.0', '13.6'],
  'Heavy cream': ['119', '114', '14.9'],
  'Sour cream': ['115', '114', '14.4'],
  'Plain whole-milk yogurt': ['123', '-', '15.3'],
  'Unsweetened cocoa powder': ['43.0', '42.0', '5.4'],
  'Rolled oats': ['40.5', '44.5', '5.1'],
  'Long-grain white rice (uncooked)': ['92.5', '99.0', '11.6'],
  Cornstarch: ['64.0', '56.0', '8.0'],
  'Peanut butter': ['129', '135', '16.1'],
  'Semisweet chocolate chips': ['84.0', '85.0', '10.5'],
  'Table salt': ['146', '144', '18.3'],
};

describe('1/2 cup page (B1)', () => {
  it('tbspTspLabel(24) is "8 tbsp"', () => {
    expect(tbspTspLabel(24)).toBe('8 tbsp');
  });

  it('cupFractionLabel(1/2) is "1/2"', () => {
    expect(cupFractionLabel(1 / 2)).toBe('1/2');
  });

  it('grams per 1/2 cup and per tbsp match the VERIFY table for all 23 ingredients', () => {
    const rows = cupFractionByIngredient(1 / 2);
    expect(rows).toHaveLength(23);
    for (const r of rows) {
      const want = HALF_CUP[r.name];
      expect(want, `no expected row for ${r.name}`).toBeTruthy();
      expect([r.usda, r.ka, r.perTbsp], r.name).toEqual(want);
    }
  });

  it('1/2 cup equivalents table has the right rows', () => {
    const rows = cupFractionEquivalents(1 / 2);
    const map = Object.fromEntries(rows.map((r) => [r.label, r.value]));
    expect(map['Tablespoons']).toBe('8');
    expect(map['Teaspoons']).toBe('24');
    expect(map['Fluid ounces']).toBe('4');
    expect(map['Milliliters']).toBe('118.3');
    expect(map['Cups (decimal)']).toBe('0.5');
    expect(map['Half of 1/2 cup']).toBe('1/4 cup (4 tbsp)');
    expect(map['Double 1/2 cup']).toBe('1 cup (16 tbsp)');
    expect(map['Butter']).toBe('8 tbsp, 1 stick');
  });

  it('FAQ grams for flour and sugar match the data', () => {
    const faq = getPage('/tablespoons-in-1-2-cup/').faq!;
    const flour = faq.find((f) => f.q === 'How many grams is 1/2 cup of flour?')!;
    expect(flour.a).toContain('62.5 g');
    expect(flour.a).toContain('60 g');
    const sugar = faq.find((f) => f.q === 'How many grams is 1/2 cup of sugar?')!;
    expect(sugar.a).toContain('100 g');
    expect(sugar.a).toContain('110 g');
  });
});

// The other fraction pages must be unchanged by the 1/2 additions.
describe('existing fraction pages unchanged', () => {
  it('labels still resolve', () => {
    expect(cupFractionLabel(1 / 8)).toBe('1/8');
    expect(cupFractionLabel(1 / 4)).toBe('1/4');
    expect(cupFractionLabel(1 / 3)).toBe('1/3');
    expect(cupFractionLabel(2 / 3)).toBe('2/3');
  });
  it('butter equivalents rows are untouched', () => {
    const third = Object.fromEntries(cupFractionEquivalents(1 / 3).map((r) => [r.label, r.value]));
    expect(third['Butter']).toBe('5 tbsp + 1 tsp, about 2/3 of a stick');
    const twoThird = Object.fromEntries(cupFractionEquivalents(2 / 3).map((r) => [r.label, r.value]));
    expect(twoThird['Butter']).toBe('10 tbsp + 2 tsp, 1 1/3 sticks');
    const quarter = Object.fromEntries(cupFractionEquivalents(1 / 4).map((r) => [r.label, r.value]));
    expect(quarter['Butter']).toBe('1/2 stick');
  });
  it('1/8 cup grams for flour is unchanged', () => {
    const ap = cupFractionByIngredient(1 / 8).find((r) => r.name === 'All-purpose flour')!;
    expect(ap.usda).toBe('15.6');
  });
});

// ---- B2: /ounces-in-a-cup/ ----

// VERIFY: oz = g / 28.349523125, 2 dp.
const OZ_BY_CUP: Record<string, [string, string, string]> = {
  'All-purpose flour': ['125', '4.41', '4.23'],
  'Bread flour': ['137', '4.83', '4.23'],
  'Cake flour': ['137', '4.83', '4.23'],
  'Whole wheat flour': ['120', '4.23', '-'],
  'Granulated sugar': ['200', '7.05', '6.98'],
  'Brown sugar (packed)': ['220', '7.76', '7.51'],
  'Powdered sugar (unsifted)': ['120', '4.23', '3.99'],
  Butter: ['227', '8.01', '7.97'],
  Honey: ['339', '11.96', '11.85'],
  'Maple syrup': ['315', '11.11', '11.01'],
  'Whole milk': ['244', '8.61', '8.01'],
  Water: ['237', '8.36', '-'],
  'Vegetable oil': ['218', '7.69', '6.98'],
  'Heavy cream': ['238', '8.40', '8.01'],
  'Sour cream': ['230', '8.11', '8.01'],
  'Plain whole-milk yogurt': ['245', '8.64', '-'],
  'Unsweetened cocoa powder': ['86', '3.03', '2.96'],
  'Rolled oats': ['81', '2.86', '3.14'],
  'Long-grain white rice (uncooked)': ['185', '6.53', '6.98'],
  Cornstarch: ['128', '4.52', '3.95'],
  'Peanut butter': ['258', '9.10', '9.52'],
  'Semisweet chocolate chips': ['168', '5.93', '6.00'],
  'Table salt': ['292', '10.30', '10.16'],
};

describe('ounces in a cup page (B2)', () => {
  it('ounces per cup match the VERIFY table for all 23 ingredients', () => {
    const rows = ouncesPerCupByIngredient();
    expect(rows).toHaveLength(23);
    for (const r of rows) {
      const want = OZ_BY_CUP[r.name];
      expect(want, `no expected row for ${r.name}`).toBeTruthy();
      expect([r.grams, r.usdaOz, r.kaOz], r.name).toEqual(want);
    }
  });

  it('cup sizes table matches the spec (US and UK fl oz)', () => {
    expect(cupSizesInFlOz()).toEqual([
      { name: 'US customary cup', ml: '236.6', usFlOz: '8', ukFlOz: '8.33' },
      { name: 'US legal cup (nutrition labels)', ml: '240', usFlOz: '8.12', ukFlOz: '8.45' },
      { name: 'Metric cup', ml: '250', usFlOz: '8.45', ukFlOz: '8.8' },
      { name: 'Japanese cup', ml: '200', usFlOz: '6.76', ukFlOz: '7.04' },
    ]);
  });

  it('UK fl oz column is computed from ML_PER_IMPERIAL_FL_OZ', () => {
    expect(ML_PER_IMPERIAL_FL_OZ).toBe(28.4130625);
    const metric = cupSizesInFlOz().find((r) => r.name === 'Metric cup')!;
    expect(metric.ukFlOz).toBe(trimDecimal(250 / ML_PER_IMPERIAL_FL_OZ, 2));
    // The US column uses the US fluid ounce, so the two differ.
    expect(metric.usFlOz).toBe(trimDecimal(250 / ML_PER_FL_OZ, 2));
  });

  it('cups to fluid ounces chart matches the spec', () => {
    expect(cupsToFlOzRows()).toEqual([
      { cups: '1/8', flOz: '1', tbsp: '2', ml: '29.6' },
      { cups: '1/4', flOz: '2', tbsp: '4', ml: '59.1' },
      { cups: '1/3', flOz: '2.67', tbsp: '5 1/3', ml: '78.9' },
      { cups: '1/2', flOz: '4', tbsp: '8', ml: '118.3' },
      { cups: '2/3', flOz: '5.33', tbsp: '10 2/3', ml: '157.7' },
      { cups: '3/4', flOz: '6', tbsp: '12', ml: '177.4' },
      { cups: '1', flOz: '8', tbsp: '16', ml: '236.6' },
      { cups: '1 1/2', flOz: '12', tbsp: '24', ml: '354.9' },
      { cups: '2', flOz: '16', tbsp: '32', ml: '473.2' },
      { cups: '4', flOz: '32', tbsp: '64', ml: '946.4' },
    ]);
  });

  it('default tool outputs for 1 cup of all-purpose flour', () => {
    // Mirrors CupOuncesTool: fl oz = cups x 8; oz = grams per cup x cups / G_PER_OZ.
    const flOz = trimDecimal(1 * 8, 2);
    expect(flOz).toBe('8');
    expect(roundTo(125 / G_PER_OZ, 2).toFixed(2)).toBe('4.41'); // USDA
    expect(gramsCell(125)).toBe('125');
    expect(roundTo(120 / G_PER_OZ, 2).toFixed(2)).toBe('4.23'); // King Arthur
    expect(gramsCell(120)).toBe('120');
  });

  it('FAQ numbers match the data', () => {
    const faq = getPage('/ounces-in-a-cup/').faq!;
    const flour = faq.find((f) => f.q === 'How many ounces is a cup of flour?')!;
    expect(flour.a).toContain('4.41 oz (125 g)');
    expect(flour.a).toContain('4.23 oz (120 g)');
    const metric = faq.find((f) => f.q === 'How many fluid ounces is a metric cup?')!;
    expect(metric.a).toContain('8.45 US fluid ounces');
    expect(metric.a).toContain('8.8 UK imperial');
    // FAQ 6: 16 oz by weight to cups. 453.6 / 125 = 3.63, 453.6 / 200 = 2.27.
    const sixteen = faq.find((f) => f.q === 'How many cups is 16 ounces?')!;
    const gramsIn16oz = 16 * G_PER_OZ;
    expect(roundTo(gramsIn16oz / 125, 1)).toBe(3.6);
    expect(roundTo(gramsIn16oz / 200, 1)).toBe(2.3);
    expect(sixteen.a).toContain('about 3.6 cups');
    expect(sixteen.a).toContain('about 2.3 cups');
  });
});
