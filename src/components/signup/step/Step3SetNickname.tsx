import { useLocation } from "react-router";

const Step3SetNickname = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const password = location.state?.password || "";

  return <div>Step3SetNickname</div>;
};

export default Step3SetNickname;
