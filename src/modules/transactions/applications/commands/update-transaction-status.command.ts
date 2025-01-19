import { QueryRunner } from "typeorm";
import { TransactionStatus } from "../../domain/enumerations/transaction-status.enum";

export class UpdateTransactionStatusCommand {
    constructor(public readonly id: number, public readonly status: TransactionStatus, public readonly queryRunner: QueryRunner) {}
  }