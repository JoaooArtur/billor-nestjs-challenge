import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionCommand } from '../create-transaction.command';
import { TransactionAggregate } from 'src/modules/transactions/domain/aggregates/transaction.aggregate';
import { TransactionWriteRepository } from 'src/modules/transactions/domain/repositories/transaction-write.repository';
import { TransactionCreatedEvent } from 'src/modules/transactions/domain/events/transaction-created.event';


@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(
    private readonly transactionWriteRepository: TransactionWriteRepository,
    @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<void> {
    const transactionAggregate = TransactionAggregate.create(
      command.type,
      command.amount,
      command.category,
      command.sourceWallet,
      command.targetWallet,
      command.userId)
    
    const transaction = await this.transactionWriteRepository.create(transactionAggregate);

    const event = new TransactionCreatedEvent(transaction.id,
        transaction.type,
        transaction.status,
        transaction.amount,
        transaction.category,
        transaction.sourceWallet,
        transaction.targetWallet,
        transaction.userId
    );
    
    this.client.emit('transaction_created', event);
  }
}