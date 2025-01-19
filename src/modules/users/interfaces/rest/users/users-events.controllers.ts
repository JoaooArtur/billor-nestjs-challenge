import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserCreatedEvent } from '../../../domain/events/user-created.event';
import { UserEventsHandler } from '../../../application/events/user-events.handler';
import { UserDeletedEvent } from '../../../domain/events/user-deleted.event';
import { UserUpdatedEvent } from '../../../domain/events/user-updated.event';
import { DomainExceptionFilter } from 'src/modules/users/infrastructure/exceptions/domain-exception.filter';
import { ApplicationExceptionFilter } from 'src/modules/users/infrastructure/exceptions/application-exception.filter';

@UseFilters(DomainExceptionFilter, ApplicationExceptionFilter)
@Controller()
export class UsersEventsController {
  constructor(
    private readonly eventHandler: UserEventsHandler) {}

  @EventPattern("user_created")
  async handleUserCreated(@Payload() event:UserCreatedEvent ) {
    return this.eventHandler.handleUserCreatedEvent(event)
  }

  @EventPattern("user_updated")
  async handleUserUpdated(@Payload() event:UserUpdatedEvent ) {
    return this.eventHandler.handleUserUpdatedEvent(event)
  }

  @EventPattern("user_deleted")
  async handleUserDeleted(@Payload() event:UserDeletedEvent ) {
    return this.eventHandler.handleUserDeletedEvent(event)
  }
}