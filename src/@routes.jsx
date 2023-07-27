/* eslint-disable react/prop-types */
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ReportPage from "./pages/ReportPage";
import ReportView from "./pages/ViewReport";
import { IsLogin } from "./services/authCheck";

// eslint-disable-next-line react-refresh/only-export-components
const CheckRoute = ({ children }) => {
  const { isIn } = IsLogin();

  return isIn ? children : <Login />;
};

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/report",
    element: (
      <CheckRoute>
        <ReportPage />
      </CheckRoute>
    ),
  },
  {
    path: "/report/view",
    element: (
      <CheckRoute>
        <ReportView />
      </CheckRoute>
    ),
  },
]);

export default routes;
