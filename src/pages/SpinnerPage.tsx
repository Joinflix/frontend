import { Spinner } from "../components/ui/spinner";

const SpinnerPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <Spinner className="stroke-[#816BFF] size-10" />
    </div>
  );
};

export default SpinnerPage;
