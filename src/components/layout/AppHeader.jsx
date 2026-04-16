import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="logo">
          Mini Meeting
        </Link>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Meetings
          </NavLink>
        </nav>
        <div className="user-menu">
          <span className="muted">
            {user?.name || user?.email}{' '}
            <span className="badge">{user?.role}</span>
          </span>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
