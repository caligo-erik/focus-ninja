# 🏷️ focus-ninja

**Functions to help manipulate FinOps FOCUS data**

- Extract structured **tag values** from JSON (`extractTags`).
- Transform FOCUS records by **adding extracted tags and removing unwanted columns** (`transformLine`).
- Aggregate FOCUS cost data **by time intervals (`daily`, `monthly`, `yearly`) and group by tags, SKUs, services, etc.** (`aggregateData`).
- Type-safe, sandbox-friendly, and **100% test covered**.

---

## 🚀 Installation

```sh
npm install focus-ninja
```

### 📌 Usage

Basic Examples

```typescript
import { aggregateData } from 'focus-ninja';

const aggregated = aggregateData({
  data: focusDataset, // Your parsed FOCUS dataset
  interval: 'yearly',
  groupBy: ['ServiceCategory'],
});

// Returns yearly aggregated cost data, grouped by ServiceCategory
```

```typescript
import { extractTags } from 'focus-ninja';

const tagString = '{"project": "FinOps", "environment": "prod"}';
const keys = ['project', 'environment', 'costCenter'];
const fallbacks = { costCenter: 'defaultCostCenter' };

const result = extractTags(tagString, keys, fallbacks);
console.log(result);
// Output: { project: "FinOps", environment: "prod", costCenter: "defaultCostCenter" }
```

```typescript
import { extractTags, transformLine, FocusLine } from 'focus-ninja';

const sampleLine = (sampleLine = {
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
});

const transformedLine = transformLine({
  line: sampleLine,
  tagKeys: ['application', 'environment'],
  fallbackValues: { application: 'fallbackApp' },
  columnsToRemove: ['RegionName', 'SkuId'],
});
// returns the sample line with new properties for application and environment, and removes the properties Tags, RegionName, SkuId
```
