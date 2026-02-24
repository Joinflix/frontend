import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import apiClient from "../axios";

export const useSignout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationKey: ["signout"],
    mutationFn: async () => {
      const res = await apiClient.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      clearAuth();
      navigate("/", { replace: true });
    },
    onError: () => {
      alert("error signing out");
    },
  });
};
