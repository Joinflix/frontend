import PendingPaymentHeader from "../components/signup/PendingPaymentHeader";
import { SignupBody } from "../components/signup/SignupBody";
import SignupFooter from "../components/signup/SignupFooter";

const PendingPaymentPage = () => {
  return (
    <>
      <PendingPaymentHeader />
      <hr />
      <div className="flex flex-col mx-auto items-center w-full min-h-screen gap-y-5">
        <SignupBody />
        <SignupFooter />
      </div>
    </>
  );
};

export default PendingPaymentPage;
