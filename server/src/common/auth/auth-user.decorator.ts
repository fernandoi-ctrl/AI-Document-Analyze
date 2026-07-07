import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestUser } from './auth-user.types';

// export const AuthUser = createParamDecorator(
//   (_data: unknown, ctx: ExecutionContext): RequestUser => {
//     const req = ctx.switchToHttp().getRequest<Request & { user?: RequestUser }>();
//     if (!req.user) {
//       throw new Error('AuthUser decorator used without JwtAuthGuard');
//     }
//     return req.user;
//   },
// );
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as RequestUser;
  },
);
