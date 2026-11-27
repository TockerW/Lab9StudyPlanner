import { createContext } from 'react';
import type { AuthUser } from '../types/auth';
import type { LoginFormData } from '../schemas/authSchema';

// loading — перевіряємо збережену сесію, щоб не показувати форму входу передчасно
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
