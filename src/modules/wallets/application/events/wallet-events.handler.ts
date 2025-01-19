import { Injectable,Inject } from '@nestjs/common';
import { WalletCreatedEvent } from '../../domain/events/wallet-created.event';
import { WalletsReadRepository } from '../../domain/repositories/wallets-read.repository';
import { WalletUpdatedEvent } from '../../domain/events/Wallet-updated.event';
import { WalletBalanceUpdatedEvent } from '../../domain/events/wallet-balance-updated.event';
import { WalletDeletedEvent } from '../../domain/events/Wallet-deleted.event';

@Injectable()
export class WalletEventsHandler {
  constructor(private readonly walletReadRepository: WalletsReadRepository,
  ) {}

  async handleWalletCreatedEvent(payload: WalletCreatedEvent) {
    console.log(payload.id)
    console.log(payload.name)
    console.log(payload.userId)
    console.log(payload.balance)
    await this.walletReadRepository.projectWallet(payload.id, payload.name, payload.userId, payload.balance);
  }

  async handleWalletUpdatedEvent(payload: WalletUpdatedEvent) {
    await this.walletReadRepository.updateWallet(payload.id, payload.name);
  }

  async handleWalletBalanceUpdatedEvent(payload: WalletBalanceUpdatedEvent) {
    await this.walletReadRepository.updateWalletBalance(payload.id, payload.balance);
  }

  async handleWalletDeletedEvent(payload: WalletDeletedEvent) {
    await this.walletReadRepository.deleteWallet(payload.id);
  }
}
