import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetTransactionQuery } from '../get-transaction.query';
import { TransactionResponseDto } from 'src/modules/transactions/interfaces/dto/transactions/transaction-response.dto';
import { TransactionsReadRepository } from 'src/modules/transactions/domain/repositories/transactions-read.repository';


@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery, TransactionResponseDto> {
  constructor(
    private readonly transactionReadRepository: TransactionsReadRepository,
    @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(query: GetTransactionQuery): Promise<TransactionResponseDto> {
    const transactionProjection = await this.transactionReadRepository.getTransactionById(query.id)

    return new TransactionResponseDto(
      transactionProjection._id,
      transactionProjection.type,
      transactionProjection.status,
      transactionProjection.amount,
      transactionProjection.category,
      transactionProjection.sourceWallet,
      transactionProjection.targetWallet,
      transactionProjection.userId,
      transactionProjection.createdAt,
      transactionProjection.updatedAt)
  }
}