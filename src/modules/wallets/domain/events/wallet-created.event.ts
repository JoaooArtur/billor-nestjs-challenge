export class WalletCreatedEvent {
    constructor(
      public readonly id: number,
      public readonly name: string,
      public readonly balance: number,
      public readonly userId: number,
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
    ) {}
  }