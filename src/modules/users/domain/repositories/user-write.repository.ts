import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAggregate } from '../aggregates/user.aggregate';
import { BaseRepository } from '../../infrastructure/persistence/postgres/base/base.repository';

@Injectable()
export class UsersWriteRepository extends BaseRepository<UserAggregate>{
  constructor(
    @InjectRepository(UserAggregate)
    private readonly userRepository: Repository<UserAggregate>,
  ) {
    super(userRepository);
  }
}