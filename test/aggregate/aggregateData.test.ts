import bigDecimal from 'js-big-decimal';
import { aggregateData } from '../../src/aggregate/aggregateData';
import { createSampleData } from '../../src/sampleData/createSampleData';
import { FocusLine } from '../../src/interfaces/FocusLine';

const sumWithPrecision = (data: FocusLine[], field: keyof FocusLine): bigDecimal => {
  return data.reduce((acc, row) => {
    const val = new bigDecimal(row[field] as string);
    return acc.add(val);
  }, new bigDecimal(0));
};

describe('aggregate data tests', () => {
  let parsedData: any[];

  beforeAll(() => {
    parsedData = createSampleData(2024, 9, 15, 10000); // 🎯 Simulate 10K sample rows
  });

  test('aggregate data test aggregate yearly', () => {
    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'yearly',
    });

    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBe(1);

    const row = aggregatedResult[0];

    // ✅ Field existence checks
    expect(row).toHaveProperty('year');
    expect(typeof row.year).toBe('number');
    expect(row).toHaveProperty('TotalBilledCost');
    expect(row).toHaveProperty('TotalEffectiveCost');
    expect(row).toHaveProperty('TotalConsumedQuantity');
    expect(row).toHaveProperty('GroupKey');
    expect(typeof row.GroupKey).toBe('string');

    // ✅ Precision check using js-big-decimal
    const expectedBilled = sumWithPrecision(parsedData, 'BilledCost').getValue();
    const expectedEffective = sumWithPrecision(parsedData, 'EffectiveCost').getValue();
    const expectedConsumed = sumWithPrecision(parsedData, 'ConsumedQuantity').round().getValue();

    expect(row.TotalBilledCost).toBe(expectedBilled);
    expect(row.TotalEffectiveCost).toBe(expectedEffective);
    expect(row.TotalConsumedQuantity).toBe(expectedConsumed);
  });

  test('aggregate data test aggregate yearly with rounding to 10 decimal places', () => {
    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'yearly',
      round: 10, // ✅ Rounding enabled
    });

    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBe(1);

    const row = aggregatedResult[0];

    // ✅ Field existence checks
    expect(row).toHaveProperty('year');
    expect(typeof row.year).toBe('number');
    expect(row).toHaveProperty('TotalBilledCost');
    expect(row).toHaveProperty('TotalEffectiveCost');
    expect(row).toHaveProperty('TotalConsumedQuantity');
    expect(row).toHaveProperty('GroupKey');
    expect(typeof row.GroupKey).toBe('string');

    // ✅ Precision check using js-big-decimal with rounding
    const expectedBilled = sumWithPrecision(parsedData, 'BilledCost').round(10).getValue();
    const expectedEffective = sumWithPrecision(parsedData, 'EffectiveCost').round(10).getValue();
    const expectedConsumed = sumWithPrecision(parsedData, 'ConsumedQuantity').round().getValue();

    expect(row.TotalBilledCost).toBe(expectedBilled);
    expect(row.TotalEffectiveCost).toBe(expectedEffective);
    expect(row.TotalConsumedQuantity).toBe(expectedConsumed);
  });

  test('aggregate data test aggregate hourly by application', () => {
    const aggregatedResult = aggregateData({
      data: parsedData,
      groupBy: ['application'],
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
      expect(row).toHaveProperty('application'); // ✅ Ensure application exists
      expect(typeof row.application).toBe('string');
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
      expect(groupValues.length).toBe(groupByFields.length + 4); // Includes year, month, day, and CostCenter
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
      expect(groupValues.length).toBe(groupByFields.length + 4); // Includes year, month, day, and hour
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
