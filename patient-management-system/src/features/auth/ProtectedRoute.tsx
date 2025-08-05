import { JSX } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../../components/common/Loader/Spinner";

// This component is a wrapper that protects routes by checking if the user is logged in.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, loading } = useAuth();
  // const location = useLocation();
  // const publicPaths = ['/login', '/register'];
  // const isPublic = publicPaths.includes(location.pathname);

  if (loading) {
    return <Spinner />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;