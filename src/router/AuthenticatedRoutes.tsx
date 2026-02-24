import { Navigate, Outlet, useLocation } from "react-router";
import { useNotification } from "../hooks/useNotification";
import SpinnerPage from "../pages/SpinnerPage";
import { useAuthStore } from "../store/useAuthStore";

const AuthenticatedRoutes = () => {
  const location = useLocation();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const userStatus = useAuthStore((state) => state.user?.status);

  useNotification();

  if (!isAuthChecked) {
    return <SpinnerPage />;
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  const isOnboardingRoute = location.pathname.startsWith("/signup/step4");

  if (userStatus === "PENDING" && !isOnboardingRoute) {
    return <Navigate to="/signup/step4-list-membership" replace />;
  }

  if (userStatus === "ACTIVE" && isOnboardingRoute) {
    return <Navigate to="/browsing" replace />;
  }

  return <Outlet />;
};

export default AuthenticatedRoutes;
