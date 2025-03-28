import { FocusLine } from '../interfaces/FocusLine';
import { SkuEntry } from '../interfaces/SkuEntry';
import { Account } from '../interfaces/Account';
import { skus } from './skus';
import { accounts } from './accounts';
import { getName } from './names';
import bigDecimal from 'js-big-decimal';

// Function to generate a **simple** random ResourceId
function generateResourceId(): string {
  return `resource-${Math.floor(Math.random() * 10000) + 1}`;
}

const unitMappings: Record<string, string> = {
  Compute: 'Hours',
  Storage: 'GB',
  Networking: 'GB',
  Databases: 'Hours',
  Integration: 'Requests',
  'Management and Governance': 'Operations',
};

const pricingUnitMappings: Record<string, string> = {
  Compute: 'vCPU-Hours',
  Storage: 'GB-Month',
  Networking: 'GB-Transferred',
  Databases: 'DB-Hours',
  Integration: 'Requests',
  'Management and Governance': 'Operations',
};

export const createSampleData = (year: number, month: number, day: number, numberOfRows: number): FocusLine[] => {
  // Ensure we always generate at least 100 rows
  numberOfRows = Math.max(numberOfRows, 100);

  const data: FocusLine[] = [];
  const hours = Array.from({ length: 24 }, (_, i) => i); // [0, 1, 2, ..., 23]

  // Determine how many rows per hour (spread evenly)
  const baseRowsPerHour = Math.floor(numberOfRows / 24);
  const extraRows = numberOfRows % 24; // Remainder rows to distribute

  for (let i = 0; i < 24; i++) {
    const rowsForThisHour = baseRowsPerHour + (i < extraRows ? 1 : 0); // Distribute remainder rows

    for (let j = 0; j < rowsForThisHour; j++) {
      data.push(createFocusLine(year, month, day, hours[i])); // Assign each entry an hour
    }
  }

  return data;
};

export function createFocusLine(year: number, month: number, day: number, hour: number): FocusLine {
  // 🎯 1️⃣ Get a random SKU
  const sku: SkuEntry = skus[Math.floor(Math.random() * skus.length)];

  // 🎯 2️⃣ Get a random Account
  const account: Account = accounts[Math.floor(Math.random() * accounts.length)];

  // 🎯 3️⃣ Select an Application (if available)
  const applications = account.tags.application ?? ['UnknownApp'];
  const application = applications[Math.floor(Math.random() * applications.length)];

  // 🎯 4️⃣ Generate a Realistic Usage Quantity
  const usageRanges: Record<string, [number, number]> = {
    Compute: [1, 1000],
    Storage: [10, 5000],
    Networking: [1, 100000],
    Databases: [1, 500],
  };
  const [min, max] = usageRanges[sku.ServiceCategory] ?? [1, 1000];
  const consumedQuantity = Math.floor(Math.random() * (max - min + 1)) + min;

  // 🎯 5️⃣ Calculate Costs
  const billedCost = bigDecimal.multiply(consumedQuantity, sku.ListUnitPrice);
  const effectiveCost = billedCost; // No discounts for now
  const listCost = billedCost; // Same as billed cost for now
  const contractedCost = 0; // Placeholder
  const contractedUnitPrice = 0; // Placeholder

  // 🎯 7️⃣ Generate Billing Periods
  const billingPeriodStart = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00:00`;
  const billingPeriodEnd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:59:59`;
  const chargePeriodStart = billingPeriodStart;
  const chargePeriodEnd = billingPeriodEnd;
  const chargeFrequency = 'Usage-Based';

  // 🎯 8️⃣ Construct Tags JSON
  const tags = JSON.stringify({
    application,
    environment: Math.random() > 0.5 ? 'prod' : 'staging',
    business_unit: 'FinanceDept',
  });

  const getRegion = (regions: { RegionId: string; RegionName: string }[]) => {
    return regions[Math.floor(Math.random() * regions.length)];
  };

  const getAvailabilityZone = (zones: string[]) => {
    if (zones.length === 0) return null;

    return zones[Math.floor(Math.random() * zones.length)];
  };

  // 🎯  Create the FocusLine Entry
  return {
    AvailabilityZone: getAvailabilityZone(sku.AvailabilityZones),
    BilledCost: billedCost,
    BillingAccountId: account.billingAccountId,
    BillingAccountName: account.billingAccountName,
    BillingCurrency: 'USD',
    BillingPeriodStart: billingPeriodStart,
    BillingPeriodEnd: billingPeriodEnd,
    ChargeCategory: sku.ChargeCategory,
    ChargeClass: sku.ChargeClass,
    ChargeDescription: sku.ChargeDescription,
    ChargeFrequency: chargeFrequency,
    ChargePeriodStart: chargePeriodStart,
    ChargePeriodEnd: chargePeriodEnd,
    CommitmentDiscountCategory: null,
    CommitmentDiscountId: null,
    CommitmentDiscountName: null,
    CommitmentDiscountStatus: null,
    CommitmentDiscountType: null,
    ConsumedQuantity: consumedQuantity,
    ConsumedUnit: unitMappings[sku.ServiceCategory] ?? 'Units', // Default to 'Units'
    ContractedCost: contractedCost,
    ContractedUnitPrice: contractedUnitPrice,
    EffectiveCost: effectiveCost,
    InvoiceIssuerName: sku.InvoiceIssuerName,
    ListCost: listCost,
    ListUnitPrice: sku.ListUnitPrice.toString(),
    PricingCategory: sku.PricingCategory,
    PricingQuantity: consumedQuantity,
    PricingUnit: pricingUnitMappings[sku.ServiceCategory] ?? 'Units', // Default to 'Units'
    ProviderName: sku.ProviderName,
    PublisherName: sku.PublisherName,
    RegionId: getRegion(sku.Regions).RegionId,
    RegionName: getRegion(sku.Regions).RegionName,
    ResourceId: generateResourceId(),
    ResourceName: getName(),
    ResourceType: sku.ResourceType,
    ServiceCategory: sku.ServiceCategory,
    Id: Math.floor(Math.random() * 1000000), // Unique ID for tracking
    ServiceName: sku.ServiceName,
    SkuId: sku.SkuId,
    SkuPriceId: sku.SkuPriceId,
    SubAccountId: account.subAccountId,
    SubAccountName: account.subAccountName,
    Tags: tags,
  };
}
