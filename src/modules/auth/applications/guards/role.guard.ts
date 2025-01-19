import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../../domain/enumerations/roles.enum';

@Injectable()
export class RoleGuard extends AuthGuard {
  constructor(private reflector: Reflector,
    jwtService: JwtService,) {
    super(jwtService);
  }

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return super.canActivate(context);
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const payload = this.jwtService.verify(request.headers.authorization?.split(' ')[1]);
    request.user = payload;

    const userRole = payload.role;
    const userIdFromToken = payload.sub;
    const userIdFromRequest = request.params.userId;

    if (!roles.some((role) => userRole === role)) {
        return false;
    }
    
    console.log(userRole,userIdFromToken,userIdFromRequest)
    if (userRole === Roles.USER) {
        return userIdFromToken === userIdFromRequest;
    }

    return true;
  }
}
