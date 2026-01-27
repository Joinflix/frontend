import { useNavigate } from "react-router";
import SigninHeader from "../components/signin/SigninHeader";
import { SigninBody } from "../components/signin/SigninBody";
import SigninFooter from "../components/signin/SigninFooter";

const SigninPage = () => {
  const navigate = useNavigate();
  const handleClickNext = () => {
    navigate("/brow");
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#2B2355] to-black ">
      <SigninHeader />
      <hr className="border-0 h-px bg-white/10" />
      <div className="flex flex-col mx-auto items-center w-full min-h-screen gap-y-3">
        <SigninBody />
        <SigninFooter />
      </div>
    </div>
  );
};

export default SigninPage;
