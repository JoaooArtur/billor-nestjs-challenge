import { TransactionStatus } from "../enumerations/transaction-status.enum";
import { TransactionType } from "../enumerations/transaction-type.enum";

export class TransactionCreatedEvent {
    constructor(
      public readonly id: number,
      public readonly type: TransactionType,
      public readonly status: TransactionStatus,
      public readonly amount: number,
      public readonly category: string, 
      public readonly sourceWallet: number,
      public readonly targetWallet: number,
      public readonly userId: number,) {}
  }