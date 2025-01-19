import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { CreateUserCommand } from '../../../application/commands/create-user.command';
import { GetUserQuery } from '../../../application/queries/get-user.query';
import { DeleteUserCommand } from '../../../application/commands/delete-user.command';
import { UpdateUserCommand } from '../../../application/commands/update-user.command';
import { UpdateUserDto } from '../../dto/users/update-user.dto';
import { GetUsersQuery } from '../../../application/queries/get-users.query';
import { Roles } from 'src/modules/auth/applications/decorators/roles.decorator';
import { Roles as RolesEnum } from 'src/modules/auth/domain/enumerations/roles.enum';
import { AuthGuard } from 'src/modules/auth/applications/guards/auth.guard';
import { RoleGuard } from 'src/modules/auth/applications/guards/role.guard';
import { DomainExceptionFilter } from 'src/modules/users/infrastructure/exceptions/domain-exception.filter';
import { ApplicationExceptionFilter } from 'src/modules/users/infrastructure/exceptions/application-exception.filter';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseFilters(DomainExceptionFilter, ApplicationExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto.name, createUserDto.email, createUserDto.password, createUserDto.role));
  }
  
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Put(':userId')
  async updateUser(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(userId, updateUserDto.name, updateUserDto.email, updateUserDto.password, updateUserDto.role));
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: number) {
    return this.commandBus.execute(new DeleteUserCommand(userId));
  }
  
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully consulted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UseGuards(AuthGuard,RoleGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @Get(':userId')
  async getUser(@Param('userId') userId: number) {
    return this.queryBus.execute(new GetUserQuery(userId));
  }

  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'Users successfully listed',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Get()
  async getAll() {
    return this.queryBus.execute(new GetUsersQuery());
  }
}