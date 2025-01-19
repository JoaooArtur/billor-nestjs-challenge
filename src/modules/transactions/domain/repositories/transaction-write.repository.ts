import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionAggregate } from '../aggregates/transaction.aggregate';
import { BaseRepository } from '../../infrastructure/persistence/postgres/base/base.repository';

@Injectable()
export class TransactionWriteRepository extends BaseRepository<TransactionAggregate>{
  constructor(
    @InjectRepository(TransactionAggregate)
    private readonly transactionRepository: Repository<TransactionAggregate>,
  ) {
    super(transactionRepository);
  }
}