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
      const res = await axiosClient.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true
        });

      // Authorization 헤더에서 토큰 추출하여 저장 (친구 API용)
      const authHeader = res.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        localStorage.setItem("accessToken", token);
      }
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
