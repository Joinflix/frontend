const LandingHeader = () => {
  return (
    <header className="flex flex-row justify-between py-5 px-8">
      <div className="text-[#816BFF] font-extrabold text-lg uppercase tracking-tight">
        joinflix
      </div>
      <button className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-xs rounded-xs px-4 py-1.5 flex items-center justify-center">
        로그인
      </button>
    </header>
  );
};
export default LandingHeader;
