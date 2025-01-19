import { CreateWalletHandler } from './create-wallet.handler';
import { UpdateWalletHandler } from './update-wallet.handler';
import { UpdateWalletBalanceHandler } from './update-wallet-balance.handler';
import { DeleteWalletHandler } from './delete-wallet.handler';

export const CommandHandlers = [
    CreateWalletHandler,
    UpdateWalletHandler,
    UpdateWalletBalanceHandler,
    DeleteWalletHandler,];
