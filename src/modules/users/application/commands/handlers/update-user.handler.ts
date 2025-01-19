import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersWriteRepository } from '../../../domain/repositories/user-write.repository';
import { UpdateUserCommand } from '../update-user.command';
import { UserUpdatedEvent } from 'src/modules/users/domain/events/user-updated.event';
import * as bcrypt from 'bcryptjs';


@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userWriteRepository: UsersWriteRepository,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const user = await this.userWriteRepository.findOne({ where: { id: command.id } });
    
    user.email = command.email
    user.name = command.name
    user.password = await bcrypt.hash(command.password,10); 
    user.role = command.role
    user.updatedAt = new Date()

    await this.userWriteRepository.update(command.id, { where: { id: command.id } }, user)

    const event = new UserUpdatedEvent(user.id, user.name, user.email, user.password, user.role, user.createdAt);

    this.client.emit('user_updated', event);
  }
}