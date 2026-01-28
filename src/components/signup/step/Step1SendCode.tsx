import { useMutation } from "@tanstack/react-query";
import { Laptop, Monitor } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import axiosClient from "../../../api/axiosClient";

export const Step1SendCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post("/auth/email/send", { email });
      return res.data;
    },
    onSuccess: () => {
      alert(`인증번호가 전송되었습니다. ${email} 수신함을 확인해주세요.`);
      navigate("/signup/step1-confirm-code");
    },
    onError: (err) => {
      alert(
        err.response?.data?.message ||
          "알 수 없는 에러가 발생했습니다. 고객센터에 문의해주세요.",
      );
    },
  });

  const handleClickSendCode = () => {
    mutateAsync();
    //TODO: 성공 시에 navigate해서 code 인증으로 이동
  };

  return (
    <div>
      <div className="w-full max-w-md mt-10 flex flex-col gap-y-5">
        {/*1. icon */}
        <div className="flex flex-row items-center">
          <Laptop className="size-20 stroke-[#816BFF] stroke-[0.8]" />
          <Monitor className="size-18 stroke-[#816BFF] stroke-[0.8]" />
        </div>

        {/*2. step content */}
        <div>
          <div className="text-sm">
            <span>
              <strong>1</strong>/<strong>3</strong>단계
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold leading-snug tracking-wide">
              계정 설정 마무리하기
            </h1>
          </div>
          <div className="mt-3 font-light">
            <span>
              다양한 디바이스에서 언제든지 비밀번호 없이 조인플렉스를 이용하실
              수 있도록 <span className="font-bold">{email}</span> 주소로{" "}
              <span className="font-bold">6자리 인증 코드</span>를
              보내드리겠습니다.
            </span>
          </div>
        </div>

        {/*3. button */}
        <div className="w-full max-w-md mt-2 mb-10">
          <button
            disabled={isPending}
            className={`text-white text-xl rounded-[0.2rem] w-full flex items-center justify-center py-3 transition
    ${
      isPending
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#816BFF] hover:bg-[#5e42c8] cursor-pointer"
    }
  `}
            onClick={handleClickSendCode}
          >
            인증 코드 받기
          </button>
        </div>
      </div>
    </div>
  );
};
