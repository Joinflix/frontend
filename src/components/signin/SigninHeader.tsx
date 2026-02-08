import { useNavigate } from "react-router";

const SigninHeader = () => {
  const navigate = useNavigate();
  const handleClickLogo = () => {
    navigate("/");
  };
  return (
    <header className="flex flex-row justify-between py-5 px-8">
      <div
        className="text-[#816BFF] font-extrabold text-xl uppercase tracking-wide cursor-pointer"
        onClick={handleClickLogo}
      >
        joinflix
      </div>
    </header>
  );
};

export default SigninHeader;
