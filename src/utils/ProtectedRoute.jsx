import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Spinner } from '@/components/ui/spinner.jsx';

export const ProtectedRoute = () => {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-[40vh] w-full max-w-6xl items-center justify-center gap-2 px-4 py-12 text-sm text-muted-foreground">
        <Spinner size={22} />
        <span className="sr-only">Loading session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
