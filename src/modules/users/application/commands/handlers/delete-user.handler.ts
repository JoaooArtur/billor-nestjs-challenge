import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersWriteRepository } from '../../../domain/repositories/user-write.repository';
import { DeleteUserCommand } from '../delete-user.command';
import { UserDeletedEvent } from 'src/modules/users/domain/events/user-deleted.event';


@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly userWriteRepository: UsersWriteRepository,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    await this.userWriteRepository.delete(command.id);

    const event = new UserDeletedEvent(command.id);

    this.client.emit('user_deleted', event);
  }
}