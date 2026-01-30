import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSse } from "../../contexts/SseContext";
import NotificationButton from "../notification/NotificationButton";
import FriendButton from "../friend/FriendButton";

const BrowsingHeader = () => {
  const navigate = useNavigate();
  const { connect, isConnected } = useSse();

  // /browsing 페이지 진입 시 SSE 연결
  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [connect, isConnected]);

  const handleClickLogo = () => {
    navigate("/browsing");
  };

  return (
    <header className="fixed top-0 w-full z-50 flex flex-row justify-between items-center py-3 px-6 bg-linear-to-b from-black via-black/70">
      <div
        className="text-[#816BFF] font-bold text-sm md:text-base lg:text-2xl uppercase cursor-pointer"
        onClick={handleClickLogo}
      >
        joinflix
      </div>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-4">
        <FriendButton />
        <NotificationButton />
      </div>
    </header>
  );
};

export default BrowsingHeader;
