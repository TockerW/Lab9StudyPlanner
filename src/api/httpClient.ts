import { HttpError, isAbortError } from './errors';

type QueryParams = Record<string, string | number>;

interface RequestOptions {
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
}

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

async function request<T>(
  method: string,
  path: string,
  { query, body, signal }: RequestOptions = {},
): Promise<T> {
  const url = buildUrl(path, query);
  const hasBody = body !== undefined;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    // Скасування пробрасуємо як є, решту вважаємо мережевою помилкою.
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
  post: <T>(path: string, body: unknown, signal?: AbortSignal) =>
    request<T>('POST', path, { body, signal }),
  put: <T>(path: string, body: unknown, signal?: AbortSignal) =>
    request<T>('PUT', path, { body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) => request<T>('DELETE', path, { signal }),
};
