export class WalletUpdatedEvent {
    constructor(
      public readonly id: number,
      public readonly name: string,
      public readonly updatedAt: Date,
    ) {}
  }