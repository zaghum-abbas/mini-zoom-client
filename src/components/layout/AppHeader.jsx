import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '../ui/button.jsx';

export const AppHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/50 text-white backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
        <Link to="/" className="font-semibold tracking-tight text-white">
          Mini Meeting
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white',
              ].join(' ')
            }
          >
            Meetings
          </NavLink>
        </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80">
            {user?.name || user?.email}{' '}
            <span className="ml-1 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/90">
              {user?.role}
            </span>
          </span>
          <Button type="button" variant="ghost" className="text-white" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
};
