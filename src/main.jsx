// React
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// React-Router
import { RouterProvider } from 'react-router';
import router from './routes/router';
// CSS
import './index.css';
// AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
import AuthProvider from './contexts/Authentication/AuthProvider';
AOS.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="font-urbanist">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  </StrictMode>
);
