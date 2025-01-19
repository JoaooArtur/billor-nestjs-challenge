import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './application/commands/handlers/index';
import { QueryHandlers } from './application/queries/handlers/index';
import { RabbitMQModule } from './infrastructure/event-bus/rabbitmq-module';
import { WalletEventsHandler } from './application/events/wallet-events.handler';
import { WalletsController } from '../wallets/interfaces/rest/wallets/wallets-controller';
import { WalletsEventsController } from '../wallets/interfaces/rest/wallets/wallets-events.controller';
import { Wallet, WalletSchema } from '../wallets/domain/projections/wallet.schema';
import { WalletAggregate } from './domain/aggregates/wallet.aggregate';
import { WalletsReadRepository } from './domain/repositories/wallets-read.repository';
import { WalletsWriteRepository } from './domain/repositories/wallet-write.repository';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    CqrsModule,
    RabbitMQModule,
    AuthModule,
    JwtModule.register({
      secret: 'my-very-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    TypeOrmModule.forFeature([WalletAggregate]),
  ],
  controllers: [
    WalletsController,
    WalletsEventsController],
  providers: [
    WalletsReadRepository,
    WalletEventsHandler,
    WalletsWriteRepository,
    ...CommandHandlers, ...QueryHandlers],
})
export class WalletsModule {}