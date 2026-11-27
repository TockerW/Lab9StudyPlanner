import { Navigate, Outlet, useLocation } from 'react-router';
import PageMessage from '../components/PageMessage';
import { useAuth } from '../hooks/useAuth';

// Declarative protected route: пускає далі лише авторизованого користувача
function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <PageMessage>Перевірка сесії...</PageMessage>;
  }

  if (status === 'anonymous') {
    // from щоб повернути користувача на потрібну сторінку після входу
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
