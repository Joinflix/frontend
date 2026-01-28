import { useMutation } from "@tanstack/react-query";
import axiosClient from "../axiosClient";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";

interface RequestNicknameCheckParams {
  nickname: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useRequestNicknameCheck({
  nickname,
  onSuccess,
  onError,
}: RequestNicknameCheckParams) {
  return useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post("/auth/nickname-duplicate", {
        nickname,
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
