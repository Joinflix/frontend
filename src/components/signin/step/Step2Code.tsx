import { useNavigate } from "react-router";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";

const Step2Code = () => {
  const OTP_BOX_STYLE =
    "!rounded-xs border w-13 h-15 bg-black text-4xl font-extrabold";
  const OTP_MAX_LENGTH = 6;

  const navigate = useNavigate();

  const handleClickChangeEmail = () => {
    navigate("/signin");
  };

  const handleClickResendCode = () => {
    alert("코드 다시 보내기");
  };

  const handleClickPasswordSignin = () => {
    navigate("/signin/password");
  };

  return (
    <div>
      <div className="text-white flex flex-col gap-3 mt-25 mb-50">
        <h1 className="text-3xl font-bold">
          이메일로 보내드린 코드를 입력하세요
        </h1>

        <div className="flex flex-col m-1 gap-10 mt-5 w-full">
          <div className="bg-white/30 rounded-xs px-3 py-3 flex justify-between items-center">
            <span>test@mail.com</span>
            <span
              className="text-xs cursor-pointer underline"
              onClick={handleClickChangeEmail}
            >
              변경
            </span>
          </div>

          <InputOTP maxLength={OTP_MAX_LENGTH}>
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

          <div className="text-white/60 tracking-normal text-sm">
            <p>이 코드는 15분 후에 만료됩니다.</p>
            <p>
              코드를 못 받으셨나요?{" "}
              <span
                className="underline text-white cursor-pointer cursor-"
                onClick={handleClickResendCode}
              >
                코드 다시 받기
              </span>
            </p>
          </div>

          <button
            className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white py-2.5 px-5 rounded-xs"
            onClick={handleClickPasswordSignin}
          >
            비밀번호로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Code;
