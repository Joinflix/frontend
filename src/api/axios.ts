import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../global/const/api";
import { useAuthStore } from "../store/useAuthStore";

// Type for the pending requests in the queue
interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Helper to process the queue once the refresh is done
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

const addBearerHeader = (token: string) =>
  token.startsWith("Bearer ") ? token : `Bearer ${token}`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers["Authorization"] = addBearerHeader(token);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retryAuth?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retryAuth) {
      // If a refresh is already happening, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = addBearerHeader(
              token as string,
            );
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retryAuth = true;
      isRefreshing = true;

      try {
        const res = await refreshClient.post("/auth/reissue");
        const authHeader =
          res.headers["authorization"] || res.headers["Authorization"];
        const newAccessToken = authHeader?.replace("Bearer ", "");

        if (newAccessToken) {
          useAuthStore.getState().setAuth(newAccessToken);

          // Resolve all other requests that were waiting
          processQueue(null, newAccessToken);

          originalRequest.headers["Authorization"] =
            addBearerHeader(newAccessToken);
          return apiClient(originalRequest);
        }
        throw new Error("No access token in response");
      } catch (refreshError) {
        // Reject all waiting requests if refresh fails
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        if (!window.location.pathname.includes("/signin")) {
          window.location.href = "/signin";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
