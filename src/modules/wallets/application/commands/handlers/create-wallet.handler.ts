import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateWalletCommand } from '../create-wallet.command';
import { WalletsWriteRepository } from 'src/modules/wallets/domain/repositories/wallet-write.repository';
import { WalletAggregate } from 'src/modules/wallets/domain/aggregates/wallet.aggregate';
import { WalletCreatedEvent } from 'src/modules/wallets/domain/events/Wallet-created.event';


@CommandHandler(CreateWalletCommand)
export class CreateWalletHandler implements ICommandHandler<CreateWalletCommand> {
  constructor(
    private readonly walletsWriteRepository: WalletsWriteRepository,
    @Inject('WALLET_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: CreateWalletCommand): Promise<void> {
    const walletAggregate = WalletAggregate.create(command.name, command.userId)
    const wallet = await this.walletsWriteRepository.create(walletAggregate);
    
    const event = new WalletCreatedEvent(wallet.id, wallet.name, wallet.balance, wallet.userId, wallet.createdAt, wallet.updatedAt);
    this.client.emit('wallet_created', event);
  }
}