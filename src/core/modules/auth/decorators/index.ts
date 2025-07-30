import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

type Req = Request & { user: User };

export const Auth = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Req>();
    return data ? req.user?.[data] : req.user;
  },
);
