// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { token } = useAuth();

  // If no token, redirect to sign-in page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, render the nested route(s)
  return <Outlet />;
};

export default ProtectedRoute;
