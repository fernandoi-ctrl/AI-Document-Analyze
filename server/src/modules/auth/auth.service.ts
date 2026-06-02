import { Inject, Injectable } from '@nestjs/common';
import { AuthProvider } from './providers/auth-provider.interface';
import { AUTH_PROVIDER } from './providers/auth.tokens';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_PROVIDER) private readonly auth: AuthProvider) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { user, session } = await this.auth.signIn({
      email: dto.email,
      password: dto.password,
    });
    return { user, session };
  }

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const { user, requiresEmailConfirmation } = await this.auth.signUp({
      email: dto.email,
      password: dto.password,
    });
    return { user, requiresEmailConfirmation };
  }
}
