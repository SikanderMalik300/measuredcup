import { describe, it, expect } from 'vitest';
import { fewestScoops } from './kitchen';

describe('fewestScoops (section 1 table, input = tbsp x 3)', () => {
  const rows: [number, string][] = [
    [1, '1 tbsp'],
    [2, '1/8 cup'],
    [3, '1/8 cup + 1 tbsp'],
    [4, '1/4 cup'],
    [5, '1/4 cup + 1 tbsp'],
    [6, '1/4 cup + 2 tbsp'],
    [7, '1/4 cup + 3 tbsp'],
    [8, '1/2 cup'],
    [9, '1/2 cup + 1 tbsp'],
    [10, '1/2 cup + 2 tbsp'],
    [11, '2/3 cup + 1 tsp'],
    [12, '3/4 cup'],
    [13, '3/4 cup + 1 tbsp'],
    [14, '3/4 cup + 2 tbsp'],
    [15, '3/4 cup + 3 tbsp'],
    [16, '1 cup'],
    [20, '1 1/4 cups'],
    [24, '1 1/2 cups'],
    [32, '2 cups'],
  ];
  for (const [tbsp, expected] of rows) {
    it(`${tbsp} tbsp -> ${expected}`, () => {
      expect(fewestScoops(tbsp * 3)).toBe(expected);
    });
  }
});

describe('fewestScoops extra cases', () => {
  it('16 tsp (5 tbsp + 1 tsp) = 1/3 cup', () => {
    expect(fewestScoops(16)).toBe('1/3 cup');
  });
  it('1 tsp = 1 tsp', () => {
    expect(fewestScoops(1)).toBe('1 tsp');
  });
  it('2.5 tbsp (7.5 tsp) = 1/8 cup + 1 1/2 tsp', () => {
    expect(fewestScoops(7.5)).toBe('1/8 cup + 1 1/2 tsp');
  });
});
