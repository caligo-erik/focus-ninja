export class SkuEntry {
  constructor(
    public SkuId: string,
    public SkuPriceId: string,
    public ServiceCategory: string,
    public ServiceName: string,
    public ResourceType: string,
    public ChargeCategory: string,
    public ChargeClass: string | null,
    public ChargeDescription: string,
    public ListCost: number,
    public ListUnitPrice: number,
    public PricingCategory: string,
    public CommitmentDiscountCategory: string | null,
    public InvoiceIssuerName: string,
    public ProviderName: string,
    public PublisherName: string,
    public Regions: { RegionId: string; RegionName: string }[],
    public AvailabilityZones: string[]
  ) {}
}
