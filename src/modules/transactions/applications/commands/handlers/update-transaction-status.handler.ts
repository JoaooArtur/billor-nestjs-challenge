import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateTransactionStatusCommand } from '../update-transaction-status.command';
import { TransactionWriteRepository } from 'src/modules/transactions/domain/repositories/transaction-write.repository';
import { TransactionStatusUpdatedEvent } from 'src/modules/transactions/domain/events/transaction-status-updated.event';


@CommandHandler(UpdateTransactionStatusCommand)
export class UpdateTransactionStatusHandler implements ICommandHandler<UpdateTransactionStatusCommand> {
  constructor(
    private readonly transactionsWriteRepository: TransactionWriteRepository,
    @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: UpdateTransactionStatusCommand): Promise<void> {
    const transaction = await this.transactionsWriteRepository.findOne({ where: { id: command.id } });

    transaction.status = command.status
    transaction.updatedAt = new Date()

    await this.transactionsWriteRepository.update(command.id, { where: { id: command.id } }, transaction)

    const event = new TransactionStatusUpdatedEvent(transaction.id, transaction.status);

    this.client.emit('transaction_status_updated', event);
  }
}