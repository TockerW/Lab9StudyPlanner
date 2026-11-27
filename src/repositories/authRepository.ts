import { httpClient } from '../api/httpClient';
import { HttpError } from '../api/errors';
import type { ApiAuthUser, ApiLoginResponse, AuthUser, LoginRequest } from '../types/auth';

export const authRepository = {
  // POST /auth/login: повертає accessToken
  async login({ username, password }: LoginRequest, signal?: AbortSignal) {
    try {
      const data = await httpClient.post<ApiLoginResponse>(
        '/auth/login',
        { username, password, expiresInMins: 60 },
        { signal },
      );
      return { accessToken: data.accessToken };
    } catch (error) {
      // DummyJSON відповідає 400 на невірні облікові дані
      if (error instanceof HttpError && error.status === 400) {
        throw new Error('Невірний логін або пароль.');
      }
      throw error;
    }
  },

  // GET /auth/me з Authorization: Bearer <accessToken>
  async getCurrentUser(signal?: AbortSignal): Promise<AuthUser> {
    const user = await httpClient.get<ApiAuthUser>('/auth/me', { auth: true, signal });
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  },
};
