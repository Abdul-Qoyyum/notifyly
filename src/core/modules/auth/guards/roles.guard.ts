// src/auth/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ROLES_KEY } from '../decorators';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../../notification/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Access Denied');
    }

    const hasRole = requiredRoles.some((role) => user?.role?.name === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `User with role ${user?.role?.name} is not allowed to access this resource`,
      );
    }

    return true;
  }
}
