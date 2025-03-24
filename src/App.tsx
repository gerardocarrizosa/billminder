import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import HomeScreen from './modules/home/screens/home-screen';
import { ThemeProvider } from './modules/common/components/theme-controller';
import { Toaster } from 'react-hot-toast';
import Layout from './modules/common/components/layout';
import ProtectedRoute from './modules/common/components/protected-route';
import UserProfile from './modules/profile/screens/user-profile';
import LoginScreen from './modules/login/screens/login';
import { AuthProvider } from './context/AuthContext';
import SignupScreen from './modules/signup/screens/signup';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/signup',
    element: <SignupScreen />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
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
