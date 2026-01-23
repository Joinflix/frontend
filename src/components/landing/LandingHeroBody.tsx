const LandingBody = () => {
  return (
    <>
      <div className="mt-30 mb-25 flex flex-col items-center  text-white py-10">
        {/* CTA */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">영화, 시리즈 등을 무제한으로</h1>
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
          />
          <button className="bg-[#E50914] cursor-pointer hover:bg-[#B12A25] text-white text-sm py-2.5 px-5 rounded-xs">
            시작하기 &gt;{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default LandingBody;
