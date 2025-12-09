import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import NotFound from "../Pages/NotFound";
import { AuthRoutes, PageRoutes } from "./PageRoutes";

export const Router = createBrowserRouter([
  {
    // element: <PrivateRoutes />,
    children: [
      {
        element: <Layout />,
        children: PageRoutes,
      },
    ],
  },
  {
    // element: <PublicRoutes />,
    children: AuthRoutes,
  },
  { path: "*", element: <NotFound /> },
]);
