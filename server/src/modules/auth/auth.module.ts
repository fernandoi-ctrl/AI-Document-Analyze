import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_PROVIDER } from './providers/auth.tokens';
import { SupabaseAuthProvider } from './providers/supabase-auth.provider';
import { JwtStrategy } from 'src/common/auth/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: AUTH_PROVIDER, useClass: SupabaseAuthProvider },
    JwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule { }
