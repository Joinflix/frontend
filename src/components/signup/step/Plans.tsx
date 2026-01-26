import Plan from "./Plan";

const planData = [
  {
    name: "무료 체험",
    gradient: "from-gray-400 to-gray-700",
    description: "기본적인 서비스 탐색이 가능한 무료 플랜입니다.",
    features: [
      { title: "월 요금", description: "0원" },
      { title: "화질", description: "480p" },
      { title: "동시 시청", description: "1명" },
    ],
  },
  {
    name: "광고형 스탠다드",
    gradient: "from-indigo-300 to-[#816BFF]",
    description:
      "광고와 함께 즐기는 합리적인 가격의 플랜입니다. 일부 콘텐츠 제외.",
    features: [
      { title: "월 요금", description: "5,500원" },
      { title: "화질", description: "1080p" },
      { title: "동시 시청", description: "2명" },
    ],
  },
  {
    name: "스탠다드",
    gradient: "from-[#816BFF] to-purple-800",
    description:
      "무광고로 즐기는 표준 플랜입니다. 두 대의 기기에서 동시 시청 가능.",
    features: [
      { title: "월 요금", description: "13,500원" },
      { title: "화질", description: "1080p" },
      { title: "동시 시청", description: "2명" },
    ],
  },
  {
    name: "프리미엄",
    gradient: "from-[#816BFF] via-pink-500 to-yellow-400",
    description:
      "최고의 화질과 공간 음향을 제공합니다. 최대 4대 기기 동시 시청.",
    features: [
      { title: "월 요금", description: "17,000원" },
      { title: "화질", description: "4K + HDR" },
      { title: "동시 시청", description: "4명" },
    ],
  },
];

export const Plans = () => {
  return (
    <div className="flex gap-4">
      {planData.map((plan) => (
        <Plan key={plan.name} plan={plan} />
      ))}
    </div>
  );
};

export default Plans;
