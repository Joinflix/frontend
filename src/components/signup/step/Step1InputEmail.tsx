import { Mail } from "lucide-react";
import { useRequestEmailCheck } from "../../../api/queries/useRequestEmailCheck";
import { useForm } from "react-hook-form";
import { emailSchema, type EmailForm } from "../../../schemas/emailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Spinner } from "../../ui/spinner";

const Step1InputEmail = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const { mutateAsync, isPending } = useRequestEmailCheck({
    email,
    onSuccess: () => {
      navigate("/signup/step1-send-code", { state: { email } });
    },
  });

  const handleClickCheckEmail = () => {
    if (!isValid) return;
    mutateAsync();
  };

  return (
    <div>
      <div className="w-full max-w-md mt-50 flex flex-col gap-y-5">
        {/* Header Container */}
        <div className="flex items-center gap-x-4">
          {/* 1. The Icon */}
          <div className="flex shrink-0 items-center justify-center size-14 rounded-full bg-[#816BFF]/10">
            <Mail className="size-7 stroke-[#816BFF] stroke-[1.5]" />
          </div>

          {/* 2. Text Content Stack */}
          <div className="flex flex-col justify-center">
            <div className="text-sm text-black">
              <span className="tracking-wider">
                <strong className="text-black">1</strong>/<strong>3</strong>
                단계
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              이메일 입력
            </h1>
          </div>
        </div>

        {/*2. step content */}
        <div>
          <div className="mt-3 font-light">
            <span>
              <span className="font-semibold tracking-wide">Joinflix</span>
              에서 사용할 <span className="font-bold">이메일 계정</span>을
              입력해주세요.
            </span>
          </div>
        </div>

        <div className="flex flex-col m-1 gap-5 w-full">
          <div className="flex flex-col gap-3">
            <div className="relative w-full max-w-lg min-w-sm">
              <input
                {...register("email")}
                className="w-full px-3 pr-10 border border-[#816BFF] bg-[#816BFF]/10 rounded-xs py-2.5"
                placeholder="이메일 주소"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/*3. button */}
          <div className="w-full max-w-md mt-2 mb-60">
            <button
              className={`text-white text-lg font-bold rounded-[0.2rem] w-full flex items-center justify-center py-3 transition
              ${
                !isValid || isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#816BFF] hover:bg-[#5e42c8] cursor-pointer"
              }
              `}
              onClick={handleClickCheckEmail}
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-5 stroke-3" />
                  이메일 확인 중
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  이메일 제출
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1InputEmail;
