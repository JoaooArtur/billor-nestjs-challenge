import { TransactionStatus } from "src/modules/transactions/domain/enumerations/transaction-status.enum";
import { TransactionType } from "src/modules/transactions/domain/enumerations/transaction-type.enum";

export class TransactionResponseDto {
    constructor(
        public readonly id: number,
        public readonly type: TransactionType,
        public readonly status: TransactionStatus,
        public readonly amount: number,
        public readonly category: string,
        public readonly sourceWalletId: number,
        public readonly targetWalletId: number,
        public readonly userId: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
      ){}
}