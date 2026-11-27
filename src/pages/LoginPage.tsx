import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation } from 'react-router';
import { getErrorMessage } from '../api/errors';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { loginSchema } from '../schemas/authSchema';
import type { LoginFormData } from '../schemas/authSchema';
import './LoginPage.scss';

// Шлях, звідки користувача відправили на /login (state.from), або /tasks
function getRedirectPath(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const from = (state as { from?: { pathname?: string; search?: string } }).from;
    if (from?.pathname) return `${from.pathname}${from.search ?? ''}`;
  }
  return '/tasks';
}

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login(values);
      showToast('Ви успішно увійшли в систему.');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  });

  // Після успішного входу (або якщо вже авторизований) — повертаємо назад
  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(location.state)} replace />;
  }

  return (
    <section className="login-page">
      <form className="login-page__form" onSubmit={submit} noValidate>
        <h2 className="login-page__title">Вхід</h2>

        <div className="login-page__field">
          <label className="login-page__label" htmlFor="login-username">
            Логін
          </label>
          <input
            id="login-username"
            className="login-page__control"
            autoComplete="username"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'login-username-error' : undefined}
            {...register('username')}
          />
          {errors.username && (
            <p id="login-username-error" className="login-page__error" role="alert">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="login-page__field">
          <label className="login-page__label" htmlFor="login-password">
            Пароль
          </label>
          <input
            id="login-password"
            type="password"
            className="login-page__control"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p id="login-password-error" className="login-page__error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {submitError && (
          <p className="login-page__error login-page__error--form" role="alert">
            {submitError}
          </p>
        )}

        <button type="submit" className="login-page__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Вхід...' : 'Увійти'}
        </button>

        <p className="login-page__hint">Тестовий обліковий запис DummyJSON: emilys / emilyspass</p>
      </form>
    </section>
  );
}

export default LoginPage;
