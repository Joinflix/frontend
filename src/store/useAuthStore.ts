import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthState = {
  isAuthChecked: boolean;
  accessToken: string | null;
  setAuth: (token: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthChecked: false,
      accessToken: null,
      setAuth: (token) =>
        set({
          accessToken: token,
          isAuthChecked: true,
        }),
      clearAuth: () =>
        set({
          accessToken: null,
          isAuthChecked: true,
        }),
    }),
    { name: "AuthStore" },
  ),
);
