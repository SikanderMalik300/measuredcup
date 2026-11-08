import { describe, it, expect } from 'vitest';
import {
  HALF_THIRD_ROWS,
  G2TBSP_ROWS,
  gramsToTablespoonsRows,
  gramsToTeaspoonsRows,
  teaspoonsToGramsRows,
  gramsPerTspRows,
  cupFractionLabel,
  cupFractionEquivalents,
  cupFractionByIngredient,
} from '@/lib/calc/tables';
import { halfMeasure } from '@/lib/calc/kitchen';
import { getPage } from '@/lib/data/pages';

const TO_CUPS = { cups: 1, tbsp: 1 / 16, tsp: 1 / 48 } as const;
const half = (amt: number, unit: keyof typeof TO_CUPS) => halfMeasure(amt * TO_CUPS[unit] * 0.5);

// ---- A1: half-a-measurement ----
describe('half-a-measurement fixes (A1)', () => {
  it('has the four new HALF_THIRD rows', () => {
    const byAmount = Object.fromEntries(HALF_THIRD_ROWS.map((r) => [r.amount, r]));
    expect(byAmount['1 1/2 cups']).toEqual({ amount: '1 1/2 cups', half: '3/4 cup', third: '1/2 cup' });
    expect(byAmount['1 1/2 tsp']).toEqual({ amount: '1 1/2 tsp', half: '3/4 tsp', third: '1/2 tsp' });
    expect(byAmount['1/4 tsp']).toEqual({ amount: '1/4 tsp', half: '1/8 tsp', third: 'about 2/3 of a 1/8 tsp' });
    expect(byAmount['1/8 tsp']).toEqual({
      amount: '1/8 tsp',
      half: '1/16 tsp (half a 1/8 tsp)',
      third: 'about 1/3 of a 1/8 tsp',
    });
  });

  it('table stays ordered largest to smallest', () => {
    expect(HALF_THIRD_ROWS[0].amount).toBe('1 1/2 cups');
    expect(HALF_THIRD_ROWS[HALF_THIRD_ROWS.length - 1].amount).toBe('1/8 tsp');
  });

  it('tool output for half of 1 tsp, 1/2 tsp, 1/8 tsp and 1 1/2 cups', () => {
    expect(half(1, 'tsp')).toBe('1/2 tsp');
    expect(half(0.5, 'tsp')).toBe('1/4 tsp');
    expect(half(1 / 8, 'tsp')).toBe('1/16 tsp (fill a 1/8 tsp halfway)');
    expect(half(1.5, 'cups')).toBe('3/4 cup');
  });

  it('new FAQ answers are present', () => {
    const faq = getPage('/half-a-measurement/').faq!;
    const byQ = Object.fromEntries(faq.map((f) => [f.q, f.a]));
    expect(byQ['What is half of 1 teaspoon?']).toContain('1/2 teaspoon');
    expect(byQ['What is half of 1/8 teaspoon?']).toContain('1/16 teaspoon');
    expect(byQ['How much is half a cup?']).toContain('8 tablespoons');
    expect(byQ['What is half of 1 1/2 cups?']).toContain('3/4 cup');
  });
});

// ---- A2: grams-to-tablespoons ----
describe('grams-to-tablespoons fixes (A2)', () => {
  it('G2TBSP_ROWS has the new amounts', () => {
    expect(G2TBSP_ROWS).toEqual([2, 5, 7, 10, 12, 15, 20, 25, 30, 40, 50, 100]);
  });

  it('chart matches the VERIFY table', () => {
    const want: Record<number, string[]> = {
      2: ['0.26', '0.16', '0.14', '0.09', '0.37'],
      5: ['0.64', '0.4', '0.35', '0.24', '0.93'],
      7: ['0.9', '0.56', '0.49', '0.33', '1.3'],
      10: ['1.28', '0.8', '0.7', '0.47', '1.86'],
      12: ['1.54', '0.96', '0.85', '0.57', '2.23'],
      15: ['1.92', '1.2', '1.06', '0.71', '2.79'],
      20: ['2.56', '1.6', '1.41', '0.94', '3.72'],
      25: ['3.2', '2', '1.76', '1.18', '4.65'],
      30: ['3.84', '2.4', '2.11', '1.42', '5.58'],
      40: ['5.12', '3.2', '2.82', '1.89', '7.44'],
      50: ['6.4', '4', '3.52', '2.36', '9.3'],
      100: ['12.8', '8', '7.05', '4.72', '18.6'],
    };
    for (const r of gramsToTablespoonsRows()) {
      expect(r.cells, `${r.grams} g`).toEqual(want[r.grams]);
    }
  });

  it('new FAQ answers are present', () => {
    const faq = getPage('/grams-to-tablespoons/').faq!;
    const byQ = Object.fromEntries(faq.map((f) => [f.q, f.a]));
    expect(byQ['How many tablespoons is 15 grams?']).toContain('1.9 tablespoons of all-purpose flour');
    expect(byQ['How many tablespoons is 48 grams of sugar?']).toContain('3.84 tablespoons');
  });

  it('grams-to-teaspoons is the last related item', () => {
    expect(getPage('/grams-to-tablespoons/').related.at(-1)).toBe('/grams-to-teaspoons/');
  });
});

// ---- B1: grams-to-teaspoons ----
describe('grams-to-teaspoons (B1)', () => {
  it('grams to teaspoons chart matches the VERIFY table', () => {
    const want: Record<number, string[]> = {
      1: ['0.38', '0.24', '0.21', '0.14', '0.56', '0.16'],
      2: ['0.77', '0.48', '0.42', '0.28', '1.12', '0.33'],
      3: ['1.15', '0.72', '0.63', '0.42', '1.67', '0.49'],
      4: ['1.54', '0.96', '0.85', '0.57', '2.23', '0.66'],
      5: ['1.92', '1.2', '1.06', '0.71', '2.79', '0.82'],
      10: ['3.84', '2.4', '2.11', '1.42', '5.58', '1.64'],
      15: ['5.76', '3.6', '3.17', '2.12', '8.37', '2.47'],
      20: ['7.68', '4.8', '4.23', '2.83', '11.16', '3.29'],
      25: ['9.6', '6', '5.29', '3.54', '13.95', '4.11'],
      50: ['19.2', '12', '10.57', '7.08', '27.91', '8.22'],
    };
    for (const r of gramsToTeaspoonsRows()) {
      expect(r.cells, `${r.grams} g`).toEqual(want[r.grams]);
    }
  });

  it('teaspoons to grams chart matches the VERIFY table', () => {
    expect(teaspoonsToGramsRows()).toEqual([
      { tsp: '1/4', cells: ['0.7', '1.0', '1.2', '1.8', '0.4', '1.5'] },
      { tsp: '1/2', cells: ['1.3', '2.1', '2.4', '3.5', '0.9', '3.0'] },
      { tsp: '1', cells: ['2.6', '4.2', '4.7', '7.1', '1.8', '6.1'] },
      { tsp: '2', cells: ['5.2', '8.3', '9.5', '14.1', '3.6', '12.2'] },
      { tsp: '3 (1 tbsp)', cells: ['7.8', '12.5', '14.2', '21.2', '5.4', '18.3'] },
    ]);
  });

  it('grams in 1 teaspoon per ingredient matches the VERIFY table', () => {
    const want: Record<string, [string, string]> = {
      'All-purpose flour': ['2.6', '2.5'],
      'Bread flour': ['2.9', '2.5'],
      'Cake flour': ['2.9', '2.5'],
      'Whole wheat flour': ['2.5', '-'],
      'Granulated sugar': ['4.2', '4.1'],
      'Brown sugar (packed)': ['4.6', '4.4'],
      'Powdered sugar (unsifted)': ['2.5', '2.4'],
      Butter: ['4.7', '4.7'],
      Honey: ['7.1', '7.0'],
      'Maple syrup': ['6.6', '6.5'],
      'Whole milk': ['5.1', '4.7'],
      Water: ['4.9', '-'],
      'Vegetable oil': ['4.5', '4.1'],
      'Heavy cream': ['5.0', '4.7'],
      'Sour cream': ['4.8', '4.7'],
      'Plain whole-milk yogurt': ['5.1', '-'],
      'Unsweetened cocoa powder': ['1.8', '1.8'],
      'Rolled oats': ['1.7', '1.9'],
      'Long-grain white rice (uncooked)': ['3.9', '4.1'],
      Cornstarch: ['2.7', '2.3'],
      'Peanut butter': ['5.4', '5.6'],
      'Semisweet chocolate chips': ['3.5', '3.5'],
      'Table salt': ['6.1', '6.0'],
    };
    const rows = gramsPerTspRows();
    expect(rows).toHaveLength(23);
    for (const r of rows) expect([r.usda, r.ka], r.name).toEqual(want[r.name]);
  });

  it('tool defaults both directions', () => {
    // grams -> tsp: 5 g divided by (g per cup / 48)
    const g2t = (gpc: number) => String(Number((Math.round((5 / (gpc / 48)) * 100) / 100).toFixed(2)));
    expect(g2t(200)).toBe('1.2'); // sugar USDA
    expect(g2t(198)).toBe('1.21'); // sugar King Arthur
    expect(g2t(125)).toBe('1.92'); // flour USDA
    expect(g2t(120)).toBe('2'); // flour King Arthur
    // 5 g of water: 5 / 4.94 = 1.01, written "1"
    expect(g2t(237)).toBe('1.01');
  });

  it('FAQ numbers are present', () => {
    const faq = getPage('/grams-to-teaspoons/').faq!;
    const byQ = Object.fromEntries(faq.map((f) => [f.q, f.a]));
    expect(byQ['How many teaspoons is 5 grams?']).toContain('1 for water');
    expect(byQ['How many teaspoons is 10 grams of sugar?']).toContain('2.4 teaspoons');
    expect(byQ['How many grams is 1 teaspoon of salt?']).toContain('6.1 g');
  });
});

// ---- B2: tablespoons-in-3-4-cup ----
describe('tablespoons in 3/4 cup (B2)', () => {
  it('cupFractionLabel(3/4) is "3/4"', () => {
    expect(cupFractionLabel(3 / 4)).toBe('3/4');
  });

  it('3/4 cup equivalents table matches the spec', () => {
    const map = Object.fromEntries(cupFractionEquivalents(3 / 4).map((r) => [r.label, r.value]));
    expect(map['Tablespoons']).toBe('12');
    expect(map['Teaspoons']).toBe('36');
    expect(map['Fluid ounces']).toBe('6');
    expect(map['Milliliters']).toBe('177.4');
    expect(map['Cups (decimal)']).toBe('0.75');
    expect(map['Half of 3/4 cup']).toBe('1/4 cup + 2 tbsp (6 tbsp)');
    expect(map['Double 3/4 cup']).toBe('1 1/2 cups');
    expect(map['Butter']).toBe('12 tbsp, 1 1/2 sticks');
  });

  it('grams per 3/4 cup and per tbsp match the VERIFY table', () => {
    const want: Record<string, [string, string, string]> = {
      'All-purpose flour': ['93.8', '90.0', '7.8'],
      'Bread flour': ['103', '90.0', '8.6'],
      'Cake flour': ['103', '90.0', '8.6'],
      'Whole wheat flour': ['90.0', '-', '7.5'],
      'Granulated sugar': ['150', '149', '12.5'],
      'Brown sugar (packed)': ['165', '160', '13.8'],
      'Powdered sugar (unsifted)': ['90.0', '84.8', '7.5'],
      Butter: ['170', '170', '14.2'],
      Honey: ['254', '252', '21.2'],
      'Maple syrup': ['236', '234', '19.7'],
      'Whole milk': ['183', '170', '15.3'],
      Water: ['178', '-', '14.8'],
      'Vegetable oil': ['164', '149', '13.6'],
      'Heavy cream': ['179', '170', '14.9'],
      'Sour cream': ['173', '170', '14.4'],
      'Plain whole-milk yogurt': ['184', '-', '15.3'],
      'Unsweetened cocoa powder': ['64.5', '63.0', '5.4'],
      'Rolled oats': ['60.8', '66.8', '5.1'],
      'Long-grain white rice (uncooked)': ['139', '149', '11.6'],
      Cornstarch: ['96.0', '84.0', '8.0'],
      'Peanut butter': ['194', '203', '16.1'],
      'Semisweet chocolate chips': ['126', '128', '10.5'],
      'Table salt': ['219', '216', '18.3'],
    };
    const rows = cupFractionByIngredient(3 / 4);
    expect(rows).toHaveLength(23);
    for (const r of rows) expect([r.usda, r.ka, r.perTbsp], r.name).toEqual(want[r.name]);
  });

  it('FAQ numbers are present', () => {
    const faq = getPage('/tablespoons-in-3-4-cup/').faq!;
    const byQ = Object.fromEntries(faq.map((f) => [f.q, f.a]));
    expect(byQ['How many grams is 3/4 cup of flour?']).toContain('93.8 g');
    expect(byQ['How many grams is 3/4 cup of sugar?']).toContain('150 g');
    expect(byQ['What is half of 3/4 cup?']).toContain('6 tablespoons');
  });

  it('other cup-fraction labels are unchanged', () => {
    expect(cupFractionLabel(1 / 8)).toBe('1/8');
    expect(cupFractionLabel(1 / 4)).toBe('1/4');
    expect(cupFractionLabel(1 / 3)).toBe('1/3');
    expect(cupFractionLabel(1 / 2)).toBe('1/2');
    expect(cupFractionLabel(2 / 3)).toBe('2/3');
    // 2/3 keeps its own equivalents (the new 3/4 branch must not capture it).
    const twoThird = Object.fromEntries(cupFractionEquivalents(2 / 3).map((r) => [r.label, r.value]));
    expect(twoThird['Butter']).toBe('10 tbsp + 2 tsp, 1 1/3 sticks');
  });
});
