import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersReadRepository } from '../../../domain/repositories/user-read.repository';
import { UserResponseDto } from 'src/modules/users/interfaces/dto/users/user.response.dto';
import { GetUsersQuery } from '../get-users.query';


@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery, UserResponseDto[]> {
  constructor(
    private readonly userReadRepository: UsersReadRepository,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(query: GetUsersQuery): Promise<UserResponseDto[]> {
    const userProjections = await this.userReadRepository.getAll()
    return userProjections.map(
        user => new UserResponseDto(
          user._id,
          user.name,
          user.email,
          user.role,
          user.createdAt,
          user.updatedAt,
        ),
      );
  }
}