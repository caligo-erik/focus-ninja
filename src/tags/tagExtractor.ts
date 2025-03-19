/**
 * Extracts specified tag values from a JSON-encoded tag string.
 *
 * If `tagValue` is `null`, `undefined`, empty, or `"NULL"`, fallback values are used instead.
 * If `tagValue` is not valid JSON or does not resolve to an object, an error is thrown.
 *
 * @param tagValue - A JSON string containing tag key-value pairs, or `null`/`undefined` if no tags exist.
 * @param tagKeys - The list of tag keys to extract.
 * @param fallbackValues - Optional fallback values used when a tag key is missing. Defaults to `{}`.
 *
 * @returns A record containing the extracted tag values. If a key is missing in `tagValue`,
 *          the function returns its fallback value (or `""` if no fallback is provided).
 *
 * @throws {Error} If `tagValue` is not valid JSON or is not an object.
 */
export function extractTags(tagValue: string | null | undefined, tagKeys: string[], fallbackValues: Record<string, string> = {}): Record<string, string> {
  if (!tagValue || tagValue.trim() === '' || tagValue.trim().toUpperCase() === 'NULL') {
    return tagKeys.reduce((acc, key) => {
      if (fallbackValues[key]) {
        acc[key] = fallbackValues[key];
      } else {
        acc[key] = '';
      }
      return acc;
    }, {} as Record<string, string>);
  }

  const parsedTags: Record<string, string> = JSON.parse(tagValue);
  if (Array.isArray(parsedTags) || typeof parsedTags !== 'object' || parsedTags === null) {
    throw new Error('Invalid JSON format');
  }

  return tagKeys.reduce((acc, key) => {
    acc[key] = parsedTags[key] ?? fallbackValues[key] ?? '';
    return acc;
  }, {} as Record<string, string>);
}
