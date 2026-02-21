import { useNavigate } from "react-router";

const PartyClosedOverlay = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        <h2 className="text-lg text-white mb-5">
          호스트가 해당 파티를 종료했습니다.
        </h2>
        <button
          onClick={() => navigate("/party", { replace: true })}
          className="px-6 py-2 bg-[#816BFF] text-white rounded-lg text-sm hover:bg-[#6c56e0] transition-colors cursor-pointer"
        >
          파티 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PartyClosedOverlay;
