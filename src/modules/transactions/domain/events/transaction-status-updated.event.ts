import { TransactionStatus } from "../enumerations/transaction-status.enum";

export class TransactionStatusUpdatedEvent {
    constructor(
      public readonly id: number,
      public readonly status: TransactionStatus) {}
  }