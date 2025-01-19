import { Injectable } from '@nestjs/common';
import { UsersReadRepository } from '../../domain/repositories/user-read.repository';
import { UserCreatedEvent } from '../../domain/events/user-created.event';
import { UserUpdatedEvent } from '../../domain/events/user-updated.event';
import { UserDeletedEvent } from '../../domain/events/user-deleted.event';

@Injectable()
export class UserEventsHandler {
  constructor(private readonly userReadRepository: UsersReadRepository,
  ) {}

  async handleUserCreatedEvent(payload: UserCreatedEvent) {
    await this.userReadRepository.projectUser(payload.id, payload.name, payload.name, payload.email, payload.role);
  }

  async handleUserUpdatedEvent(payload: UserUpdatedEvent) {
    await this.userReadRepository.updateUser(payload.id, payload.name, payload.password, payload.email, payload.role);
  }

  async handleUserDeletedEvent(payload: UserDeletedEvent) {
    await this.userReadRepository.deleteUser(payload.id);
  }
}
