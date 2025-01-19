export class WalletBalanceUpdatedEvent {
    constructor(
      public readonly id: number,
      public readonly balance: number,
      public readonly updatedAt: Date,
    ) {}
  }