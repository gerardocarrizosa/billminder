import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './modules/common/components/theme-controller';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './modules/login/screens/login';
import SignupScreen from './modules/signup/screens/signup';
import ProtectedRoute from './modules/common/components/protected-route';
import Layout from './modules/common/components/layout';
import HomeScreen from './modules/home/screens/home-screen';
import UserProfile from './modules/profile/screens/user-profile';
import UserProfileData from './modules/profile/components/user-profile-data';
import UserProfileForm from './modules/profile/components/user-profile.form';
import BillsScreen from './modules/bills/bills.screen';
import BillForm from './modules/bills/components/bill-form';

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
            path: 'bills',
            element: <BillsScreen />,
            // children: [
            // ],
          },
          {
            path: 'bills/create',
            element: <BillForm />,
          },
          {
            path: 'profile',
            element: <UserProfile />,
            children: [
              {
                path: '',
                element: <UserProfileData />,
              },
              {
                path: 'edit',
                element: <UserProfileForm />,
              },
            ],
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
