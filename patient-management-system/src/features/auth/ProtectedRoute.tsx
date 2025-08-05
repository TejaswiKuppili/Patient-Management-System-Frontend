import { JSX } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

// This component is a wrapper that protects routes by checking if the user is logged in.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;