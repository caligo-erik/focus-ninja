import { transformLine } from '../../src/transform/transformLine';
import { FocusLine } from '../../src/interfaces/FocusLine';

describe('transformLine', () => {
  let sampleLine: FocusLine;

  beforeEach(() => {
    sampleLine = {
      AvailabilityZone: null,
      BilledCost: 0.027,
      BillingAccountId: '1234567890123',
      BillingAccountName: 'SunBird',
      BillingCurrency: 'USD',
      BillingPeriodEnd: '2024-10-01 00:00:00',
      BillingPeriodStart: '2024-09-01 00:00:00',
      ChargeCategory: 'Usage',
      ChargeClass: null,
      ChargeDescription: '$0.027 per Application LoadBalancer-hour',
      ChargeFrequency: 'Usage-Based',
      ChargePeriodEnd: '2024-09-17 16:00:00',
      ChargePeriodStart: '2024-09-17 15:00:00',
      CommitmentDiscountCategory: null,
      CommitmentDiscountId: null,
      CommitmentDiscountName: null,
      CommitmentDiscountStatus: null,
      CommitmentDiscountType: null,
      ConsumedQuantity: 1,
      ConsumedUnit: 'Hours',
      ContractedCost: 0,
      ContractedUnitPrice: 0,
      EffectiveCost: 0,
      InvoiceIssuerName: 'Amazon Web Services, Inc.',
      ListCost: 0.027,
      ListUnitPrice: '0.027',
      PricingCategory: 'Standard',
      PricingQuantity: 1,
      PricingUnit: 'Hours',
      ProviderName: 'AWS',
      PublisherName: 'Amazon Web Services, Inc.',
      RegionId: 'eu-central-1',
      RegionName: 'EU (Frankfurt)',
      ResourceId: 'arn:aws:elasticloadbalancing:eu-central-1:561134494941:app/pieto-api/7b29febfbe87',
      ResourceName: null,
      ResourceType: null,
      ServiceCategory: 'Networking',
      Id: 128,
      ServiceName: 'Elastic Load Balancing',
      SkuId: 'UZQQFKE5Z4MCF9D5',
      SkuPriceId: 'UZQQFKE5Z4MCF9D5.JRTCKXETXF.6YS6EN2CT7',
      SubAccountId: '84445137922',
      SubAccountName: 'Pioneer Nimbus',
      Tags: '{"application": "DynamicGuideZone", "environment": "prod", "business_unit": "KnoxvilleEngineering"}',
    };
  });

  test('extracts tags and adds them as properties', () => {
    const transformed = transformLine({ line: sampleLine, tagKeys: ['application', 'environment'] });

    const { Tags, ...expectedLine } = sampleLine;
    expect(transformed).toMatchObject({
      ...expectedLine,
      application: 'DynamicGuideZone',
      environment: 'prod',
    });
  });

  test('throws an error when params is null or undefined', () => {
    expect(() => transformLine(null as unknown as any)).toThrow('Invalid input: params must be a non-null object');
    expect(() => transformLine(undefined as unknown as any)).toThrow('Invalid input: params must be a non-null object');
  });

  test('removes unwanted columns', () => {
    const transformed = transformLine({
      line: sampleLine,
      tagKeys: [],
      columnsToRemove: ['RegionName', 'SkuId'],
    });

    expect(transformed).not.toHaveProperty('RegionName');
    expect(transformed).not.toHaveProperty('SkuId');
  });

  test('extracts tags and removes unwanted columns', () => {
    const transformed = transformLine({
      line: sampleLine,
      tagKeys: ['business_unit'],
      columnsToRemove: ['RegionId'],
    });

    const { Tags, RegionId, ...expectedLine } = sampleLine;

    expect(transformed).toMatchObject({
      ...expectedLine,
      business_unit: 'KnoxvilleEngineering',
    });
    expect(transformed).not.toHaveProperty('RegionId');
  });

  test('returns empty string for missing tag keys if no fallback is provided', () => {
    sampleLine.Tags = '{"project": "FinOps"}';
    const transformed = transformLine({ line: sampleLine, tagKeys: ['project', 'environment'] });

    expect(transformed).toMatchObject({
      project: 'FinOps',
      environment: '', // Missing key should default to empty string
    });
  });

  test('applies fallback values for missing tags', () => {
    sampleLine.Tags = '{"project": "FinOps"}';
    const transformed = transformLine({
      line: sampleLine,
      tagKeys: ['project', 'environment'],
      fallbackValues: { environment: 'defaultEnv' },
    });

    expect(transformed).toMatchObject({
      project: 'FinOps',
      environment: 'defaultEnv',
    });
  });

  test('handles null, empty, or "NULL" Tags gracefully', () => {
    const nullCases = [null, '', 'NULL'];
    nullCases.forEach((nullTag) => {
      sampleLine.Tags = nullTag;
      const transformed = transformLine({
        line: sampleLine,
        tagKeys: ['application'],
        fallbackValues: { application: 'fallbackApp' },
      });

      // Create expected object by omitting Tags
      const { Tags, ...expectedLine } = sampleLine;

      expect(transformed).toMatchObject({
        ...expectedLine, // Keep all original properties except Tags
        application: 'fallbackApp', // Ensure the extracted tag is added
      });

      // Ensure Tags is removed
      expect(transformed).not.toHaveProperty('Tags');
    });
  });

  test('throws error for invalid input (non-object)', () => {
    expect(() => transformLine({ line: null as unknown as FocusLine, tagKeys: ['application'] })).toThrow();
    expect(() => transformLine({ line: undefined as unknown as FocusLine, tagKeys: ['application'] })).toThrow();
  });

  test('throws an error when Tags contains invalid JSON', () => {
    sampleLine.Tags = 'invalid json';
    expect(() =>
      transformLine({
        line: sampleLine,
        tagKeys: ['application'],
        fallbackValues: { application: 'fallbackApp' },
      })
    ).toThrow(SyntaxError); // Ensures it actually throws a parsing error
  });
});
