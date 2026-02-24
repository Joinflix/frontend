import { useNavigate } from "react-router";
import { signinSchema, type SigninForm } from "../../../schemas/signinSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, OctagonX } from "lucide-react";
import { useRequestSignin } from "../../../api/queries/useRequestSignin";
import { useAuthStore } from "../../../store/useAuthStore";
import { removeBearerHeader } from "../../../utils/removeBearerHeader";

const PasswordSignin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { mutateAsync, isPending } = useRequestSignin({
    email,
    password,
    onSuccess: (res) => {
      const accessToken = res.headers["authorization"];
      const pureAccessToken = removeBearerHeader(accessToken);
      useAuthStore.getState().setAuth(pureAccessToken);
      navigate("/browsing", { replace: true });
    },
  });

  const handleClickSignin = () => {
    mutateAsync();
  };

  return (
    <div>
      <div className="text-white flex flex-col gap-3 mt-25 mb-50">
        <h1 className="text-3xl font-bold">로그인</h1>
        <span className="text-white/60 tracking-normal">
          지금 친구들과 채팅하며 영상을 즐기세요!
        </span>

        <div className="flex flex-col m-1 gap-3 mt-5 w-full">
          {/* 이메일 */}
          <div className="relative w-full max-w-md">
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 pr-10 border border-[#816BFF] bg-[#816BFF]/10 rounded-xs py-2.5"
              placeholder="이메일 주소"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1.5 flex gap-1 items-center">
                <OctagonX className="size-4" />
                {errors.email.message}
              </p>
            )}
          </div>
          {/* 비밀번호 */}
          <div className="flex flex-col w-full max-w-md">
            <div className="relative w-full">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="w-full px-3 pr-10 border border-[#816BFF] bg-[#816BFF]/10 rounded-xs py-2.5"
                placeholder="비밀번호(8자리 이상)"
              />
              <button
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <Eye className="size-5 stroke-[#816BFF]" />
                ) : (
                  <EyeOff className="size-5 stroke-[#816BFF]" />
                )}
              </button>
            </div>

            {/* 비밀번호 입력 에러 메시지 */}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1.5 flex gap-1 items-center">
                <OctagonX className="size-4" />
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            disabled={!isValid || isPending}
            className={`w-full py-2.5 px-5 rounded-xs text-white transition
    ${
      isValid && !isPending
        ? "bg-[#816BFF] hover:bg-[#5e42c8] cursor-pointer"
        : "bg-gray-400 cursor-not-allowed"
    }`}
            onClick={handleClickSignin}
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>

          <div className="flex justify-center gap-2 mt-4 text-sm">
            <span className="text-white/60">아직 계정이 없으신가요?</span>
            <button
              onClick={() => navigate("/signup/step1-input-email")}
              className="text-[#816BFF] font-bold hover:underline cursor-pointer"
            >
              회원가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSignin;
