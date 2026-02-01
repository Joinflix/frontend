import { Navigate, Outlet } from "react-router";
import { useNotification } from "../hooks/useNotification";
import SpinnerPage from "../pages/SpinnerPage";
import { useAuthStore } from "../store/useAuthStore";

const AuthenticatedRoutes = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);

  useNotification();

  if (!isAuthChecked) {
    return <SpinnerPage />;
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default AuthenticatedRoutes;
