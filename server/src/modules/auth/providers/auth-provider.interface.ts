import { AuthSession, AuthUser } from '../dto/auth-response.dto';

export interface SignInResult {
  user: AuthUser;
  session: AuthSession;
}

export interface SignUpResult {
  user: AuthUser;
  requiresEmailConfirmation: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthProvider {
  signIn(credentials: Credentials): Promise<SignInResult>;
  signUp(credentials: Credentials): Promise<SignUpResult>;
}
