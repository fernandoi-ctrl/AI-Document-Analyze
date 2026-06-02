import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from '../../database/database.service';
import { RequestUser } from './auth-user.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly db: DatabaseService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: RequestUser }>();
    const header = req.headers['authorization'];
    const headerToken = typeof header === 'string' ? header.replace(/^Bearer\s+/i, '') : null;
    const queryToken = typeof req.query['access_token'] === 'string' ? (req.query['access_token'] as string) : null;
    const token = headerToken ?? queryToken;

    // if (process.env.NODE_ENV === 'development') {
    //   const request = context.switchToHttp().getRequest();
    //   request.user = { id: '2ff541b4-a1bf-4d12-9ab9-733346a41cdb', email: 'dev@example.com' };
    //   return true;
    // }
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const { data, error } = await this.db.client.auth.getUser(token);
    //  const { data, error } = await this.db.client.auth.getUser(token);
    console.log('Supabase getUser result:', { data, error });
    if (error || !data.user) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = { id: data.user.id, email: data.user.email ?? '' };
    return true;
  }
}
