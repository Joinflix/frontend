import { useMutation } from "@tanstack/react-query";
import axiosClient from "../axiosClient";

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
      const message =
        err.response?.data?.message || "인증 코드가 올바르지 않습니다.";
      if (onError) onError(message);
    },
  });
}
