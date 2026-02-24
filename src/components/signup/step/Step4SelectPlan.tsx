import { useState } from "react";
import { Plans } from "./Plans";
import { Gem } from "lucide-react";

export const Step4SelectPlan = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div>
      <div className="w-full mt-30 flex flex-col items-start gap-y-10">
        {/* Header Container */}
        <div className="flex items-center gap-x-4">
          {/* 1. The Icon */}
          <div className="flex shrink-0 items-center justify-center size-14 rounded-full bg-[#816BFF]/10">
            <Gem className="size-7 stroke-[#816BFF] stroke-[1.5]" />
          </div>

          {/* 2. Text Content Stack */}
          <div className="flex flex-col justify-center">
            <div className="text-sm text-black">
              <span className="tracking-tight">
                <strong className="text-black tracking-wide">Joinflex</strong>를
                즐기기 위한 최종 단계
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              원하는 멤버십을 선택하세요
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center w-full gap-y-6 mb-30">
          <Plans onSuccess={() => setRefreshKey((prev) => prev + 1)} />{" "}
        </div>
      </div>
    </div>
  );
};
