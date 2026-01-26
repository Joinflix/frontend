export const SignupBody = () => {
  return (
    <div>
      <div className="w-full max-w-md mt-10 flex flex-col gap-y-1">
        <div className="text-sm">
          <span>
            <strong>1</strong>/<strong>3</strong>단계
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-snug tracking-wide">
            <p>다시 찾아주셔서 감사합니다! </p>
            <p>조인플릭스 가입 절차는 간단합니다. </p>
          </h1>
        </div>
        <div className="mt-3 font-light">
          <span>비밀번호를 입력하면 바로 시청하실 수 있습니다.</span>
        </div>
      </div>
      <div className="w-full max-w-md flex flex-col gap-y-2">
        <div className="text-xs">
          <span>이메일 주소</span>
        </div>
        <div className="tracking-wide font-semibold">
          <span>test@mail.com</span>
        </div>
        <input
          type="password"
          placeholder="비밀번호"
          className="border border-gray-700 rounded-[0.2rem] w-full py-2 px-3"
        ></input>
      </div>
      <div className="w-full max-w-md mt-2">
        <p>비밀번호를 잊으셨나요?</p>
      </div>
      <div className="w-full max-w-md mt-2 mb-10">
        <button className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-xl rounded-[0.2rem] w-full flex items-center justify-center py-3">
          다음
        </button>
      </div>
    </div>
  );
};
