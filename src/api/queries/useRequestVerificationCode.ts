import { useMutation } from "@tanstack/react-query";
import apiClient from "../axios";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";

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
      const res = await apiClient.post("/auth/email-send", { email });
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
