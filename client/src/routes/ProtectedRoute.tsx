import { ReactNode } from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

import { useGetMeQuery } from "@/app/features/user/userApi";
import { useAppSelector } from "@/app/hooks";
import { selectAuthor } from "@/app/features/auth/authSlice";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const author = useAppSelector(selectAuthor);

  const isAuthorExists = author !== null;

  const isLoggedIn = Cookies.get("logged_in") === "true";

  const location = useLocation();

  const skip = isAuthorExists && isLoggedIn;

  const { data, isLoading, isFetching } = useGetMeQuery(null, {
    skip: skip,
    refetchOnMountOrArgChange: true,
  });

  const loading = isLoading || isFetching;

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  let role: string | null = null;

  if (author && isLoggedIn) {
    role = author.role;
  } else if (data) {
    role = data.data.data.role;
  }

  if (role && allowedRoles.includes(role)) {
    return children;
  } else if (role) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Navigate to="/sign-in" state={{ from: location }} replace />;
};

export default ProtectedRoute;
