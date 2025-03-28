export interface FocusLine {
  AvailabilityZone: string | null;
  BilledCost: number | string;
  BillingAccountId: string;
  BillingAccountName: string;
  BillingCurrency: string;
  BillingPeriodEnd: string; // DateTime in string format
  BillingPeriodStart: string; // DateTime in string format
  ChargeCategory: string;
  ChargeClass: string | null;
  ChargeDescription: string;
  ChargeFrequency: string;
  ChargePeriodEnd: string; // DateTime in string format
  ChargePeriodStart: string; // DateTime in string format
  CommitmentDiscountCategory: string | null;
  CommitmentDiscountId: string | null;
  CommitmentDiscountName: string | null;
  CommitmentDiscountStatus: string | null;
  CommitmentDiscountType: string | null;
  ConsumedQuantity: number;
  ConsumedUnit: string;
  ContractedCost: number;
  ContractedUnitPrice: number;
  EffectiveCost: number | string;
  InvoiceIssuerName: string;
  ListCost: number | string;
  ListUnitPrice: string;
  PricingCategory: string;
  PricingQuantity: number;
  PricingUnit: string;
  ProviderName: string;
  PublisherName: string;
  RegionId: string;
  RegionName: string;
  ResourceId: string;
  ResourceName: string | null;
  ResourceType: string | null;
  ServiceCategory: string;
  Id: number;
  ServiceName: string;
  SkuId: string;
  SkuPriceId: string;
  SubAccountId: string;
  SubAccountName: string;
  Tags: string | null; // JSON-encoded tags
}
