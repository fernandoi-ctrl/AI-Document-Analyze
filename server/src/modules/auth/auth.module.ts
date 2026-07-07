// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { AUTH_PROVIDER } from './providers/auth.tokens';
// import { SupabaseAuthProvider } from './providers/supabase-auth.provider';
// import { JwtStrategy } from 'src/common/auth/jwt.strategy';

// @Module({
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     { provide: AUTH_PROVIDER, useClass: SupabaseAuthProvider },
//     JwtStrategy
//   ],
//   exports: [AuthService],
// })
// export class AuthModule { }
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_PROVIDER } from './providers/auth.tokens';
import { SupabaseAuthProvider } from './providers/supabase-auth.provider';
import { JwtStrategy } from 'src/common/auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     { provide: AUTH_PROVIDER, useClass: SupabaseAuthProvider },
//     JwtStrategy,
//   ],
//   exports: [AuthService],
// })
// export class AuthModule { }
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // access token
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: AUTH_PROVIDER, useClass: SupabaseAuthProvider },
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }