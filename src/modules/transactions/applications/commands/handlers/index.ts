import { CancelTransactionHandler } from './cancel-transaction.handler';
import { CreateTransactionHandler } from './create-transaction.handler';
import { UpdateTransactionStatusHandler } from './update-transaction-status.handler';

export const CommandHandlers = [
    CreateTransactionHandler,
    UpdateTransactionStatusHandler,
    CancelTransactionHandler];
