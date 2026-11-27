import { ACCESS_TOKEN_STORAGE_KEY } from '../constants';

function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

let accessToken: string | null = readStoredToken();

 // Сховище accessToken. Єдине місце, звідки httpClient бере токен.

export const authToken = {
  get(): string | null {
    return accessToken;
  },

  set(token: string | null) {
    accessToken = token;
    try {
      if (token) window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
      else window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      // Токен живе лише в пам'яті
    }
  },
};
