import { useMutation } from "@tanstack/react-query";
import apiClient from "../axios";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";

interface RequestEmailCheckParams {
  email: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useRequestEmailCheck({
  email,
  onSuccess,
  onError,
}: RequestEmailCheckParams) {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/auth/email-duplicate", {
        email,
      });
      return res.data;
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || FALLBACK_ERROR_MESSAGE;

      if (onError) {
        onError(message);
      } else {
        alert(message);
      }
    },
  });
}
