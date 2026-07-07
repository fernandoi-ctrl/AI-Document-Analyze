export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// export class LoginResponseDto {
//   user!: AuthUser;
//   session!: AuthSession;
// }
// export class LoginResponseDto {
//   userId?: string;
//   email?: string;
//   accessToken?: string;
// }

export class LoginResponseDto {
  user?: {
    id: string;
    email: string;
  };

  session?: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
  };
}


export class RegisterResponseDto {
  user!: AuthUser;
  requiresEmailConfirmation!: boolean;
}
