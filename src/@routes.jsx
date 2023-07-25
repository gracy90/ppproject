import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ReportPage from "./pages/ReportPage";

const routes = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },{
        path: "/login",
        element: <Login />,
      },{
        path: "/signup",
        element: <Signup />,
      },{
        path: "/report",
        element: <ReportPage />,
      }
  ]);

  export default routes