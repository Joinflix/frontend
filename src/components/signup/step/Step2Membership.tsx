import { CircleCheck } from "lucide-react";
import { useNavigate } from "react-router";
import CheckList from "./CheckList";

const CHECK_LIST_DATA = [
  "무약정으로 언제든지 해지하실 수 있습니다.",
  "하나의 요금으로 즐기는 끝없는 콘텐츠의 세계.",
  "가지고 계신 모든 디바이스에서 조인플렉스를 즐겨보세요.",
];

export const Step2Membership = () => {
  const navigate = useNavigate();
  const handleClickButton = () => {
    navigate("/signup/step2-select-plan");
  };

  return (
    <div>
      <div className="w-full max-w-md mt-10 flex flex-col gap-y-5">
        {/*1. icon */}
        <div className="flex flex-row items-center">
          <CircleCheck className="size-15 stroke-[#816BFF] stroke-[0.8]" />
        </div>

        {/*2. step content */}
        <div>
          <div className="text-sm">
            <span>
              <strong>2</strong>/<strong>3</strong>단계
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold leading-snug tracking-wide">
              멤버십 선택
            </h1>
          </div>
          <div className="mt-3 font-light flex flex-col gap-y-3">
            {CHECK_LIST_DATA.map((element, index) => (
              <CheckList key={index} item={element} />
            ))}
          </div>
        </div>

        {/*3. button */}
        <div className="w-full max-w-md mt-2 mb-10">
          <button
            className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-xl rounded-[0.2rem] w-full flex items-center justify-center py-3"
            onClick={handleClickButton}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};
