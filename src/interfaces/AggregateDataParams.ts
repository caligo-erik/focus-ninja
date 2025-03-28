import { FocusLine } from './FocusLine';

export interface AggregateDataParams {
  data: FocusLine[]; // ✅ The FOCUS dataset to aggregate
  interval?: 'daily' | 'monthly' | 'yearly'; // ✅ Optional time-based aggregation
  groupBy?: (keyof FocusLine | string)[]; // ✅ Optional fields to group by
  columnsToRemove?: (keyof FocusLine)[]; // ✅ Optional fields to remove before aggregation
  fallbackValues?: Record<string, string>; // ✅ Default values for missing groupBy columns
  round?: number; // ✅ Optional maximum number of decimal places for numeric values
}
