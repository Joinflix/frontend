import { useMutation } from "@tanstack/react-query";
import axiosClient from "../axiosClient";

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
      const res = await axiosClient.post("/auth/email/send", { email });
      return res.data;
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      alert(
        err.response?.data?.message ||
          "알 수 없는 에러가 발생했습니다. 고객센터에 문의해주세요.",
      );
    },
  });
}
