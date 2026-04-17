import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader.jsx';

export const MainLayout = () => {
  return (
    <div className="layout">
      <AppHeader />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};
