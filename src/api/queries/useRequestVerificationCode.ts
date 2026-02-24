import { useMutation } from "@tanstack/react-query";
import apiClient from "../axios";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";
import { delay } from "../../utils/delay";

interface RequestCodeParams {
  email: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useRequestVerificationCode({
  email,
  onSuccess,
}: RequestCodeParams) {
  return useMutation({
    mutationFn: async () => {
      const [res] = await Promise.all([
        apiClient.post("/auth/email-send", { email }),
        delay(400),
      ]);
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
