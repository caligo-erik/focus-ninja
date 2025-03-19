import { extractTags } from '../../src/tags/tagExtractor';

describe('extractTags', () => {
  test('parses valid JSON and extracts requested tags', () => {
    const tagString = '{"project": "FinOps", "environment": "prod"}';
    const keys = ['project', 'environment', 'costCenter'];
    const fallbacks = { costCenter: 'defaultCostCenter' };

    expect(extractTags(tagString, keys, fallbacks)).toEqual({
      project: 'FinOps',
      environment: 'prod',
      costCenter: 'defaultCostCenter',
    });
  });

  test('returns fallbacks for missing keys', () => {
    const tagString = '{"project": "FinOps"}';
    const keys = ['project', 'environment', 'costCenter'];
    const fallbacks = { environment: 'staging', costCenter: 'defaultCostCenter' };

    expect(extractTags(tagString, keys, fallbacks)).toEqual({
      project: 'FinOps',
      environment: 'staging',
      costCenter: 'defaultCostCenter',
    });
  });

  test('returns empty string for missing keys if no fallback provided', () => {
    const tagString = '{"project": "FinOps"}';
    const keys = ['project', 'environment'];

    expect(extractTags(tagString, keys)).toEqual({
      project: 'FinOps',
      environment: '',
    });
  });

  test('handles null or empty tagValue', () => {
    const keys = ['project', 'environment'];
    const fallbacks = { project: 'defaultProject', environment: 'defaultEnv' };

    expect(extractTags(null, keys, fallbacks)).toEqual({
      project: 'defaultProject',
      environment: 'defaultEnv',
    });

    expect(extractTags('', keys, fallbacks)).toEqual({
      project: 'defaultProject',
      environment: 'defaultEnv',
    });

    expect(extractTags('NULL', keys, fallbacks)).toEqual({
      project: 'defaultProject',
      environment: 'defaultEnv',
    });
  });

  test('throws error if parsed JSON is not an object', () => {
    const keys = ['project'];
    const fallbacks = { project: 'defaultProject' };

    expect(() => extractTags('"banana"', keys, fallbacks)).toThrow('Invalid JSON format');
    expect(() => extractTags('42', keys, fallbacks)).toThrow('Invalid JSON format');
    expect(() => extractTags('[1,2,3]', keys, fallbacks)).toThrow('Invalid JSON format');
  });

  test('returns only fallback values when tagValue is an empty object', () => {
    const tagString = '{}';
    const keys = ['project', 'environment'];
    const fallbacks = { project: 'defaultProject', environment: 'defaultEnv' };

    expect(extractTags(tagString, keys, fallbacks)).toEqual({
      project: 'defaultProject',
      environment: 'defaultEnv',
    });
  });

  test('returns empty strings when tagValue is an empty object and no fallback values are provided', () => {
    const tagString = '{}';
    const keys = ['project', 'environment'];

    expect(extractTags(tagString, keys)).toEqual({
      project: '',
      environment: '',
    });
  });

  test('returns fallback values when tagValue is undefined', () => {
    const keys = ['project', 'environment'];
    const fallbacks = { project: 'defaultProject', environment: 'defaultEnv' };

    expect(extractTags(undefined, keys, fallbacks)).toEqual({
      project: 'defaultProject',
      environment: 'defaultEnv',
    });
  });

  test('uses empty string from fallbackValues when explicitly set', () => {
    const tagString = '{}';
    const keys = ['project', 'environment'];
    const fallbacks = { project: '', environment: 'defaultEnv' }; // Explicitly setting "" as a fallback

    expect(extractTags(tagString, keys, fallbacks)).toEqual({
      project: '', // Should remain an empty string, not be replaced with ''
      environment: 'defaultEnv',
    });
  });

  test('assigns empty string when fallbackValues does not contain the key', () => {
    const tagString = null; // This triggers the fallback path
    const keys = ['project', 'environment']; // Keys we expect
    const fallbacks = { environment: 'defaultEnv' }; // No fallback for "project"

    expect(extractTags(tagString, keys, fallbacks)).toEqual({
      project: '', // Explicitly tests that `acc[key] = ''` is hit
      environment: 'defaultEnv',
    });
  });
});
