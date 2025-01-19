import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetTransactionsQuery } from '../get-transactions.query';
import { TransactionResponseDto } from 'src/modules/transactions/interfaces/dto/transactions/transaction-response.dto';
import { TransactionsReadRepository } from 'src/modules/transactions/domain/repositories/transactions-read.repository';


@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler implements IQueryHandler<GetTransactionsQuery, TransactionResponseDto[]> {
  constructor(
    private readonly transactionReadRepository: TransactionsReadRepository,
    @Inject('TRANSACTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(query: GetTransactionsQuery): Promise<TransactionResponseDto[]> {
    const transactionProjections = await this.transactionReadRepository.getFiltered(query.walletId, query.startDate, query.endDate)
    return transactionProjections.map(
        transaction => new TransactionResponseDto(
          transaction._id,
          transaction.type,
          transaction.status,
          transaction.amount,
          transaction.category,
          transaction.sourceWallet,
          transaction.targetWallet,
          transaction.userId,
          transaction.createdAt,
          transaction.updatedAt,
        ),
      );
  }
}