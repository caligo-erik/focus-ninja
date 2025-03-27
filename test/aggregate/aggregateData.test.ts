import { aggregateData } from '../../src/aggregate/aggregateData';
import { createSampleData } from '../../src/sampleData/createSampleData';

describe('aggregate data tests', () => {
  let parsedData: any[];

  beforeAll(() => {
    parsedData = createSampleData(2024, 9, 15, 1000); // 🎯 Simulate 1K sample rows
  });

  test('aggregate data test aggregate yearly', () => {
    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'yearly',
    });

    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBe(1);

    aggregatedResult.forEach((row) => {
      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');
      expect(row).toHaveProperty('GroupKey'); // ✅ Ensure GroupKey exists
      expect(typeof row.GroupKey).toBe('string');
    });
  });

  test('aggregate data test aggregate hourly by ResourceName', () => {
    const aggregatedResult = aggregateData({
      data: parsedData,
      groupBy: ['ResourceName'],
    });

    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBeGreaterThan(1);

    aggregatedResult.forEach((row) => {
      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('month');
      expect(typeof row.month).toBe('number');
      expect(row).toHaveProperty('day');
      expect(typeof row.day).toBe('number');
      expect(row).toHaveProperty('hour');
      expect(typeof row.hour).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');
      expect(row).toHaveProperty('GroupKey'); // ✅ Ensure GroupKey exists
      expect(typeof row.GroupKey).toBe('string');
      expect(row).toHaveProperty('ResourceName'); // ✅ Ensure ResourceName exists
      expect(typeof row.ResourceName).toBe('string');
    });
  });

  test('aggregate data test aggregate monthly with CostCenter', () => {
    const groupByFields = ['CostCenter'];
    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'monthly',
      groupBy: groupByFields,
    });

    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBeGreaterThan(0);

    aggregatedResult.forEach((row) => {
      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('month');
      expect(typeof row.month).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');
      expect(row).toHaveProperty('GroupKey');
      expect(typeof row.GroupKey).toBe('string');

      // ✅ Ensure GroupKey can be split and matches `groupBy`
      const groupValues = row.GroupKey.split('\x1E');
      expect(groupValues.length).toBe(groupByFields.length + 3); // Includes year, month, and CostCenter
      // ✅ Validate the grouping key

      // Expected order: [year, month, CostCenter]
      expect(groupValues[0]).toBe(String(row.year));
      expect(groupValues[1]).toBe(String(row.month));
      expect(groupValues[2]).toBe(row.CostCenter);
    });
  });

  test('aggregate data test aggregate daily with ServiceCategory and CostCenter', () => {
    const groupByFields = ['ServiceCategory', 'CostCenter'];
    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'daily',
      groupBy: groupByFields,
    });

    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBeGreaterThan(1);

    aggregatedResult.forEach((row) => {
      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('month');
      expect(typeof row.month).toBe('number');
      expect(row).toHaveProperty('day');
      expect(typeof row.day).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');
      expect(row).toHaveProperty('GroupKey');
      expect(typeof row.GroupKey).toBe('string');

      // ✅ Ensure GroupKey can be split and matches `groupBy`
      const groupValues = row.GroupKey.split('\x1E');
      expect(groupValues.length).toBe(groupByFields.length + 3); // Includes year, month, day
    });
  });

  test('aggregateData should throw an error when neither interval nor groupBy is provided', () => {
    expect(() => {
      aggregateData({
        data: parsedData,
        interval: undefined,
        groupBy: [],
      });
    }).toThrow("Either 'interval' or 'groupBy' must be provided.");
  });
});
