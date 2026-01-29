import { useNavigate } from "react-router";

const BrowsingHeader = () => {
  const navigate = useNavigate();
  const handleClickLogo = () => {
    navigate("/browsing");
  };
  return (
    <header className="fixed top-0 w-full z-50 flex flex-row justify-between py-3 px-6 bg-linear-to-b from-black via-black/70">
      <div
        className="text-[#816BFF] font-bold text-sm md:text-base lg:text-2xl uppercase cursor-pointer"
        onClick={handleClickLogo}
      >
        joinflix
      </div>
    </header>
  );
};

export default BrowsingHeader;
