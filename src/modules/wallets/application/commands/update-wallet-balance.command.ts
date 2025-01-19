import { TransactionType } from "src/modules/transactions/domain/enumerations/transaction-type.enum";
import { QueryRunner } from "typeorm";

export class UpdateWalletBalanceCommand {
    constructor(public readonly id: number, public readonly balance: number, public readonly type: TransactionType, public readonly queryRunner: QueryRunner) {}
  }