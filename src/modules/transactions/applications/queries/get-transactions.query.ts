export class GetTransactionsQuery {
  constructor(public readonly walletId: number, public readonly startDate: Date, public readonly endDate: Date) {}
  }