import { useState } from "react";
import { useNavigate } from "react-router";
import { TypingAnimation } from "../ui/typing-animation";

const LandingBody = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleClickSignup = () => {
    if (!email) return alert("이메일을 입력해주세요!");
    navigate("/signup/step1-send-code", { state: { email } });
  };

  return (
    <>
      <div className="mt-30 mb-25 flex flex-col items-center  text-white py-10">
        {/* CTA */}
        <div className="text-center space-y-2">
          <div>
            <TypingAnimation
              className="text-2xl font-bold"
              loop={true}
              pauseDelay={10_000}
              cursorStyle="underscore"
            >
              영화, 시리즈 등을 무제한으로
            </TypingAnimation>
          </div>
          <p className="text-xs">
            7,000원으로 시작하세요. 멤버십은 언제든지 해지 가능합니다.
          </p>
          <p className="text-xs">
            시청할 준비가 되셨나요? 멤버십을 등록하거나 재시작하려면 이메일
            주소를 입력하세요.
          </p>
        </div>
        {/* email input */}
        <div className="flex m-1 gap-1.5 mt-5">
          <input
            type="email"
            className="border border-gray-700 rounded-xs px-3 text-xs"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-sm py-2.5 px-5 rounded-xs"
            onClick={handleClickSignup}
          >
            시작하기 &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default LandingBody;
