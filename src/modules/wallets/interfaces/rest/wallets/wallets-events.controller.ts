import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WalletCreatedEvent } from '../../../domain/events/Wallet-created.event';
import { WalletDeletedEvent } from '../../../domain/events/Wallet-deleted.event';
import { WalletUpdatedEvent } from '../../../domain/events/Wallet-updated.event';
import { WalletEventsHandler } from 'src/modules/wallets/application/events/wallet-events.handler';
import { WalletBalanceUpdatedEvent } from 'src/modules/wallets/domain/events/wallet-balance-updated.event';

@Controller()
export class WalletsEventsController {
  constructor(
    private readonly eventHandler: WalletEventsHandler) {}

  @EventPattern("wallet_created")
  async handleWalletCreated(@Payload() event:WalletCreatedEvent ) {
    return this.eventHandler.handleWalletCreatedEvent(event)
  }

  @EventPattern("wallet_updated")
  async handleWalletUpdated(@Payload() event:WalletUpdatedEvent ) {
    return this.eventHandler.handleWalletUpdatedEvent(event)
  }

  @EventPattern("wallet_balance_updated")
  async handleWalletBalanceUpdated(@Payload() event:WalletBalanceUpdatedEvent ) {
    return this.eventHandler.handleWalletBalanceUpdatedEvent(event)
  }

  @EventPattern("wallet_deleted")
  async handleWalletDeleted(@Payload() event:WalletDeletedEvent ) {
    return this.eventHandler.handleWalletDeletedEvent(event)
  }
}