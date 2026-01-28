import { useMutation } from "@tanstack/react-query";
import axiosClient from "../axiosClient";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";

interface VerifyCodeParams {
  email: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useVerifyCode({ email, onSuccess, onError }: VerifyCodeParams) {
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await axiosClient.post("/auth/email/verify", {
        email,
        code,
      });
      return res.data;
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || FALLBACK_ERROR_MESSAGE;
      if (onError) onError(message);
    },
  });
}
