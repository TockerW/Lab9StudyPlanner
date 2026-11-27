import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authToken } from '../api/authToken';
import { isAbortError } from '../api/errors';
import { authRepository } from '../repositories/authRepository';
import type { LoginFormData } from '../schemas/authSchema';
import type { AuthUser } from '../types/auth';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthStatus } from './AuthContext';

interface Session {
  status: AuthStatus;
  user: AuthUser | null;
  accessToken: string | null;
}

const anonymousSession: Session = { status: 'anonymous', user: null, accessToken: null };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Якщо токен збережено — спочатку перевіряємо його через GET /auth/me.
  const [session, setSession] = useState<Session>(() => {
    const token = authToken.get();
    return token ? { status: 'loading', user: null, accessToken: token } : anonymousSession;
  });

  // Effect: відновлення сесії після перезавантаження сторінки.
  useEffect(() => {
    if (session.status !== 'loading') return;

    const controller = new AbortController();
    authRepository
      .getCurrentUser(controller.signal)
      .then((user) => {
        setSession((prev) => ({ ...prev, status: 'authenticated', user }));
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        authToken.set(null); // токен недійсний або прострочений
        setSession(anonymousSession);
      });

    return () => controller.abort();
  }, [session.status]);

  const login = useCallback(async (credentials: LoginFormData) => {
    const { accessToken } = await authRepository.login(credentials);
    authToken.set(accessToken);
    try {
      const user = await authRepository.getCurrentUser();
      setSession({ status: 'authenticated', user, accessToken });
    } catch (error) {
      authToken.set(null);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authToken.set(null);
    setSession(anonymousSession);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: session.status,
      user: session.user,
      accessToken: session.accessToken,
      isAuthenticated: session.status === 'authenticated',
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
