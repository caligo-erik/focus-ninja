export class Account {
  constructor(
    public billingAccountId: string,
    public billingAccountName: string,
    public subAccountId: string,
    public subAccountName: string,
    public tags: Record<string, string[]> // JSON-like tag structure
  ) {}
}
