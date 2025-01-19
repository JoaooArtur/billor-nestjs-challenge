import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateWalletBalanceCommand } from '../update-wallet-balance.command';
import { WalletsWriteRepository } from 'src/modules/wallets/domain/repositories/wallet-write.repository';
import { WalletBalanceUpdatedEvent } from 'src/modules/wallets/domain/events/wallet-balance-updated.event';
import { TransactionType } from 'src/modules/transactions/domain/enumerations/transaction-type.enum';


@CommandHandler(UpdateWalletBalanceCommand)
export class UpdateWalletBalanceHandler implements ICommandHandler<UpdateWalletBalanceCommand> {
  constructor(
    private readonly WalletWriteRepository: WalletsWriteRepository,
    @Inject('WALLET_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: UpdateWalletBalanceCommand): Promise<void> {
    const wallet = await this.WalletWriteRepository.findOne({ where: { id: command.id } });

    if(command.type === TransactionType.EXPENSE && command.balance > wallet.balance)
      return Promise.resolve();

    const balance = command.type === TransactionType.EXPENSE ?
      wallet.balance - command.balance :
      wallet.balance + command.balance

    await this.WalletWriteRepository.updateWithTransaction(command.id, balance, command.queryRunner)

    const event = new WalletBalanceUpdatedEvent(command.id, balance, wallet.updatedAt);

    this.client.emit('wallet_balance_updated', event);
  }
}