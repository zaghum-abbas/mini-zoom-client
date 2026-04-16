import { AppRoutes } from './routes/AppRoutes.jsx';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </>
  );
}
