import { Spinner } from "../../ui/spinner";

const LoadingOverlay = ({ message }: { message?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2B2355]/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-10 stroke-3 stroke-white" />
        <span className="text-white text-lg font-semibold">
          {message || "로딩 중"}
        </span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
