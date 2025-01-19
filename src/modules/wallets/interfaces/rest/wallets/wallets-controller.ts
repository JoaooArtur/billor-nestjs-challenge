import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWalletDto } from '../../dto/wallets/create-wallet.dto';
import { UpdateWalletDto } from '../../dto/wallets/update-wallet.dto';
import { GetWalletQuery } from '../../../application/queries/get-wallet.query';
import { GetWalletsQuery } from '../../../application/queries/get-wallets.query';
import { UpdateWalletCommand } from 'src/modules/wallets/application/commands/update-wallet.command';
import { CreateWalletCommand } from 'src/modules/wallets/application/commands/create-wallet.command';
import { DeleteWalletCommand } from 'src/modules/wallets/application/commands/delete-wallet.command';
import { Roles as RolesEnum } from 'src/modules/auth/domain/enumerations/roles.enum';
import { AuthGuard } from 'src/modules/auth/applications/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/applications/guards/role.guard';
import { Roles } from 'src/modules/auth/applications/decorators/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: 'Create a wallet' })
  @ApiResponse({
    status: 200,
    description: 'Wallet successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Post(':userId')
  async createWallet(@Param('userId') userId: number, @Body() createWalletDto: CreateWalletDto) {
    return this.commandBus.execute(new CreateWalletCommand(createWalletDto.name, userId));
  }
  
  @ApiOperation({ summary: 'Update a wallet' })
  @ApiResponse({
    status: 200,
    description: 'Wallet successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Put(':userId')
  async updateWallet(@Param('userId') userId: number, @Body() updateUserDto: UpdateWalletDto) {
    return this.commandBus.execute(new UpdateWalletCommand(userId, updateUserDto.name));
  }

  @ApiOperation({ summary: 'Delete a wallet' })
  @ApiResponse({
    status: 200,
    description: 'Wallet successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Delete(':userId')
  async deleteWallet(@Param('userId') userId: number) {
    return this.commandBus.execute(new DeleteWalletCommand(userId));
  }
  
  @ApiOperation({ summary: 'Get a wallet' })
  @ApiResponse({
    status: 200,
    description: 'Wallet successfully consulted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Get(':userId')
  async getWallet(@Param('userId') userId: number) { 
    return this.queryBus.execute(new GetWalletQuery(userId));
  }

  @ApiOperation({ summary: 'List all wallets' })
  @ApiResponse({
    status: 200,
    description: 'Wallets successfully listed',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Get()
  async getAll() {
    return this.queryBus.execute(new GetWalletsQuery());
  }
}