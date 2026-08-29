import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore.js";

const ProtectedRoute = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const authReady = useAuthStore((state) => state.authReady);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    if (!authReady) {
      initializeAuth();
    }
  }, [authReady, initializeAuth]);

  if (!authReady) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
