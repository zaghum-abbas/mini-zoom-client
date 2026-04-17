import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { ProtectedRoute } from '@/utils/ProtectedRoute.jsx';
import { Spinner } from '@/components/ui/spinner.jsx';

const LoginPage = lazy(() => import('../pages/LoginPage.jsx').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx').then((m) => ({ default: m.DashboardPage })));
const MeetingDetailPage = lazy(() =>
  import('../pages/MeetingDetailPage.jsx').then((m) => ({ default: m.MeetingDetailPage }))
);

export const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4 py-12">
          <Spinner size={26} />
          <span className="sr-only">Loading…</span>
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/meetings/:id" element={<MeetingDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
