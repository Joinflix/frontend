import { useLocation, useNavigate } from "react-router";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";
import { ShieldCheck } from "lucide-react";
import { useRequestVerificationCode } from "../../../api/queries/useRequestVerificationCode";
import CodeLoadingOverlay from "./LoadingOverlay";
import { useEffect, useState } from "react";
import { useVerifyCode } from "../../../api/queries/useVerifyCode";
import { Spinner } from "../../ui/spinner";

const OTP_BOX_STYLE =
  "!rounded-xs border w-17 h-18 border-[#816BFF] bg-[#816BFF]/10 text-5xl font-extrabold text-[#816BFF]";
const OTP_MAX_LENGTH = 6;

export const Step1ConfirmCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");

  const email = location.state?.email || "";

  const handleClickChangeEmail = () => {
    navigate("/");
  };

  const { mutateAsync, isPending } = useRequestVerificationCode({
    email,
    onSuccess: () => {
      alert(`${email} 계정으로 인증 번호를 다시 보내드렸습니다.`);
    },
  });

  const handleClickResendCode = () => {
    mutateAsync();
  };

  const { mutateAsync: verifyCode, isPending: isVerifyingCode } = useVerifyCode(
    {
      email,
      onSuccess: () => {
        navigate("/signup/step2-set-password", { state: { email } });
      },
      onError: (message) => {
        alert(message);
        setOtp("");
      },
    },
  );

  const handleClickConfirmCode = () => {};

  useEffect(() => {
    if (otp.length === OTP_MAX_LENGTH) {
      verifyCode(otp);
    }
  }, [otp, verifyCode]);

  return (
    <div className="relative">
      <div className="w-full max-w-md mt-40 flex flex-col gap-y-5">
        {/* Header Container */}
        <div className="flex items-center gap-x-4">
          {/* 1. The Icon */}
          <div className="flex shrink-0 items-center justify-center size-14 rounded-full bg-[#816BFF]/10">
            <ShieldCheck className="size-7 stroke-[#816BFF] stroke-[1.5]" />
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
              인증 코드 확인
            </h1>
          </div>
        </div>

        {/*2. step content */}
        <div>
          <div className="mt-3 font-light">
            <p>
              아래 메일 주소로 보내드린{" "}
              <span className="font-bold">6자리 인증 코드</span>를 입력해주세요.
            </p>
            <p>
              보내드린 인증 코드는 <span className="font-bold">15분 후</span>에
              만료됩니다.
            </p>
          </div>

          <div className="flex flex-col m-1 gap-5 mt-5 w-full">
            <div className="bg-gray-200/80 rounded-xs px-4 py-3 flex justify-between items-center">
              <span>{email}</span>
              <span
                className="text-xs cursor-pointer underline"
                onClick={handleClickChangeEmail}
              >
                변경
              </span>
            </div>

            <div className="flex justify-center w-full mt-5">
              <InputOTP
                maxLength={OTP_MAX_LENGTH}
                value={otp}
                onChange={setOtp}
                autoFocus
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: OTP_MAX_LENGTH }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={OTP_BOX_STYLE}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/*3. button */}
            <div className="w-full max-w-md mt-2">
              <button
                className={`text-white text-lg font-bold rounded-[0.2rem] w-full flex items-center justify-center py-3 transition
              ${
                isVerifyingCode || otp.length < OTP_MAX_LENGTH
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#816BFF] hover:bg-[#5e42c8] cursor-pointer"
              }
              `}
                onClick={handleClickConfirmCode}
              >
                {isVerifyingCode ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="size-5 stroke-3" />
                    인증 코드 검증 중
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    인증 코드 제출
                  </span>
                )}
              </button>
            </div>

            <div className="tracking-normal text-sm mb-30 text-right">
              <p>
                코드를 못 받으셨나요?{" "}
                <span
                  className="underline cursor-pointer hover:font-semibold"
                  onClick={handleClickResendCode}
                >
                  코드 다시 받기
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {isPending && <CodeLoadingOverlay message="코드 전송 중" />}
    </div>
  );
};
