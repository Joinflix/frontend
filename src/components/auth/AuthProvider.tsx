import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import SpinnerPage from "../../pages/SpinnerPage";
import { refreshClient } from "../../api/axios";

const AuthProvider = () => {
  const navigate = useNavigate();
  const { accessToken, setAuth, isAuthChecked } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // ✅ If we already have a token, just mark as initialized
      if (accessToken) {
        setIsInitializing(false);
        return; // isAuthChecked is already true from setAuth()
      }

      try {
        const res = await refreshClient.post("/auth/reissue");

        const authHeader =
          res.headers["authorization"] || res.headers["Authorization"];
        const newAccessToken = authHeader?.replace("Bearer ", "");

        if (newAccessToken) {
          setAuth(newAccessToken);
        } else {
          throw new Error("No access token");
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setAuth(null); // ✅ This also sets isAuthChecked = true
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []); // ✅ Only run once on mount

  // ✅ Wait for both initialization AND auth check
  if (isInitializing || !isAuthChecked) return <SpinnerPage />;

  return <Outlet />;
};

export default AuthProvider;
