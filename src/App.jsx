import { AppRoutes } from './routes/AppRoutes.jsx';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    </>
  );
};

export default App;
