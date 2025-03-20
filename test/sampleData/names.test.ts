import { getName } from '../../src/sampleData/names';

describe('getName', () => {
  test('getName returns a unique name', () => {
    const namesMap = new Map<string, boolean>();

    for (let i = 0; i < 1000; i++) {
      const name = getName();
      expect(namesMap.has(name)).toBe(false);
      namesMap.set(name, true);
    }
  });
  test('getName returns names without empty spaces', () => {
    for (let i = 0; i < 1000; i++) {
      const name = getName();
      expect(name.includes(' ')).toBe(false);
    }
  });
});
