import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionStatus } from '../enumerations/transaction-status.enum';
import { TransactionType } from '../enumerations/transaction-type.enum';
import { WalletAggregate } from 'src/modules/wallets/domain/aggregates/wallet.aggregate';
import { UserAggregate } from 'src/modules/users/domain/aggregates/user.aggregate';

@Entity('transactions')
export class TransactionAggregate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.INCOME,
  })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  category: string;

  @ManyToOne(() => WalletAggregate, { nullable: true })
  @JoinColumn({ name: 'source_wallet_id' })
  sourceWallet: number;

  @ManyToOne(() => WalletAggregate, { nullable: true })
  @JoinColumn({ name: 'target_wallet_id' })
  targetWallet: number;

  @ManyToOne(() => UserAggregate, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  userId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  static create(type: TransactionType, amount: number, category: string, sourceWallet: number, targetWallet: number, userId: number): TransactionAggregate {
    const wallet = new TransactionAggregate();
    wallet.type = type;
    wallet.amount = amount;
    wallet.category = category;
    wallet.status = TransactionStatus.PENDING;
    wallet.sourceWallet = sourceWallet;
    wallet.targetWallet = targetWallet;
    wallet.userId = userId;
    wallet.createdAt = new Date();
    return wallet;
  }
}
