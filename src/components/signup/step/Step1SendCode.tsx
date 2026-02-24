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
      <div className="w-full max-w-sm mt-50 flex flex-col gap-y-5">
        {/* Header Container */}
        <div className="flex items-center gap-x-4">
          {/* 1. The Icon */}
          <div className="flex shrink-0 items-center justify-center size-14 rounded-full bg-[#816BFF]/10">
            <MailCheck className="size-7 stroke-[#816BFF] stroke-[1.5]" />
          </div>

          {/* 2. Text Content Stack */}
          <div className="flex flex-col justify-center">
            <div className="text-sm text-black">
              <span className="tracking-wider">
                <strong className="text-black">1</strong>/<strong>3</strong>
                단계
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              이메일 인증
            </h1>
          </div>
        </div>

        {/*2. step content */}
        <div>
          <div className="mt-3 font-light">
            <span>
              사용자의 이메일 계정을 인증하기 위해{" "}
              <span className="font-bold">{email}</span>로{" "}
              <span className="font-bold">6자리 코드</span>를 보내드립니다.
            </span>
          </div>

          {/*3. button */}
          <div className="w-full max-w-md mt-10 mb-60">
            <button
              disabled={isPending}
              className={`text-white text-lg font-bold rounded-[0.2rem] w-full flex items-center justify-center py-3 transition
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
    </div>
  );
};
