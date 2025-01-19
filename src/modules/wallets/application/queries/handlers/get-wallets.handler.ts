import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetWalletsQuery } from '../get-wallets.query';
import { WalletResponseDto } from 'src/modules/wallets/interfaces/dto/wallets/wallet-response.dto';
import { WalletsReadRepository } from 'src/modules/wallets/domain/repositories/wallets-read.repository';


@QueryHandler(GetWalletsQuery)
export class GetWalletsHandler implements IQueryHandler<GetWalletsQuery, WalletResponseDto[]> {
  constructor(
    private readonly WalletReadRepository: WalletsReadRepository,
    @Inject('WALLET_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(query: GetWalletsQuery): Promise<WalletResponseDto[]> {
    const WalletProjections = await this.WalletReadRepository.getAll()
    return WalletProjections.map(
        Wallet => new WalletResponseDto(
          Wallet._id,
          Wallet.name,
          Wallet.userId,
          Wallet.balance,
          Wallet.createdAt,
          Wallet.updatedAt,
        ),
      );
  }
}