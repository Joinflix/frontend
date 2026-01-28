import { useMutation } from "@tanstack/react-query";
import axiosClient from "../axiosClient";
import { FALLBACK_ERROR_MESSAGE } from "../../global/const/error";

interface RequestSigninParams {
  email: string;
  password: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useRequestSignin({
  email,
  password,
  onSuccess,
}: RequestSigninParams) {
  return useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
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
