import { useEffect } from "react";
import Plan from "./Plan";

declare global {
  interface Window {
    IMP: any;
  }
}

const planData = [
  {
    name: "무료 체험",
    gradient: "from-gray-400 to-gray-700",
    description: "기본적인 서비스 탐색이 가능한 무료 플랜입니다.",
    features: [
      { title: "월 요금", description: "0원" },
      { title: "해상도", description: "480p" },
      { title: "동시 시청", description: "1명" },
    ],
  },
  {
    name: "광고형 스탠다드",
    gradient: "from-indigo-300 to-[#5e42c8]",
    description:
      "광고와 함께 즐기는 합리적인 가격의 플랜입니다. 일부 콘텐츠 제외.",
    features: [
      { title: "월 요금", description: "5,500원" },
      { title: "해상도", description: "1080p" },
      { title: "동시 시청", description: "2명" },
    ],
  },
  {
    name: "스탠다드",
    gradient: "from-[#816BFF] to-purple-900",
    description:
      "무광고로 즐기는 표준 플랜입니다. 두 대의 기기에서 동시 시청 가능.",
    features: [
      { title: "월 요금", description: "13,500원" },
      { title: "해상도", description: "1080p" },
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
      { title: "해상도", description: "4K + HDR" },
      { title: "동시 시청", description: "4명" },
    ],
  },
];

export const Plans = ({ onSuccess }: { onSuccess: () => void }) => {
  useEffect(() => {
    if (window.IMP) window.IMP.init("imp10502566");
  }, []);

  const handleRequestPay = (
    membershipId: number,
    amount: number,
    planName: string,
  ) => {
    const token = localStorage.getItem("token"); // Assuming token is in localStorage
    if (!token) return alert("로그인이 필요합니다.");

    window.IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: `ORD-${membershipId}-${Date.now()}`,
        name: `JoinFlex ${planName}`,
        amount: amount,
        buyer_email: "test@test.com",
      },
      async (rsp: any) => {
        if (rsp.success) {
          try {
            const response = await fetch("/api/payments/complete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                imp_uid: rsp.imp_uid,
                merchant_uid: rsp.merchant_uid,
                paid_amount: rsp.paid_amount,
                membershipId: membershipId,
                pay_method: rsp.pay_method,
                status: "paid",
              }),
            });
            if (response.ok) {
              alert("결제 완료!");
              onSuccess(); // Refresh history
            }
          } catch (err) {
            console.error("Payment sync error:", err);
          }
        } else {
          alert(`결제 실패: ${rsp.error_msg}`);
        }
      },
    );
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {planData.map((plan) => (
        <Plan key={plan.name} plan={plan} onSelect={handleRequestPay} />
      ))}
    </div>
  );
};

export default Plans;
