import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { RoleEnum } from '../../notification/enums';

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

type Req = Request & { user: User };

export const Auth = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Req>();
    return data ? req.user?.[data] : req.user;
  },
);
