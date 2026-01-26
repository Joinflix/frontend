import { useNavigate } from "react-router";

const LandingHeader = () => {
  const navigate = useNavigate();
  const handleClickLogin = () => {
    navigate("/browsing");
  };

  return (
    <header className="flex flex-row justify-between py-5 px-8">
      <div className="text-[#816BFF] font-extrabold text-xl uppercase tracking-wide">
        joinflix
      </div>
      <button
        className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-xs rounded-xs px-4 py-1.5 flex items-center justify-center"
        onClick={handleClickLogin}
      >
        로그인
      </button>
    </header>
  );
};
export default LandingHeader;
