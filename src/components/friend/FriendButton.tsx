import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import FriendModal from "./FriendModal";

const FriendButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-white hover:text-[#816BFF] transition-colors"
        aria-label="친구"
        aria-haspopup="dialog"
      >
        <Users className="w-6 h-6" />
      </button>

      {isOpen && <FriendModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default FriendButton;
