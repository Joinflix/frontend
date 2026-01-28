import { Plans } from "./Plans";

export const Step4SelectPlan = () => {
  return (
    <div>
      <div className="w-full max-w-full mt-10 flex flex-col gap-y-5 items-center">
        <div className="w-full">
          <div className="text-sm">
            <span>
              <strong>2</strong>/<strong>3</strong>단계
            </span>
          </div>
          <h1 className="text-3xl font-semibold leading-snug tracking-wide">
            원하는 멤버십을 선택하세요
          </h1>
        </div>

        <div className="flex flex-row gap-x-3">
          <Plans />
        </div>

        {/*3. button */}
        <div className="w-full max-w-[50%] mt-2 mb-10">
          <button className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-xl rounded-[0.2rem] w-full flex items-center justify-center py-2">
            다음
          </button>
        </div>
      </div>
    </div>
  );
};
