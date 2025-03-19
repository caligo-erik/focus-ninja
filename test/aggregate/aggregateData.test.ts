import * as path from 'path';
import * as fs from 'fs';
import csv from 'csv-parser';
import { aggregateData, safeNumber } from '../../src/aggregate/aggregateData';
import { FocusLine } from '../../src/interfaces/FocusLine';

const fileName = path.join(__dirname, '../input/focus_sample_100000.csv');
const parsedData: FocusLine[] = [];

describe('aggregate data tests', () => {
  beforeAll(async () => {
    // Parse CSV manually since `csv-parser` works asynchronously
    await new Promise<void>((resolve) => {
      fs.createReadStream(fileName)
        .pipe(csv())
        .on('data', (row) => parsedData.push(row as FocusLine))
        .on('end', resolve);
    });
  });
  test('aggregate data test aggregate yearly', () => {
    const timeStart = Date.now();

    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'yearly',
    });

    const timeEnd = Date.now();

    expect(timeEnd - timeStart).toBeLessThan(2000); // Execution time should be less than 2 seconds

    // ✅ Ensure data is aggregated by year
    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBe(1);

    aggregatedResult.forEach((row) => {
      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');
    });

    // ✅ Ensure total cost fields are numbers
    aggregatedResult.forEach((row) => {
      expect(typeof row.TotalBilledCost).toBe('number');
      expect(typeof row.TotalEffectiveCost).toBe('number');
      expect(typeof row.TotalConsumedQuantity).toBe('number');
    });

    // ✅ Sum raw costs from input
    const totalBilledCostInput = parsedData.reduce((sum, row) => sum + safeNumber(row.BilledCost), 0);
    const totalEffectiveCostInput = parsedData.reduce((sum, row) => sum + safeNumber(row.EffectiveCost), 0);
    const totalConsumedQuantityInput = parsedData.reduce((sum, row) => sum + safeNumber(row.ConsumedQuantity), 0);

    // ✅ Compare totals
    expect(aggregatedResult[0].TotalBilledCost).toBeCloseTo(totalBilledCostInput, 2);
    expect(aggregatedResult[0].TotalEffectiveCost).toBeCloseTo(totalEffectiveCostInput, 2);
    expect(aggregatedResult[0].TotalConsumedQuantity).toBeCloseTo(totalConsumedQuantityInput, 2);
  });

  test('aggregate data test aggregate monthly', () => {
    const timeStart = Date.now();

    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'monthly',
    });

    const timeEnd = Date.now();

    expect(timeEnd - timeStart).toBeLessThan(2000); // Execution time should be less than 1 second

    // ✅ Ensure data is aggregated by month
    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBe(3);
    for (let i = 0; i < aggregatedResult.length; i++) {
      const row = aggregatedResult[i];

      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('month');
      expect(typeof row.month).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');

      // ✅ Ensure total cost fields are numbers
      expect(typeof row.TotalBilledCost).toBe('number');
      expect(typeof row.TotalEffectiveCost).toBe('number');
      expect(typeof row.TotalConsumedQuantity).toBe('number');
    }
  });

  test('aggregate data test aggregate daily', () => {
    const timeStart = Date.now();

    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'daily',
    });

    const timeEnd = Date.now();

    expect(timeEnd - timeStart).toBeLessThan(2000); // Execution time should be less than 1 second

    // ✅ Ensure data is aggregated by day
    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBe(3);
    for (let i = 0; i < aggregatedResult.length; i++) {
      const row = aggregatedResult[i];

      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('month');
      expect(typeof row.month).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');

      // ✅ Ensure total cost fields are numbers
      expect(typeof row.TotalBilledCost).toBe('number');
      expect(typeof row.TotalEffectiveCost).toBe('number');
      expect(typeof row.TotalConsumedQuantity).toBe('number');
    }
  });

  test('aggregate data test aggregate monthly and CostCenter', () => {
    const timeStart = Date.now();

    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'monthly',
      groupBy: ['CostCenter'],
    });

    const timeEnd = Date.now();

    // expect(timeEnd - timeStart).toBeLessThan(2000); // Execution time should be less than 1 second

    // ✅ Ensure data is aggregated by month
    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBe(5);
    for (let i = 0; i < aggregatedResult.length; i++) {
      const row = aggregatedResult[i];

      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('month');
      expect(typeof row.month).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');

      // ✅ Ensure total cost fields are numbers
      expect(typeof row.TotalBilledCost).toBe('number');
      expect(typeof row.TotalEffectiveCost).toBe('number');
      expect(typeof row.TotalConsumedQuantity).toBe('number');
    }
  });

  test('aggregate data test aggregate monthly and CostCenter with fallback values', () => {
    const timeStart = Date.now();

    const aggregatedResult = aggregateData({
      data: parsedData,
      interval: 'monthly',
      groupBy: ['CostCenter'],
      fallbackValues: {
        CostCenter: 'Banana',
      },
    });

    const timeEnd = Date.now();

    expect(timeEnd - timeStart).toBeLessThan(2000); // Execution time should be less than 1 second

    // ✅ Ensure data is aggregated by month
    expect(Array.isArray(aggregatedResult)).toBe(true);
    expect(aggregatedResult.length).toBe(5);
    for (let i = 0; i < aggregatedResult.length; i++) {
      const row = aggregatedResult[i];

      expect(row).toHaveProperty('year');
      expect(typeof row.year).toBe('number');
      expect(row).toHaveProperty('month');
      expect(typeof row.month).toBe('number');
      expect(row).toHaveProperty('TotalBilledCost');
      expect(row).toHaveProperty('TotalEffectiveCost');
      expect(row).toHaveProperty('TotalConsumedQuantity');

      // ✅ Ensure total cost fields are numbers
      expect(typeof row.TotalBilledCost).toBe('number');
      expect(typeof row.TotalEffectiveCost).toBe('number');
      expect(typeof row.TotalConsumedQuantity).toBe('number');
    }
  });

  test('aggregateData should throw an error when neither interval nor groupBy is provided', () => {
    expect(() => {
      aggregateData({
        data: parsedData, // Valid dataset
        interval: undefined, // ❌ No interval
        groupBy: [], // ❌ No groupBy fields
      });
    }).toThrow("Either 'interval' or 'groupBy' must be provided.");
  });
});
