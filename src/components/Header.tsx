import { Link, NavLink } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';
import './Header.scss';

function getLinkClassName({ isActive }: { isActive: boolean }) {
  return `header__link${isActive ? ' header__link--active' : ''}`;
}

function Header() {
  const { isAuthenticated, user } = useAuth();
  const logout = useLogout();

  return (
    <header className="header">
      <Link className="header__brand" to="/tasks">
        <span className="header__title">Study Planner</span>
      </Link>

      <nav className="header__nav" aria-label="Основна навігація">
        <NavLink to="/tasks" className={getLinkClassName}>
          Tasks
        </NavLink>
        <NavLink to="/profile" className={getLinkClassName}>
          Profile
        </NavLink>
        {isAuthenticated ? (
          <button type="button" className="header__logout" onClick={logout}>
            Logout{user ? ` (${user.username})` : ''}
          </button>
        ) : (
          <NavLink to="/login" className={getLinkClassName}>
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;
