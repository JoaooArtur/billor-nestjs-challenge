import { Inject, Injectable } from '@nestjs/common';
import { TransactionsReadRepository } from '../../domain/repositories/transactions-read.repository';
import { TransactionCreatedEvent } from '../../domain/events/transaction-created.event';
import { TransactionRefundedEvent } from '../../domain/events/transaction-refunded.event';
import { TransactionStatus } from '../../domain/enumerations/transaction-status.enum';
import { ClientProxy } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DataSource, QueryRunner } from 'typeorm';
import { UpdateWalletBalanceCommand } from 'src/modules/wallets/application/commands/update-wallet-balance.command';
import { TransactionType } from '../../domain/enumerations/transaction-type.enum';
import { TransactionStatusUpdatedEvent } from '../../domain/events/transaction-status-updated.event';
import { UpdateTransactionStatusCommand } from '../commands/update-transaction-status.command';

@Injectable()
export class TransactionEventsHandler {
  constructor(private readonly transactionReadRepository: TransactionsReadRepository,
  private readonly commandBus: CommandBus,
  private readonly dataSource: DataSource,
  @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async handleTransactionCreatedEvent(payload: TransactionCreatedEvent) {
    await this.transactionReadRepository.projectTransaction(payload.id, 
        payload.type,
        payload.status,
        payload.amount,
        payload.category, 
        payload.sourceWallet, 
        payload.targetWallet, 
        payload.userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      switch (payload.type) {
        case TransactionType.TRANSFER:
          await this.transferTransaction(payload.sourceWallet, payload.targetWallet, payload.amount, queryRunner);
        case TransactionType.EXPENSE:
          await this.commandBus.execute(new UpdateWalletBalanceCommand(payload.sourceWallet, payload.amount, TransactionType.EXPENSE, queryRunner));
        case TransactionType.INCOME:
          await this.commandBus.execute(new UpdateWalletBalanceCommand(payload.targetWallet, payload.amount, TransactionType.INCOME, queryRunner));
        default:
      }
      await this.commandBus.execute(new UpdateTransactionStatusCommand(payload.id, TransactionStatus.COMPLETED, queryRunner));

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.updateTransactionFailedStatus(payload.id);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }   

  private async updateTransactionFailedStatus(id: number){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.commandBus.execute(new UpdateTransactionStatusCommand(id, TransactionStatus.FAILED, queryRunner));

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async handleTransactionRefundedEvent(payload: TransactionRefundedEvent) {
    var projection = await this.transactionReadRepository.getTransactionById(payload.id);
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log(projection)
      switch (projection.type) {
        case TransactionType.TRANSFER:
          await this.refundTransferTransaction(projection.sourceWallet, projection.targetWallet, projection.amount, queryRunner);
        case TransactionType.EXPENSE:
          await this.commandBus.execute(new UpdateWalletBalanceCommand(projection.sourceWallet, projection.amount, TransactionType.INCOME, queryRunner));
        case TransactionType.INCOME:
          await this.commandBus.execute(new UpdateWalletBalanceCommand(projection.targetWallet, projection.amount, TransactionType.EXPENSE, queryRunner));
        default:
      }
      
      await this.commandBus.execute(new UpdateTransactionStatusCommand(payload.id, TransactionStatus.REFUNDED, queryRunner));
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async refundTransferTransaction(sourceWalletId: number, targetWalletId: number, amount: number, queryRunner: QueryRunner) {
    await this.commandBus.execute(new UpdateWalletBalanceCommand(targetWalletId, amount, TransactionType.EXPENSE, queryRunner));
    await this.commandBus.execute(new UpdateWalletBalanceCommand(sourceWalletId, amount, TransactionType.INCOME, queryRunner));
  }

  async transferTransaction(sourceWalletId: number, targetWalletId: number, amount: number, queryRunner: QueryRunner) {
    await this.commandBus.execute(new UpdateWalletBalanceCommand(sourceWalletId, amount, TransactionType.EXPENSE, queryRunner));
    await this.commandBus.execute(new UpdateWalletBalanceCommand(targetWalletId, amount, TransactionType.INCOME, queryRunner));
  }

  async handleTransactionStatusUpdatedEvent(payload: TransactionStatusUpdatedEvent) {
    await this.transactionReadRepository.updateTransactionStatus(payload.id, payload.status);
  }
}
