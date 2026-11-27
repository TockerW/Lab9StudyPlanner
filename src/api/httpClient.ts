import { authToken } from './authToken';
import { HttpError, isAbortError } from './errors';

type QueryParams = Record<string, string | number>;

interface RequestOptions {
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
  //Додає заголовок Authorization: Bearer <token>. Єдине місце, де він формується
  auth?: boolean;
}

type MutationOptions = Pick<RequestOptions, 'signal' | 'auth'>;

const baseUrl = import.meta.env.VITE_API_URL;

function buildUrl(path: string, query?: QueryParams): string {
  if (!baseUrl) {
    throw new Error('Не задано VITE_API_URL. Скопіюйте .env.example у .env.');
  }

  const url = new URL(`${baseUrl.replace(/\/+$/, '')}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

// Кидає 401, якщо користувач не авторизований (захист на рівні API-шару)
export function assertAuthenticated(): void {
  if (!authToken.get()) throw new HttpError(401, 'Unauthorized');
}

async function request<T>(
  method: string,
  path: string,
  { query, body, signal, auth }: RequestOptions = {},
): Promise<T> {
  const url = buildUrl(path, query);
  const hasBody = body !== undefined;

  const headers: Record<string, string> = {};
  if (hasBody) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = authToken.get();
    if (!token) throw new HttpError(401, 'Unauthorized');
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    // Скасування пробрасуємо як є, решту вважаємо мережевою помилкою
    if (isAbortError(error)) throw error;
    throw new HttpError(0, 'Network error');
  }

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText || `HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export const httpClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('GET', path, options),
  post: <T>(path: string, body: unknown, options?: MutationOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body: unknown, options?: MutationOptions) =>
    request<T>('PUT', path, { ...options, body }),
  delete: <T>(path: string, options?: MutationOptions) => request<T>('DELETE', path, options),
};
