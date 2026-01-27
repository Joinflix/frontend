import { MailCheck } from "lucide-react";
import { useNavigate } from "react-router";

export const Step1ConfirmCode = () => {
  const navigate = useNavigate();
  const handleClickButton = () => {
    navigate("/signup/step2-membership");
  };
  return (
    <div>
      <div className="w-full max-w-md mt-10 flex flex-col gap-y-5">
        {/*1. icon */}
        <div className="flex flex-row items-center">
          <MailCheck className="size-20 stroke-[#816BFF] stroke-[0.8]" />
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
              이메일 수신함을 확인하세요
            </h1>
          </div>
          <div className="mt-3 font-light">
            <span>
              test@mail.com 주소로 가입 링크를 보내드렸습니다. 이메일 내의
              링크를 탭하여 계정 설정을 완료하세요.
            </span>
          </div>
        </div>

        {/*3. button */}
        <div className="w-full max-w-md mt-2 mb-10">
          <button
            className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-xl rounded-[0.2rem] w-full flex items-center justify-center py-3"
            onClick={handleClickButton}
          >
            링크 다시 받기
          </button>
        </div>
      </div>
    </div>
  );
};
