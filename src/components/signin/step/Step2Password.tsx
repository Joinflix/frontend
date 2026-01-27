import { useNavigate } from "react-router";

const Step2Password = () => {
  const navigate = useNavigate();

  const handleClickChangeEmail = () => {
    navigate("/signin");
  };

  const handleClickCodeSignin = () => {
    navigate("/signin/code");
  };

  const handleClickLogin = () => {
    navigate("/browsing");
  };

  return (
    <div>
      <div className="text-white flex flex-col gap-3 mt-25 mb-50">
        <h1 className="text-3xl font-bold">비밀번호를 입력하세요.</h1>

        <div className="flex flex-col m-1 gap-5 mt-5 w-full">
          <div className="bg-white/30 rounded-xs px-3 py-2.5 flex justify-between items-center">
            <span>test@mail.com</span>
            <span
              className="text-xs cursor-pointer underline"
              onClick={handleClickChangeEmail}
            >
              변경
            </span>
          </div>
          <input
            type="password"
            className="border border-gray-700 rounded-xs px-3 py-2.5 bg-black"
            placeholder="비밀번호"
          />

          <button
            className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white py-2.5 px-5 rounded-xs"
            onClick={handleClickLogin}
          >
            로그인
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/40" />
            <span className="text-white tracking-normal text-sm text-center font-thin">
              또는
            </span>
            <div className="flex-1 h-px bg-white/40" />
          </div>

          <button
            className="bg-white/30 cursor-pointer hover:bg-white/20 text-white py-2.5 px-5 rounded-xs"
            onClick={handleClickCodeSignin}
          >
            로그인 코드 사용하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Password;
