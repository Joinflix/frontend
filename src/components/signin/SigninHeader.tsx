import { useNavigate } from "react-router";

const SigninHeader = () => {
  const navigate = useNavigate();
  const handleClickLogo = () => {
    navigate("/landing");
  };
  return (
    <header className="flex flex-row justify-between py-5 px-8">
      <div
        className="text-[#816BFF] font-extrabold text-xl uppercase tracking-wide cursor-default"
        onClick={handleClickLogo}
      >
        joinflix
      </div>
    </header>
  );
};

export default SigninHeader;
