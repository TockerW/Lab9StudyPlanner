import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export function useLogout() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    logout();
    showToast('Ви вийшли із системи.', 'info');
    // Protected route більше недоступний — повертаємо користувача до списку
    if (location.pathname === '/profile') navigate('/tasks', { replace: true });
  }, [logout, showToast, navigate, location.pathname]);
}
