import { describe, it, expect } from 'vitest';
import {
  formatCupsForTable,
  gramAmountsInCups,
  cupFractionsInGrams,
  spoonGramsRows,
  BUTTER_ROWS,
  HALF_THIRD_ROWS,
  ingredientCsv,
} from './tables';

describe('formatCupsForTable', () => {
  it('rounds to the nearest 1/8 cup and uses tbsp under 1/4 cup', () => {
    expect(formatCupsForTable(0.4)).toBe('3/8 cup');
    expect(formatCupsForTable(0.8)).toBe('3/4 cup');
    expect(formatCupsForTable(1)).toBe('1 cup');
    expect(formatCupsForTable(1.6)).toBe('1 5/8 cups');
    expect(formatCupsForTable(0.1)).toBe('2 tbsp'); // under 1/4 cup -> tbsp
  });
});

describe('grams to cups table (USDA)', () => {
  it('every cell is present', () => {
    const rows = gramAmountsInCups();
    expect(rows).toHaveLength(6);
    for (const r of rows) expect(r.cells).toHaveLength(4);
  });
  it('known cells', () => {
    const rows = gramAmountsInCups();
    const byGrams = Object.fromEntries(rows.map((r) => [r.grams, r.cells]));
    // columns: ap-flour, sugar, brown-sugar, butter
    expect(byGrams[125][0]).toBe('1 cup'); // 125 g flour
    expect(byGrams[200][1]).toBe('1 cup'); // 200 g sugar
    expect(byGrams[50][1]).toBe('1/4 cup'); // 50 g sugar
    expect(byGrams[250][0]).toBe('2 cups'); // 250 g flour
  });
});

describe('cup fractions in grams table (USDA)', () => {
  it('known cells', () => {
    const rows = cupFractionsInGrams();
    const byLabel = Object.fromEntries(rows.map((r) => [r.label, r.cells]));
    // columns: ap-flour, sugar, brown-sugar, butter, milk, honey
    expect(byLabel['1'][0]).toBe('125'); // 1 cup flour
    expect(byLabel['3/4'][1]).toBe('150'); // 3/4 cup sugar
    expect(byLabel['2/3'][0]).toBe('83.3'); // 2/3 cup flour
    expect(byLabel['1'][5]).toBe('339'); // 1 cup honey
    expect(byLabel['1/2'][1]).toBe('100'); // 1/2 cup sugar
  });
});

describe('spoon grams table (USDA)', () => {
  it('has a row per ingredient with tbsp and tsp', () => {
    const rows = spoonGramsRows();
    expect(rows).toHaveLength(23);
    const butter = rows.find((r) => r.id === 'butter')!;
    expect(butter.tbsp).toBe('14.2');
    const honey = rows.find((r) => r.id === 'honey')!;
    expect(honey.tbsp).toBe('21.2');
  });
});

describe('static reference tables match the spec', () => {
  it('butter table has 9 rows with the expected grams column', () => {
    expect(BUTTER_ROWS).toHaveLength(9);
    expect(BUTTER_ROWS[0]).toMatchObject({ amount: '1 tbsp', grams: '14.2' });
    expect(BUTTER_ROWS[4]).toMatchObject({ amount: '1/2 cup', grams: '113' });
    expect(BUTTER_ROWS[8]).toMatchObject({ amount: '1 pound', grams: '454' });
  });
  it('halves and thirds table has 9 rows', () => {
    expect(HALF_THIRD_ROWS).toHaveLength(9);
    expect(HALF_THIRD_ROWS[1]).toMatchObject({ amount: '3/4 cup', half: '1/4 cup + 2 tbsp' });
  });
});

describe('ingredient CSV', () => {
  it('has a header and one row per ingredient', () => {
    const csv = ingredientCsv();
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(24);
    expect(lines[0]).toContain('usda_fdc_id');
  });
});
