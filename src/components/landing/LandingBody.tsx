import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { type EmailForm, emailSchema } from "../../schemas/emailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequestEmailCheck } from "../../api/queries/useRequestEmailCheck";
import { TypingAnimation } from "../ui/typing-animation";
import { OctagonX } from "lucide-react";

const LandingBody = () => {
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
    <>
      <div className="mt-40 mb-40 flex flex-col items-center text-white py-10">
        {/* CTA */}
        <div className="text-center space-y-2">
          <div className="mb-5">
            <TypingAnimation
              className="text-2xl font-bold"
              loop={true}
              pauseDelay={10_000}
              cursorStyle="underscore"
            >
              친구들과 실시간으로 소통하며 즐기는 watch party
            </TypingAnimation>
          </div>
          <p className="text-sm">
            100원으로 부담 없이 친구들과 함께 watch party를 즐길 준비가
            되셨나요?
          </p>
          <p className="text-sm">
            멤버십을 등록하거나 재시작하려면 이메일 주소를 입력하세요.
          </p>
        </div>
        {/* email input */}
        <div className="flex items-start m-1 gap-3 mt-5">
          {" "}
          {/* items-start keeps button at the top */}
          <div className="flex flex-col gap-1">
            <input
              {...register("email")}
              className="border border-gray-700 bg-black/60 rounded-xs px-3 text-sm w-60 h-[40px]" // Added height for consistency
              placeholder="이메일 주소"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex gap-1 items-center">
                <OctagonX className="size-3" />
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            className="bg-[#816BFF] cursor-pointer hover:bg-[#5e42c8] text-white text-sm px-5 rounded-xs h-[40px]" // Match input height
            disabled={!isValid || isPending}
            onClick={handleClickCheckEmail}
          >
            시작하기 &gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default LandingBody;
