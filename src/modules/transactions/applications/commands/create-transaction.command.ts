import { TransactionType } from "../../domain/enumerations/transaction-type.enum";

export class CreateTransactionCommand {
    constructor(public readonly type: TransactionType, 
        public readonly amount: number,
        public readonly category: string, 
        public readonly sourceWallet: number,
        public readonly targetWallet: number,
        public readonly userId: number,) {}
  }