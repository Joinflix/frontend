import { useLocation, useNavigate } from "react-router";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";
import { ShieldCheck } from "lucide-react";
import { useRequestVerificationCode } from "../../../api/queries/useRequestVerificationCode";
import CodeLoadingOverlay from "./LoadingOverlay";
import { useEffect, useState } from "react";
import { useVerifyCode } from "../../../api/queries/useVerifyCode";

const OTP_BOX_STYLE =
  "!rounded-xs border w-13 h-15 border-[#816BFF] bg-[#816BFF]/10 text-4xl font-extrabold text-[#816BFF]";
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

  const { mutateAsync: verifyCode, isPending: isVerifying } = useVerifyCode({
    email,
    onSuccess: () => {
      navigate("/signup/step2-set-password");
    },
    onError: (message) => {
      alert(message);
      setOtp("");
    },
  });

  useEffect(() => {
    if (otp.length === OTP_MAX_LENGTH) {
      verifyCode(otp);
    }
  }, [otp, verifyCode]);

  return (
    <div className="relative">
      <div className="w-full max-w-md mt-15 flex flex-col gap-y-5">
        {/*1. icon */}
        <div className="flex flex-row items-center">
          <ShieldCheck className="size-15 stroke-[#816BFF] stroke-1" />
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
              인증 코드 확인
            </h1>
          </div>
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

            <div className="flex justify-center w-full">
              <InputOTP
                maxLength={OTP_MAX_LENGTH}
                value={otp}
                onChange={setOtp}
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

            <div className="tracking-normal text-sm mt-5 mb-10 text-right">
              <p>
                코드를 못 받으셨나요?{" "}
                <span
                  className="underline cursor-pointer cursor-"
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
