/** Помилка HTTP. status = 0 означає, що відповіді від сервера не було (мережа). */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Скасований запит (AbortController) — це не помилка для користувача. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/** Централізована нормалізація помилок у зрозуміле повідомлення. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 0) {
      return 'Немає з’єднання із сервером. Перевірте інтернет і спробуйте ще раз.';
    }
    if (error.status === 404) return 'Ресурс не знайдено.';
    if (error.status >= 500) return 'Помилка сервера. Спробуйте пізніше.';
    return `Не вдалося виконати запит (код ${error.status}).`;
  }
  if (error instanceof Error) return error.message;
  return 'Сталася невідома помилка.';
}
