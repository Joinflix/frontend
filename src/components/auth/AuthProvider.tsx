import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";
import apiClient from "../../api/axios";
import { removeBearerHeader } from "../../utils/removeBearerHeader";
import SpinnerPage from "../../pages/SpinnerPage";

const AuthProvider = () => {
  const navigate = useNavigate();

  const { accessToken, setAuth, clearAuth, isAuthChecked } = useAuthStore();

  useEffect(() => {
    const refresh = async () => {
      //1. access token 존재 시, return
      if (accessToken) return;

      // 2. access token 부재 시, refresh 시도
      try {
        const res = await apiClient.post("/auth/reissue");

        const newAccessToken = res.headers["authorization"];
        if (!newAccessToken) throw new Error("No access token");

        const pureNewAccessToken = removeBearerHeader(newAccessToken);
        setAuth(pureNewAccessToken);

        // TODO: user 정보 store 관리 여부 확인
        // const payload = decodeAccessToken(newAccessToken);
        // if (payload) setAuth(newAccessToken);
      } catch (error) {
        console.error("인증 실패:", error);
        clearAuth();
        navigate("/signin", { replace: true });
      }
    };

    refresh();
  }, [accessToken, setAuth, clearAuth, navigate]);

  if (!isAuthChecked) return <SpinnerPage />;
  return <Outlet />;
};

export default AuthProvider;
