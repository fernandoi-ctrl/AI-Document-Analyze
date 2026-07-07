import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  // jwtService: JwtService;
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService,
    private readonly config: ConfigService,) {
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    console.log('Esto debería verse en la terminal')
    return this.authService.login(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }
  @Post('refresh')
  async refresh(@Body('refreshToken') token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });

    const newAccessToken = await this.jwtService.signAsync(
      { sub: payload.sub, email: payload.email },
      { secret: this.config.get<string>('JWT_SECRET'), expiresIn: '1h' },
    );

    return { accessToken: newAccessToken };
  }


}
