import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersWriteRepository } from '../../../domain/repositories/user-write.repository';
import { CreateUserCommand } from '../create-user.command';
import { UserAggregate } from '../../../domain/aggregates/user.aggregate';
import { UserCreatedEvent } from '../../../domain/events/user-created.event';
import * as bcrypt from 'bcryptjs';


@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userWriteRepository: UsersWriteRepository,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const email = await this.userWriteRepository.findOne({ where: { email: command.email } });

    const userAggregate = UserAggregate.create(command.name, command.email, await bcrypt.hash(command.password,10), command.role)
    const user = await this.userWriteRepository.create(userAggregate);

    const event = new UserCreatedEvent(user.id, user.name, user.email, user.role, user.createdAt);
    this.client.emit('user_created', event);
  }
}