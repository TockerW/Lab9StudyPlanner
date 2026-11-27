import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';
import './ProfilePage.scss';

// Захищена сторінка: доступна лише через ProtectedRoute
function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();

  return (
    <section className="profile-page">
      <h2 className="profile-page__title">Профіль</h2>

      <dl className="profile-page__list">
        <dt className="profile-page__label">Username</dt>
        <dd className="profile-page__value">{user?.username}</dd>
        <dt className="profile-page__label">Email</dt>
        <dd className="profile-page__value">{user?.email}</dd>
        <dt className="profile-page__label">Ім’я</dt>
        <dd className="profile-page__value">
          {user?.firstName} {user?.lastName}
        </dd>
        <dt className="profile-page__label">Статус</dt>
        <dd className="profile-page__value">
          {isAuthenticated ? 'Авторизовано' : 'Не авторизовано'}
        </dd>
      </dl>

      <button type="button" className="profile-page__logout" onClick={logout}>
        Logout
      </button>
    </section>
  );
}

export default ProfilePage;
