import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAggregate } from '../users/domain/aggregates/user.aggregate';
import { AuthService } from './applications/services/auth.service';
import { LocalStrategy } from './applications/strategies/local.strategy';
import { JwtStrategy } from './applications/strategies/jwt.strategy';
import { AuthController } from './interfaces/rest/auth.controller';
import { AuthGuard } from './applications/guards/auth.guard';
import { RoleGuard } from './applications/guards/role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAggregate]),
    JwtModule.register({
      secret: 'my-very-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthGuard,
    RoleGuard],
  exports: [AuthService],
})
export class AuthModule {}
