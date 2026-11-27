import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

 // Перевірка авторизації перед захищеною дією (create / edit / delete)
 // Гість отримує повідомлення і потрапляє на /login, після входу повертається назад
 // Повертає true, якщо дію можна виконувати
 
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback((): boolean => {
    if (isAuthenticated) return true;
    showToast('Щоб виконати цю дію, увійдіть у систему.', 'info');
    navigate('/login', { state: { from: location } });
    return false;
  }, [isAuthenticated, showToast, navigate, location]);
}
