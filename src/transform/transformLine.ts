import { FocusLine } from '../interfaces/FocusLine';
import { TransformLineParams } from '../interfaces/TransformLineParams';
import { extractTags } from '../tags/tagExtractor';

export type TransformedFocusLine = Omit<FocusLine, 'Tags'> & {
  [key: string]: string | number | null;
};

/**
 * Transforms a single FinOps FOCUS data line:
 * - Extracts specified tags from the "Tags" field and adds them as properties.
 * - Removes unwanted columns from the object.
 *
 * @param {TransformLineParams} params - The parameters for transformation.
 * @param {FocusLine} params.line - The original FOCUS data line.
 * @param {string[]} params.tagKeys - The tag keys to extract from the "Tags" field.
 * @param {Record<string, string>} [params.fallbackValues] - (Optional) Fallback values for missing tags.
 * @param {Array<keyof FocusLine>} [params.columnsToRemove] - (Optional) The columns to remove from the output.
 *
 * @returns {TransformedFocusLine} A transformed FOCUS line with extracted tags and removed columns.
 *
 * @throws {Error} If `params` is not a valid object.
 */
export function transformLine(params: TransformLineParams): TransformedFocusLine {
  if (typeof params !== 'object' || params === null || params === undefined) {
    throw new Error('Invalid input: params must be a non-null object');
  }

  // Preserve all original properties except "Tags"
  const { Tags, ...baseLine } = params.line;

  // Extract tags (converted to string properties)
  const extractedTags = extractTags(Tags, params.tagKeys, params.fallbackValues);

  // Merge extracted tags with the base object
  const transformedLine: TransformedFocusLine = { ...baseLine, ...extractedTags };

  // Remove unwanted columns
  if (params.columnsToRemove) {
    for (const col of params.columnsToRemove) {
      delete transformedLine[col];
    }
  }
  return transformedLine;
}
