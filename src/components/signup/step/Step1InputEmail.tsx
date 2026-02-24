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
      <div className="w-full max-w-md mt-10 flex flex-col gap-y-5">
        {/*1. icon */}
        <div className="flex flex-row items-center">
          <Mail className="size-15 stroke-[#816BFF] stroke-1" />
        </div>

        {/*2. step content */}
        <div>
          <div className="text-sm">
            <span>
              <strong>1</strong>/<strong>3</strong>단계
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold leading-snug tracking-wide">
              이메일 입력
            </h1>
          </div>
          <div className="mt-3 font-light">
            <span>사용할 이메일 계정을 입력해주세요.</span>
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
          <div className="w-full max-w-md mt-2 mb-10">
            <button
              className={`text-white rounded-[0.2rem] w-full flex items-center justify-center py-3 transition
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
