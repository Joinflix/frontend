import { useNavigate } from "react-router";

const PasswordSignin = () => {
  const navigate = useNavigate();
  const handleClickNext = () => {
    navigate("code");
  };

  return (
    <div>
      <div className="text-white flex flex-col gap-3 mt-25 mb-50">
        <h1 className="text-3xl font-bold">로그인</h1>
        <span className="text-white/60 tracking-normal">
          지금 친구들과 채팅하며 영상을 즐기세요!
        </span>

        <div className="flex flex-col m-1 gap-3 mt-5 w-full">
          {/* 이메일 주소 */}
          <input
            type="email"
            className="border border-[#816BFF] rounded-xs px-3 py-3"
            placeholder="이메일 주소"
          />
          <button
            className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white py-2.5 px-5 rounded-xs"
            onClick={handleClickNext}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordSignin;
