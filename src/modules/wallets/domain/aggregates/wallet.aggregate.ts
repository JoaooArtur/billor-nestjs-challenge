import { UserAggregate } from 'src/modules/users/domain/aggregates/user.aggregate';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('wallets')
export class WalletAggregate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => UserAggregate)
  @JoinColumn({ name: 'user_id' })
  userId: number;

  @Column()
  balance: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  static create(name: string, userId: number): WalletAggregate {
    const wallet = new WalletAggregate();
    wallet.name = name;
    wallet.userId = userId;
    wallet.balance = 0;
    wallet.createdAt = new Date();
    return wallet;
  }
}
