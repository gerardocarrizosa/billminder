import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "./modules/common/components/theme-controller";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import LoginScreen from "./modules/login/screens/login";
import SignupScreen from "./modules/signup/screens/signup";
import ProtectedRoute from "./modules/common/components/protected-route";
import Layout from "./modules/common/components/layout";
import HomeScreen from "./modules/home/screens/home-screen";
import UserProfile from "./modules/profile/screens/user-profile";
import UserProfileData from "./modules/profile/components/user-profile-data";
import UserProfileForm from "./modules/profile/components/user-profile.form";
import FavoriteCategoriesManager from "./modules/profile/components/favorite-categories-manager";
import BillsScreen from "./modules/bills/pages/bills.screen";
import BillForm from "./modules/bills/components/bill-form";
import BillsLayout from "./modules/bills/components/bills.layout";
import BillDetailsScreen from "./modules/bills/pages/bill-details.screen";
import PaymentForm from "./modules/bills/components/payment-form";
import { MonthlyBudgetLayout } from "./modules/monthly-budget/pages/monthly-budget-layout";
import MonthlyBudgetMainPage from "./modules/monthly-budget/pages/monthly-budget-main.page";
import AddExpensePage from "./modules/monthly-budget/pages/add-expense.page";
import ExpenseFormPage from "./modules/monthly-budget/pages/add-expense.page";
import LifestyleBudgetPage from "./modules/monthly-budget/pages/lifestyle.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/signup",
    element: <SignupScreen />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "home",
            element: <HomeScreen />,
          },
          {
            path: "bills",
            element: <BillsLayout />,
            children: [
              {
                path: "",
                element: <BillsScreen />,
              },
              {
                path: "create",
                element: <BillForm />,
              },
              {
                path: ":billId",
                element: <BillDetailsScreen />,
              },
              {
                path: ":billId/payments/new",
                element: <PaymentForm />,
              },
              {
                path: ":billId/payments/:paymentId",
                element: <PaymentForm isEditing />,
              },
            ],
          },
          {
            path: "budget",
            element: <MonthlyBudgetLayout />,
            children: [
              {
                path: "",
                element: <MonthlyBudgetMainPage />,
              },
              {
                path: "add-expense",
                element: <AddExpensePage />,
              },
              {
                path: "expense/:expenseId",
                element: <ExpenseFormPage isEditing />,
              },
              {
                path: "lifestyle",
                element: <LifestyleBudgetPage />,
              },
            ],
          },
          {
            path: "profile",
            element: <UserProfile />,
            children: [
              {
                path: "",
                element: <UserProfileData />,
              },
              {
                path: "edit",
                element: <UserProfileForm />,
              },
              {
                path: "favorites",
                element: <FavoriteCategoriesManager />,
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
