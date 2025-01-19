import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetWalletQuery } from '../get-wallet.query';
import { WalletResponseDto } from 'src/modules/wallets/interfaces/dto/wallets/wallet-response.dto';
import { WalletsReadRepository } from 'src/modules/wallets/domain/repositories/wallets-read.repository';


@QueryHandler(GetWalletQuery)
export class GetWalletHandler implements IQueryHandler<GetWalletQuery, WalletResponseDto> {
  constructor(
    private readonly WalletReadRepository: WalletsReadRepository,
    @Inject('WALLET_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(query: GetWalletQuery): Promise<WalletResponseDto> {
    const walletProjection = await this.WalletReadRepository.getWalletById(query.id)
    return new WalletResponseDto(walletProjection._id, walletProjection.name, walletProjection.userId, walletProjection.balance, walletProjection.createdAt, walletProjection.updatedAt)
  }
}