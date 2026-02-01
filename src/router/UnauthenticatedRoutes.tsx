import { Navigate, Outlet } from "react-router";
import SpinnerPage from "../pages/SpinnerPage";
import { useAuthStore } from "../store/useAuthStore";

const UnauthenticatedRoutes = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);

  if (!isAuthChecked) {
    return <SpinnerPage />;
  }

  if (accessToken) {
    return <Navigate to="/browsing" replace />;
  }

  return <Outlet />;
};

export default UnauthenticatedRoutes;
