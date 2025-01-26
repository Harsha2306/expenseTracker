import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import NotFoundPage from "./components/NotFoundPage";
import HomePage from "./pages/HomePage";
import AllTransactionsPage from "./pages/AllTransactionsPage";
import TransactionForm from "./pages/TransactionForm";
import ToastList from "./components/ToastList";

function App() {
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <SignupForm />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/transactions",
      element: <AllTransactionsPage />,
    },
    {
      path: "/transaction",
      element: <TransactionForm />,
    },
    {
      path: "/transaction/:transactionId",
      element: (
        <>
          <TransactionForm />
          <ToastList />
        </>
      ),
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;