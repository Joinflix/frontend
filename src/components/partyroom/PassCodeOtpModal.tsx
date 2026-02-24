import { useEffect, useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface PassCodeOtpProps {
  selectedPartyId: number | null;
  onClose: () => void;
  onJoin: (partyId: number, passCode: string) => void;
}

const OTP_BOX_STYLE =
  "!rounded-xs border w-13 h-15 border-[#816BFF] bg-[#816BFF]/10 text-4xl font-extrabold text-[#816BFF]";
const OTP_MAX_LENGTH = 4;

const PassCodeOtpModal = ({
  selectedPartyId,
  onClose,
  onJoin,
}: PassCodeOtpProps) => {
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!selectedPartyId) return null;

  const handleJoin = (currentOtp: string) => {
    onJoin(selectedPartyId, currentOtp);
    setOtp("");
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === OTP_MAX_LENGTH) {
      handleJoin(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-lg w-80 flex flex-col gap-4">
        <h2 className="text-white text-lg font-bold">비공개 파티</h2>

        <div className="flex justify-center w-full">
          <InputOTP
            maxLength={OTP_MAX_LENGTH}
            value={otp}
            onChange={handleOtpChange}
            autoFocus
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: OTP_MAX_LENGTH }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={OTP_BOX_STYLE}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 bg-zinc-700 text-white py-2 rounded cursor-pointer"
            onClick={onClose}
          >
            취소
          </button>

          <button
            className="flex-1 bg-[#816BFF] text-white py-2 rounded cursor-pointer"
            disabled={otp.length < 4}
            onClick={() => handleJoin(otp)}
          >
            입장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassCodeOtpModal;
