import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from '../../database/database.service';
import { RequestUser } from './auth-user.types';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    // Si no hay header, intenta leer el token de query
    if (!req.headers.authorization && req.query.access_token) {
      req.headers.authorization = `Bearer ${req.query.access_token}`
    }
    return req
  }
}
