// React-Router
import { createBrowserRouter } from 'react-router';
// Layouts
import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../layouts/AuthLayout';
// Pages
import { About } from '../pages/About';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import NotFound from '../pages/NotFound';
import { Home } from '../pages/Home/Home';
import Coverage from '../pages/Coverage';
import Services from '../pages/Services';
import Pricing from '../pages/Pricing';
import Rider from '../pages/Rider';
import AddParcelForm from '../pages/SendParcel';
import PrivateRoutes from './PrivateRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <Services /> },
      { path: 'coverage', element: <Coverage /> },
      {
        path: 'sendParcel',
        element: (
          <PrivateRoutes>
            <AddParcelForm />
          </PrivateRoutes>
        ),
        loader: () => fetch('./warehouse.json'),
      },
      {
        path: 'about',
        element: <About />,
        loader: () => fetch('http://localhost:3000/games'),
      },
      { path: 'pricing', element: <Pricing /> },
      { path: 'rider', element: <Rider /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
