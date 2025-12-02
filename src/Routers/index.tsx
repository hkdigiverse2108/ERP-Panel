import { createBrowserRouter } from "react-router-dom";
// import PrivateRoutes from "./PrivateRoutes";
// import PublicRoutes from "./PublicRoutes";

import { PageRoutes } from "./PageRoutes";
import Layout from "../Layout";
// import PageNotFound from "../Components/Common/PageNotFound";

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
  // {
  //   element: <PublicRoutes />,
  //   children: AuthRoutes,
  // },
  // { path: "*", element: <PageNotFound /> },
]);
