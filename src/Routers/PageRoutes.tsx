import { ROUTES } from "../Constants";
import Dashboard from "../Pages/Dashboard";

export const PageRoutes = [
  { path: ROUTES.HOME, element: <Dashboard /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
];

// export const AuthRoutes = [{ path: ROUTES.HOME, element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> }];
