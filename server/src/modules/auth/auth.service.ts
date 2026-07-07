import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import { AUTH_PROVIDER } from './providers/auth.tokens';
import { AuthProvider } from './providers/auth-provider.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_PROVIDER) private readonly auth: AuthProvider,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  // async login(dto: LoginDto): Promise<LoginResponseDto> {
  //   console.log('Login DTO recibido:', dto);

  //   // Aquí deberías validar credenciales contra tu base de datos o proveedor
  //   // Ejemplo: const user = await this.auth.validateUser(dto.email, dto.password);
  //   // if (!user) throw new UnauthorizedException('Credenciales inválidas');

  //   const payload = { sub: 'user-id', email: dto.email };
  //   try {
  //     const accessToken = await this.jwtService.signAsync(payload);

  //     // return {
  //     //   userId: 'user-id',
  //     //   email: dto.email,
  //     //   accessToken,
  //     // };
  //     return {
  //       user: { id: 'user-id', email: dto.email },
  //       session: { accessToken, refreshToken: '', expiresAt: Date.now() + 3600 * 1000 },
  //     }

  //   } catch (err) {
  //     console.error('Error generando token:', err);
  //     throw err;
  //   }
  // }

  // async login(dto: LoginDto): Promise<LoginResponseDto> {
  //   console.log('Login DTO recibido:', dto);

  //   const { user } = await this.auth.signIn({
  //     email: dto.email,
  //     password: dto.password,
  //   });

  //   if (!user) throw new UnauthorizedException('Credenciales inválidas');

  //   const payload = { sub: user.id, email: user.email };
  //   const accessToken = await this.jwtService.signAsync(payload);

  //   return {
  //     user: { id: user.id, email: user.email },
  //     session: {
  //       accessToken,
  //       refreshToken: '',
  //       expiresAt: Date.now() + 3600 * 1000,
  //     },
  //   };
  // }
  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { user } = await this.auth.signIn({
      email: dto.email,
      password: dto.password,
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    console.log(user, "hola");
    return {
      user: { id: user.id, email: user.email },
      session: {
        accessToken,
        refreshToken,
        expiresAt: Date.now() + 3600 * 1000,
      },
    };
  }




  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const { user, requiresEmailConfirmation } = await this.auth.signUp({
      email: dto.email,
      password: dto.password,
    });
    return { user, requiresEmailConfirmation };
  }
}
