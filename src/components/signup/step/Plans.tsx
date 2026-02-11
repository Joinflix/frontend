import { useEffect } from "react";
import Plan from "./Plan";
import { useAuthStore } from "../../../store/useAuthStore";
import apiClient from "../../../api/axios";

declare global {
  interface Window {
    IMP: any;
  }
}

const planData = [
  {
    membershipId: 1,
    planName: "광고형 스탠다드",
    amount: 100,
    gradient: "from-indigo-300 to-[#5e42c8]",
    description:
      "광고와 함께 즐기는 합리적인 가격의 플랜입니다. 일부 콘텐츠 제외.",
    features: [
      { title: "해상도", description: "1080p" },
      { title: "동시 시청", description: "2명" },
    ],
  },
  {
    membershipId: 2,
    planName: "스탠다드",
    amount: 200,
    gradient: "from-[#816BFF] to-purple-900",
    description:
      "무광고로 즐기는 표준 플랜입니다. 두 대의 기기에서 동시 시청 가능.",
    features: [
      { title: "해상도", description: "1080p" },
      { title: "동시 시청", description: "2명" },
    ],
  },
  {
    membershipId: 3,
    planName: "프리미엄",
    amount: 300,
    gradient: "from-[#816BFF] via-pink-500 to-yellow-400",
    description:
      "최고의 화질과 공간 음향을 제공합니다. 최대 4대 기기 동시 시청.",
    features: [
      { title: "해상도", description: "4K + HDR" },
      { title: "동시 시청", description: "4명" },
    ],
  },
];

export const Plans = ({ onSuccess }: { onSuccess: () => void }) => {
  const email = useAuthStore((state) => state.user?.email);

  // 포트원 스크립트 로딩
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRequestPay = (
    membershipId: number,
    amount: number,
    planName: string,
  ) => {
    if (!window.IMP) {
      alert("결제 모듈 로딩 실패");
      return;
    }

    const { IMP } = window;
    IMP.init("imp10502566");

    window.IMP.request_pay(
      {
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: `ORD-${membershipId}-${Date.now()}`,
        name: `JoinFlex ${planName}`,
        amount: amount,
        buyer_email: `${email}`,
      },
      async (rsp: any) => {
        if (rsp.success) {
          try {
            const response = await apiClient.post("/payments/complete", {
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
