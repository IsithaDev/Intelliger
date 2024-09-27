import { Navigate, Outlet } from "react-router-dom";

import useAuth from "@/hooks/use-auth";

interface ProtectedRouteProps {
  requiredRoutes: string[];
}

const ProtectedRoute = ({ requiredRoutes }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!requiredRoutes.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
