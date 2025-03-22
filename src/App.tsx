import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import HomeScreen from './modules/home/screens/home-screen';
import { ThemeProvider } from './modules/common/components/theme-controller';
import { Toaster } from 'react-hot-toast';
import UserProfile from './modules/profile/screens/user-profile';
import LoginScreen from './modules/login/screens/login';
import ProtectedRoute from './modules/common/components/protected-route';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={'/home'} replace />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/signup',
    element: <div>Signup</div>,
  },
  {
    path: '/',
    // element: <HomeScreen />,
    element: <ProtectedRoute />,
    children: [
      {
        path: 'home',
        element: <HomeScreen />,
      },
      {
        path: 'profile',
        element: <UserProfile />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Toaster />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
