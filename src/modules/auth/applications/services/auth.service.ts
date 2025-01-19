import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAggregate } from 'src/modules/users/domain/aggregates/user.aggregate';
import { UsersWriteRepository } from 'src/modules/users/domain/repositories/user-write.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAggregate)
    private readonly userWriteRepository: UsersWriteRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userWriteRepository.findOne({ where: { email } });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
