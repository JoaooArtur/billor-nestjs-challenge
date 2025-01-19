import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { WalletAggregate } from '../aggregates/wallet.aggregate';
import { BaseRepository } from 'src/modules/users/infrastructure/persistence/postgres/base/base.repository';

@Injectable()
export class WalletsWriteRepository extends BaseRepository<WalletAggregate>{
  constructor(
    @InjectRepository(WalletAggregate)
    private readonly walletRepository: Repository<WalletAggregate>,
  ) {
    super(walletRepository);
  }
  
  async updateWithTransaction(
    id: number,
    balance: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.manager.update('wallets', { id }, { balance, updatedAt: new Date });
  }
}