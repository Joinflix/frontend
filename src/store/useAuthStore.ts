import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "WITHDRAWN";

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  nickname: string;
  status: UserStatus;
  iat: number;
  exp: number;
};

type AuthState = {
  isAuthChecked: boolean;
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string | null) => void;
  clearAuth: () => void;
};

export type User = {
  userId: number;
  email: string;
  role: string;
  nickname: string;
  status: UserStatus;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthChecked: false,
      accessToken: null,
      user: null,
      setAuth: (token) => {
        if (!token) {
          set({ accessToken: null, user: null, isAuthChecked: true });
          return;
        }

        try {
          const decoded = jwtDecode<JwtPayload>(token);

          const user: User = {
            userId: Number(decoded.sub),
            email: decoded.email,
            role: decoded.role,
            nickname: decoded.nickname,
            status: decoded.status,
          };

          set({
            accessToken: token,
            user: user,
            isAuthChecked: true,
          });
        } catch (error) {
          console.error("Failed to decode token:", error);
          set({ accessToken: null, user: null, isAuthChecked: true });
        }
      },
      clearAuth: () =>
        set({
          accessToken: null,
          user: null,
          isAuthChecked: true,
        }),
    }),
    { name: "AuthStore" },
  ),
);
