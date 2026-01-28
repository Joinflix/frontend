import { MailCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Spinner } from "../../ui/spinner";
import { useRequestVerificationCode } from "../../../api/queries/useRequestVerificationCode";

export const Step1SendCode = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email || "";

  const { mutateAsync, isPending } = useRequestVerificationCode({
    email,
    onSuccess: () =>
      navigate("/signup/step1-confirm-code", {
        state: { email },
        replace: true,
      }),
  });

  const handleClickSendCode = () => {
    mutateAsync();
  };

  return (
    <div>
      <div className="w-full max-w-sm mt-10 flex flex-col gap-y-5">
        {/*1. icon */}
        <div className="flex flex-row items-center">
          <MailCheck className="size-17 stroke-[#816BFF] stroke-1" />
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
              이메일 인증
            </h1>
          </div>
          <div className="mt-3 font-light">
            <span>
              사용자의 이메일 계정을 인증하기 위해{" "}
              <span className="font-bold">{email}</span>로{" "}
              <span className="font-bold">6자리 코드</span>를 보내드립니다.
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
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-5 stroke-3" />
                인증 코드 전송 중
              </span>
            ) : (
              "인증 코드 받기"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
