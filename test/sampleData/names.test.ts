import { getName } from '../../src/sampleData/names';

describe('getName', () => {
  test('getName returns varied names', () => {
    const names = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      names.add(getName());
    }
    expect(names.size).toBeGreaterThan(950); // Allow a small number of duplicates
  });
  test('getName returns names without empty spaces', () => {
    for (let i = 0; i < 1000; i++) {
      const name = getName();
      expect(name.includes(' ')).toBe(false);
    }
  });
});
