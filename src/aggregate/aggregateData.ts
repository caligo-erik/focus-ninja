import { FocusLine } from '../interfaces/FocusLine';
import { AggregateDataParams } from '../interfaces/AggregateDataParams';
import { TransformedFocusLine, transformLine } from '../transform/transformLine';
import bigDecimal from 'js-big-decimal';

type FocusColumn = keyof FocusLine;

const getTimeGroupKeys = (interval: 'daily' | 'monthly' | 'yearly' | undefined): Map<string, boolean> => {
  const groupKeys = new Map<string, boolean>();
  groupKeys.set('year', true);

  switch (interval) {
    case 'yearly': {
      groupKeys.set('month', false);
      groupKeys.set('day', false);
      groupKeys.set('hour', false);
      break;
    }
    case 'monthly': {
      groupKeys.set('month', true);
      groupKeys.set('day', false);
      groupKeys.set('hour', false);
      break;
    }
    case 'daily': {
      groupKeys.set('month', true);
      groupKeys.set('day', true);
      groupKeys.set('hour', false);
      break;
    }
    default: {
      groupKeys.set('month', true);
      groupKeys.set('day', true);
      groupKeys.set('hour', true);
    }
  }
  return groupKeys;
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
  const { data, interval, groupBy = [], fallbackValues = {}, round = undefined } = params;

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
    const timeGroupKeys = getTimeGroupKeys(interval);
    // year is always defined, so it's always included in the grouping key.
    const year = date.getUTCFullYear();
    const month = timeGroupKeys.get('month') ? date.getUTCMonth() + 1 : undefined;
    const day = timeGroupKeys.get('day') ? date.getUTCDate() : undefined;
    const hour = timeGroupKeys.get('hour') ? date.getUTCHours() : undefined;

    const groupValues = groupBy.map((col) => {
      return transformedLine[col as keyof TransformedFocusLine];
    });

    const groupKey = [year, month, day, hour, ...groupValues].join('\x1E');
    const globalGroupKey = groupValues.join('\x1E');

    let group = groupedData.get(groupKey);

    if (!group) {
      group = {
        year,
        month,
        day,
        hour,
        ...Object.fromEntries(groupBy.map((col, index) => [col, groupValues[index]])),
        GroupKey: groupKey, // ✅ Add the grouping key
        GlobalGroupKey: globalGroupKey, // ✅ Add the global grouping key
        TotalBilledCost: new bigDecimal(0),
        TotalEffectiveCost: new bigDecimal(0),
        TotalConsumedQuantity: new bigDecimal(0),
      };
      groupedData.set(groupKey, group);
    }

    group.TotalBilledCost = group.TotalBilledCost.add(new bigDecimal(transformedLine.BilledCost));
    group.TotalEffectiveCost = group.TotalEffectiveCost.add(new bigDecimal(transformedLine.EffectiveCost));
    group.TotalConsumedQuantity = group.TotalConsumedQuantity.add(new bigDecimal(transformedLine.ConsumedQuantity));
  }

  return Array.from(groupedData.values()).map((group) => {
    const rounded = { ...group };

    if (round !== undefined) {
      rounded.TotalBilledCost = group.TotalBilledCost.round(round).getValue();
      rounded.TotalEffectiveCost = group.TotalEffectiveCost.round(round).getValue();
      rounded.TotalConsumedQuantity = group.TotalConsumedQuantity.round(round).getValue();
    } else {
      // Default: full precision
      rounded.TotalBilledCost = group.TotalBilledCost.getValue();
      rounded.TotalEffectiveCost = group.TotalEffectiveCost.getValue();
      rounded.TotalConsumedQuantity = group.TotalConsumedQuantity.getValue();
    }

    return rounded;
  });
}
