import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionEventsHandler } from 'src/modules/transactions/applications/events/transaction-events.handler';
import { TransactionRefundedEvent } from 'src/modules/transactions/domain/events/transaction-refunded.event';
import { TransactionCreatedEvent } from 'src/modules/transactions/domain/events/transaction-created.event';
import { TransactionStatusUpdatedEvent } from 'src/modules/transactions/domain/events/transaction-status-updated.event';

@Controller()
export class TransactionEventsController {
  constructor(
    private readonly eventHandler: TransactionEventsHandler) {}

  @EventPattern("transaction_created")
  async handleTransactionCreated(@Payload() event:TransactionCreatedEvent ) {
    return this.eventHandler.handleTransactionCreatedEvent(event)
  }

  @EventPattern("transaction_refunded")
  async handleTransactionRefunded(@Payload() event:TransactionRefundedEvent ) {
    return this.eventHandler.handleTransactionRefundedEvent(event)
  }

  @EventPattern("transaction_status_updated")
  async handleTransactionStatusUpdated(@Payload() event:TransactionStatusUpdatedEvent ) {
    return this.eventHandler.handleTransactionStatusUpdatedEvent(event)
  }
}