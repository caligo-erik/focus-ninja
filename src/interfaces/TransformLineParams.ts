import { FocusLine } from './FocusLine';

export interface TransformLineParams {
  line: FocusLine;
  tagKeys: string[];
  fallbackValues?: Record<string, string>;
  columnsToRemove?: (keyof FocusLine)[];
}
