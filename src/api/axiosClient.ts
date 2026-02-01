import axios from "axios";
import { API_BASE_URL } from "../global/const/api";
import { useAuthStore } from "../store/useAuthStore";

const addBearerHeader = (token: string) =>
  token.startsWith("Bearer ") ? token : `Bearer ${token}`;

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 1.REQUEST INTERCEPTOR: 모든 request에 access token 주입
axiosClient.interceptors.request.use(
  async (config) => {
    // const xsrfToken = getCookie("XSRF-TOKEN");
    // if (xsrfToken) {
    //   config.headers["X-XSRF-TOKEN"] = xsrfToken;
    // }
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers["Authorization"] = addBearerHeader(token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2.RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  // pass successful responses through
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    //Handle 403 response from the BE
    // if (
    //   error?.response?.status === 403 &&
    //   error?.response?.data.error.includes("CSRF") &&
    //   !originalRequest._retryCsrf
    // ) {
    //   originalRequest._retryCsrf = true;
    //   await refreshClient.get("/auth/csrf");
    //   return axiosClient(error.config);
    // }

    //Handle 401 AccessToken Expiration
    if (error?.response?.status === 401 && !originalRequest._retryAuth) {
      originalRequest._retryAuth = true;
      try {
        const res = await refreshClient.post("/auth/reissue");
        const newAccessToken = res.headers["authorization"]?.replace(
          "Bearer ",
          "",
        );
        if (newAccessToken) {
          useAuthStore.getState().setAuth(newAccessToken);
          originalRequest.headers["Authorization"] =
            addBearerHeader(newAccessToken);
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
