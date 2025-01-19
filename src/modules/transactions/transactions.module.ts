import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from './infrastructure/event-bus/rabbitmq-module';
import { CommandHandlers } from './applications/commands/handlers';
import { QueryHandlers } from './applications/queries/handlers';
import { TransactionController } from './interfaces/rest/transactions/transactions.controller';
import { TransactionsReadRepository } from './domain/repositories/transactions-read.repository';
import { TransactionEventsHandler } from './applications/events/transaction-events.handler';
import { TransactionWriteRepository } from './domain/repositories/transaction-write.repository';
import { Transaction, TransactionSchema } from './domain/projections/transaction.schema';
import { TransactionAggregate } from './domain/aggregates/transaction.aggregate';
import { TransactionEventsController } from './interfaces/rest/transactions/transcations-events.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    JwtModule.register({
      secret: 'my-very-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
    RabbitMQModule,
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    TypeOrmModule.forFeature([TransactionAggregate]),
  ],
  controllers: [
    TransactionController,
    TransactionEventsController],
  providers: [
    TransactionsReadRepository,
    TransactionEventsHandler,
    TransactionWriteRepository,
    ...CommandHandlers, ...QueryHandlers],
})
export class TransactionsModule {}