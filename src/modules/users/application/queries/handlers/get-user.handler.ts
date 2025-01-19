import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersReadRepository } from '../../../domain/repositories/user-read.repository';
import { UserResponseDto } from 'src/modules/users/interfaces/dto/users/user.response.dto';
import { GetUserQuery } from '../get-user.query';


@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery, UserResponseDto> {
  constructor(
    private readonly userReadRepository: UsersReadRepository,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    const userProjection = await this.userReadRepository.getUserById(query.id)
    return new UserResponseDto(userProjection._id, userProjection.name, userProjection.email, userProjection.role, userProjection.createdAt, userProjection.updatedAt)
  }
}