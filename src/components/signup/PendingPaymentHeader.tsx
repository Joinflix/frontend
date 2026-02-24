import { useSignout } from "../../api/queries/useSignout";

const PendingPaymentHeader = () => {
  const { mutate: signout } = useSignout();

  const handleClickSignout = () => {
    signout();
  };

  return (
    <header className="flex flex-row justify-between py-5 px-8">
      <div className="text-[#816BFF] font-extrabold text-xl uppercase tracking-wide cursor-default">
        joinflix
      </div>
      <button
        className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-xs rounded-xs px-3 py-1.5 flex items-center justify-center"
        onClick={handleClickSignout}
      >
        로그아웃
      </button>
    </header>
  );
};

export default PendingPaymentHeader;
