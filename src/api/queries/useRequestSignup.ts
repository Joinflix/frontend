import { useMutation } from "@tanstack/react-query";
import apiClient from "../axios";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";

interface RequestSignupParams {
  email: string;
  password: string;
  nickname: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useRequestSignup({
  email,
  password,
  nickname,
  onSuccess,
}: RequestSignupParams) {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/auth/signup", {
        email,
        password,
        nickname,
      });
      return res.data;
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || FALLBACK_ERROR_MESSAGE);
    },
  });
}
