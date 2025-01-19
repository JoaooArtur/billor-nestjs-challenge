import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DeleteWalletCommand } from '../delete-wallet.command';
import { WalletsWriteRepository } from 'src/modules/wallets/domain/repositories/wallet-write.repository';
import { WalletDeletedEvent } from 'src/modules/wallets/domain/events/Wallet-deleted.event';
import { WalletsReadRepository } from 'src/modules/wallets/domain/repositories/wallets-read.repository';


@CommandHandler(DeleteWalletCommand)
export class DeleteWalletHandler implements ICommandHandler<DeleteWalletCommand> {
  constructor(
    private readonly walletWriteRepository: WalletsWriteRepository,
    private readonly walletReadRepository: WalletsReadRepository,
    @Inject('WALLET_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: DeleteWalletCommand): Promise<void> {
    const wallet = await this.walletReadRepository.getWalletById(command.id);

    await this.walletWriteRepository.delete(command.id);

    const event = new WalletDeletedEvent(command.id);

    this.client.emit('wallet_deleted', event);
  }
}