import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CancelTransactionCommand } from '../Cancel-transaction.command';
import { TransactionWriteRepository } from 'src/modules/transactions/domain/repositories/transaction-write.repository';
import { TransactionStatus } from 'src/modules/transactions/domain/enumerations/transaction-status.enum';
import { TransactionStatusUpdatedEvent } from 'src/modules/transactions/domain/events/transaction-status-updated.event';
import { TransactionRefundedEvent } from 'src/modules/transactions/domain/events/transaction-refunded.event';


@CommandHandler(CancelTransactionCommand)
export class CancelTransactionHandler implements ICommandHandler<CancelTransactionCommand> {
  constructor(
    private readonly transactionWriteRepository: TransactionWriteRepository,
    @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: CancelTransactionCommand): Promise<void> {
    const transaction = await this.transactionWriteRepository.findOne({ where: { id: command.id } });
    if(transaction.status == TransactionStatus.COMPLETED)
    {
        this.client.emit('transaction_refunded', new TransactionRefundedEvent(transaction.id));
        return Promise.resolve();
    }

    transaction.status = TransactionStatus.CANCELED
    transaction.updatedAt = new Date()

    await this.transactionWriteRepository.update(command.id, { where: { id: command.id } }, transaction)

    this.client.emit('transaction_status_updated', new TransactionStatusUpdatedEvent(transaction.id, TransactionStatus.CANCELED));
  }
}