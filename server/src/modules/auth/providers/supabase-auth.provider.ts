import { Injectable, OnModuleInit, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthProvider, Credentials, SignInResult, SignUpResult } from './auth-provider.interface';

// @Injectable()
// export class SupabaseAuthProvider implements AuthProvider, OnModuleInit {
//   private client!: SupabaseClient;

//   constructor(private readonly config: ConfigService) { }

//   onModuleInit(): void {
//     const url = this.config.get<string>('SUPABASE_URL');
//     const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

//     if (!url || !key) {
//       throw new InternalServerErrorException('Supabase credentials are not configured');
//     }

//     this.client = createClient(url, key, {
//       auth: { persistSession: false, autoRefreshToken: false },
//     });
//   }

//   async signIn({ email, password }: Credentials): Promise<SignInResult> {
//     const { data, error } = await this.client.auth.signInWithPassword({ email, password });

//     if (error || !data.session || !data.user) {
//       throw new UnauthorizedException(error?.message ?? 'Invalid credentials');
//     }

//     return {
//       user: { id: data.user.id, email: data.user.email ?? email },
//       session: {
//         accessToken: data.session.access_token,
//         refreshToken: data.session.refresh_token,
//         expiresAt: data.session.expires_at ?? 0,
//       },
//     };
//   }

//   async signUp({ email, password }: Credentials): Promise<SignUpResult> {
//     const { data, error } = await this.client.auth.signUp({ email, password });

//     if (error || !data.user) {
//       throw new BadRequestException(error?.message ?? 'Sign up failed');
//     }

//     return {
//       user: { id: data.user.id, email: data.user.email ?? email },
//       requiresEmailConfirmation: data.session === null,
//     };
//   }
// }
@Injectable()
export class SupabaseAuthProvider implements AuthProvider, OnModuleInit {
  private anonClient!: SupabaseClient;
  private serviceClient!: SupabaseClient;

  constructor(private readonly config: ConfigService) { }

  onModuleInit(): void {
    const url = this.config.get<string>('SUPABASE_URL');
    const anonKey = this.config.get<string>('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const serviceKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !anonKey || !serviceKey) {
      throw new InternalServerErrorException('Supabase credentials are not configured');
    }

    this.anonClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    this.serviceClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async signIn({ email, password }: Credentials): Promise<SignInResult> {
    const { data, error } = await this.anonClient.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException(error?.message ?? 'Invalid credentials');
    }

    return {
      user: { id: data.user.id, email: data.user.email ?? email },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? 0,
      },
    };
  }

  async signUp({ email, password }: Credentials): Promise<SignUpResult> {
    const { data, error } = await this.anonClient.auth.signUp({ email, password });

    if (error || !data.user) {
      throw new BadRequestException(error?.message ?? 'Sign up failed');
    }

    return {
      user: { id: data.user.id, email: data.user.email ?? email },
      requiresEmailConfirmation: data.session === null,
    };
  }
}
