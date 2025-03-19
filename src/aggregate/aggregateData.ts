import { FocusLine } from '../interfaces/FocusLine';
import { AggregateDataParams } from '../interfaces/AggregateDataParams';
import { TransformedFocusLine, transformLine } from '../transform/transformLine';

type FocusColumn = keyof FocusLine;

export const safeNumber = (value: unknown | null | undefined): number => {
  const testValue = Number(value);
  return typeof testValue === 'number' && !isNaN(testValue) ? testValue : 0;
};

/**
 * Aggregates FinOps FOCUS data by time intervals (`yearly`, `monthly`, `daily`) and optional grouping.
 * Automatically extracts missing `groupBy` fields from `Tags`, ensuring complete data aggregation.
 *
 * ### **Example Usage**
 * ```typescript
 * const aggregated = aggregateData({
 *   data: focusDataset,
 *   interval: "monthly",
 *   groupBy: ["ServiceCategory", "CostCenter"],
 *   fallbackValues: { CostCenter: "Unassigned" }
 * });
 * ```
 *
 * ### **How It Works**
 * - **Groups data** based on the selected `groupBy` fields.
 * - **Aggregates cost and usage values (`BilledCost`, `EffectiveCost`, `ConsumedQuantity`)**.
 * - **Automatically extracts missing tag-based `groupBy` fields** from `Tags`, if applicable.
 * - **Uses fast, `O(1)` Map-based lookups** for efficient data aggregation.
 *
 * @param params - Configuration options for aggregation.
 * @param params.data - The input dataset as an array of FOCUS records.
 * @param params.interval - The time interval for aggregation (`'yearly'`, `'monthly'`, `'daily'`). Must be set if `groupBy` is empty.
 * @param params.groupBy - An array of columns to group the data by (e.g., `['ServiceName', 'CostCenter']`). Defaults to an empty array.
 * @param params.fallbackValues - A mapping of fallback values for missing group fields. Defaults to `{}`.
 *
 * @throws {Error} Throws an error if neither `interval` nor `groupBy` is provided.
 *
 * @returns An array of aggregated data objects, each representing a grouped summary.
 *          Includes computed totals (`TotalBilledCost`, `TotalEffectiveCost`, `TotalConsumedQuantity`) for each group.
 */

export function aggregateData(params: AggregateDataParams) {
  const { data, interval, groupBy = [], fallbackValues = {} } = params;

  if (!interval && groupBy.length === 0) {
    throw new Error("Either 'interval' or 'groupBy' must be provided.");
  }

  const availableFields = new Set<FocusColumn>(Object.keys(data[0]) as FocusColumn[]);
  const missingTags = groupBy.filter((col) => !availableFields.has(col as FocusColumn));

  const groupedData = new Map();

  for (let i = 0; i < data.length; i++) {
    const line = data[i];
    let transformedLine: TransformedFocusLine = { ...line };

    if (missingTags.length > 0) {
      transformedLine = transformLine({ line, tagKeys: missingTags, fallbackValues });
    }

    const date = new Date(line.BillingPeriodStart);
    const year = date.getUTCFullYear();
    const month = interval !== 'yearly' ? date.getUTCMonth() + 1 : null;
    const day = interval === 'daily' ? date.getUTCDate() : null;

    const groupValues = groupBy.map((col) => {
      return transformedLine[col as keyof TransformedFocusLine];
    });

    const key = [year, month, day, ...groupValues].join('\x1E');

    let group = groupedData.get(key);

    if (!group) {
      group = {
        year,
        month: interval === 'monthly' || interval === 'daily' ? month : undefined,
        day: interval === 'daily' ? day : undefined,
        ...Object.fromEntries(groupBy.map((col, index) => [col, groupValues[index]])),
        TotalBilledCost: 0,
        TotalEffectiveCost: 0,
        TotalConsumedQuantity: 0,
      };
      groupedData.set(key, group);
    }

    group.TotalBilledCost += safeNumber(transformedLine.BilledCost);
    group.TotalEffectiveCost += safeNumber(transformedLine.EffectiveCost);
    group.TotalConsumedQuantity += safeNumber(transformedLine.ConsumedQuantity);
  }

  return Array.from(groupedData.values());
}
