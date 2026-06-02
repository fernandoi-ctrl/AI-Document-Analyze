export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class LoginResponseDto {
  user!: AuthUser;
  session!: AuthSession;
}

export class RegisterResponseDto {
  user!: AuthUser;
  requiresEmailConfirmation!: boolean;
}
