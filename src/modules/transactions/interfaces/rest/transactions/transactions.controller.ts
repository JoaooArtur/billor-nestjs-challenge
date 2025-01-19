import { Controller, Post, Body, Get, Param, Delete, Query, UseGuards, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionDto } from '../../dto/transactions/create-transaction.dto';
import { CreateTransactionCommand } from 'src/modules/transactions/applications/commands/create-transaction.command';
import { GetTransactionQuery } from 'src/modules/transactions/applications/queries/get-transaction.query';
import { GetTransactionsQuery } from 'src/modules/transactions/applications/queries/get-transactions.query';
import { CancelTransactionCommand } from 'src/modules/transactions/applications/commands/Cancel-transaction.command';
import { GetTransactionsDto } from '../../dto/transactions/get-transcations.dto';
import { RoleGuard } from 'src/modules/auth/applications/guards/role.guard';
import { Roles } from 'src/modules/auth/applications/decorators/roles.decorator';
import { Roles as RolesEnum } from 'src/modules/auth/domain/enumerations/roles.enum';
import { AuthGuard } from 'src/modules/auth/applications/guards/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus) {}
    
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Post(':userId')
  async createTransaction(@Param('userId') userId: number, @Body() createTransactionDto: CreateTransactionDto) {
    return this.commandBus.execute(new CreateTransactionCommand(
        createTransactionDto.type,
        createTransactionDto.amount,
        createTransactionDto.category,
        createTransactionDto.sourceWalletId,
        createTransactionDto.targetWalletId,
        userId));
  }

  @ApiOperation({ summary: 'Cancel a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction successfully refunded',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Delete(':userId/:id')
  async cancelTransaction(@Param('userId') userId: number,@Param('id') id: number) {
    return this.commandBus.execute(new CancelTransactionCommand(id));
  }

  @ApiOperation({ summary: 'Get a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction successfully consulted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Get(':userId/:id')
  async getTransaction(@Param('userId') userId: number, @Param('id') id: number) {
    return this.queryBus.execute(new GetTransactionQuery(id));
  }

  @ApiOperation({ summary: 'List all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Transactions consulted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Get()
  async getAll(@Query() query: GetTransactionsDto) {
    return this.queryBus.execute(new GetTransactionsQuery(query.walletId, query.startDate, query.endDate));
  }
}