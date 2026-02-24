import { useMutation } from "@tanstack/react-query";
import apiClient from "../axios";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";
import { delay } from "../../utils/delay";

interface VerifyCodeParams {
  email: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useVerifyCode({ email, onSuccess, onError }: VerifyCodeParams) {
  return useMutation({
    mutationFn: async (code: string) => {
      const [res] = await Promise.all([
        apiClient.post("/auth/email-verify", {
          email,
          code,
        }),
        delay(200),
      ]);
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
