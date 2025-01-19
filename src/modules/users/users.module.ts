import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './interfaces/rest/users/users.controller';
import { UsersReadRepository } from './domain/repositories/user-read.repository';
import { UsersWriteRepository } from './domain/repositories/user-write.repository';
import { User, UserSchema } from './domain/projections/user.schema';
import { UserAggregate } from './domain/aggregates/user.aggregate';
import { CommandHandlers } from './application/commands/handlers/index';
import { QueryHandlers } from './application/queries/handlers/index';
import { RabbitMQModule } from './infrastructure/event-bus/rabbitmq-module';
import { UserEventsHandler } from './application/events/user-events.handler';
import { UsersEventsController } from './interfaces/rest/users/users-events.controllers';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './infrastructure/exceptions/domain-exception.filter';
import { ApplicationExceptionFilter } from './infrastructure/exceptions/application-exception.filter';

@Module({
  imports: [
    CqrsModule,
    RabbitMQModule,
    AuthModule,
    JwtModule.register({
      secret: 'my-very-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TypeOrmModule.forFeature([UserAggregate]),
  ],
  controllers: [UsersController,
    UsersEventsController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },{
      provide: APP_FILTER,
      useClass: ApplicationExceptionFilter,
    },
    UsersReadRepository,
    UserEventsHandler,
    UsersWriteRepository,
    ...CommandHandlers, ...QueryHandlers],
})
export class UsersModule {}