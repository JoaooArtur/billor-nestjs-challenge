import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateWalletCommand } from '../update-wallet.command';
import { WalletsWriteRepository } from 'src/modules/wallets/domain/repositories/wallet-write.repository';
import { WalletUpdatedEvent } from 'src/modules/wallets/domain/events/Wallet-updated.event';


@CommandHandler(UpdateWalletCommand)
export class UpdateWalletHandler implements ICommandHandler<UpdateWalletCommand> {
  constructor(
    private readonly WalletWriteRepository: WalletsWriteRepository,
    @Inject('WALLET_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: UpdateWalletCommand): Promise<void> {
    const wallet = await this.WalletWriteRepository.findOne({ where: { id: command.id } });

    wallet.name = command.name
    wallet.updatedAt = new Date()

    await this.WalletWriteRepository.update(command.id, { where: { id: command.id } }, wallet)

    const event = new WalletUpdatedEvent(wallet.id, wallet.name, wallet.updatedAt);

    this.client.emit('wallet_updated', event);
  }
}