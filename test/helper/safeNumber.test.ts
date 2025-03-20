import { safeNumber } from '../../src/helper/safeNumber';

describe('safeNumber', () => {
  test('safeNumber should return 0 for non-numeric input', () => {
    expect(safeNumber(null)).toBe(0);
    expect(safeNumber(undefined)).toBe(0);
    expect(safeNumber('')).toBe(0);
    expect(safeNumber('abc')).toBe(0);
  });

  test('safeNumber should return the number for numeric or valid string input', () => {
    expect(safeNumber(123)).toBe(123);
    expect(safeNumber(-456)).toBe(-456);
    expect(safeNumber(789.0)).toBe(789);
    expect(safeNumber('10')).toBe(10);
  });
});
