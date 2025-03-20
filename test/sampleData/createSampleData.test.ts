import { aggregateData } from '../../src/aggregate/aggregateData';
import { createSampleData } from '../../src/sampleData/createSampleData';

describe('createSampleData tests', () => {
  test('create 100 lines of sample data with correct billing periods and full-hour coverage', () => {
    const year = 2022;
    const month = 5;
    const day = 3;
    const sampleData = createSampleData(year, month, day, 100);

    expect(sampleData.length).toBe(100);

    const seenHours = new Set<number>();

    sampleData.forEach((entry) => {
      // ✅ Extract the hour from BillingPeriodStart
      const billingHour = new Date(entry.BillingPeriodStart).getUTCHours();
      seenHours.add(billingHour);

      // ✅ Ensure BillingPeriodStart follows the correct date format
      expect(entry.BillingPeriodStart).toMatch(new RegExp(`^${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} \\d{2}:00:00$`));

      // ✅ Ensure BillingPeriodEnd matches the expected format
      expect(entry.BillingPeriodEnd).toMatch(new RegExp(`^${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} \\d{2}:59:59$`));
    });

    // ✅ Ensure all 24 hours (0-23) are represented
    expect(seenHours.size).toBe(24);
  });

  test('create 10K lines of sample data with correct billing periods and full-hour coverage', () => {
    const year = 2022;
    const month = 5;
    const day = 3;
    const sampleData = createSampleData(year, month, day, 10000);

    expect(sampleData.length).toBe(10000);

    const seenHours = new Set<number>();

    sampleData.forEach((entry) => {
      // ✅ Extract the hour from BillingPeriodStart
      const billingHour = new Date(entry.BillingPeriodStart).getUTCHours();
      seenHours.add(billingHour);

      // ✅ Ensure BillingPeriodStart follows the correct date format
      expect(entry.BillingPeriodStart).toMatch(new RegExp(`^${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} \\d{2}:00:00$`));

      // ✅ Ensure BillingPeriodEnd matches the expected format
      expect(entry.BillingPeriodEnd).toMatch(new RegExp(`^${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} \\d{2}:59:59$`));
    });

    // ✅ Ensure all 24 hours (0-23) are represented
    expect(seenHours.size).toBe(24);
  });

  test('create sample data and aggregate it by CostCenter', () => {
    const year = 2022;
    const month = 5;
    const day = 3;
    const sampleData = createSampleData(year, month, day, 10000);

    const aggregated = aggregateData({
      data: sampleData,
      groupBy: ['CostCenter'],
    });

    expect(aggregated).not.toBeNull();
  });
});
