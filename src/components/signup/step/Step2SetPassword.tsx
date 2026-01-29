import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  passwordSchema,
  type PasswordForm,
} from "../../../schemas/passwordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Step2SetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const email = location.state?.email || "";

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleClickChangeEmail = () => {
    alert("change email 화면 구성해야함");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickSetPassword = () => {
    const password = watch("password");
    navigate("/signup/step3-set-nickname", {
      state: {
        email,
        password,
      },
    });
  };

  return (
    <div>
      <div className="w-full max-w-md mt-10 flex flex-col gap-y-5">
        {/*1. icon */}
        <div className="flex flex-row items-center">
          <KeyRound className="size-15 stroke-[#816BFF] stroke-1" />
        </div>

        {/*2. step content */}
        <div>
          <div className="text-sm">
            <span>
              <strong>2</strong>/<strong>3</strong>단계
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold leading-snug tracking-wide">
              비밀번호 설정
            </h1>
          </div>
          <div className="mt-3 font-light">
            <span>
              아래의 이메일 계정과 함께 사용할 비밀번호를 입력해주세요.
            </span>
          </div>
        </div>

        <div className="flex flex-col m-1 gap-5 w-full">
          <div className="bg-gray-200/80 rounded-xs px-4 py-3 flex justify-between items-center">
            <span>{email}</span>
            <span
              className="text-xs cursor-pointer underline"
              onClick={handleClickChangeEmail}
            >
              변경
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* 비밀번호 입력 */}
            <div className="relative w-full max-w-md">
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
              {/* 비밀번호 입력 에러 메시지 */}
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="relative w-full max-w-md">
              <input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                className="w-full px-3 pr-10 border border-[#816BFF] bg-[#816BFF]/10 rounded-xs py-2.5"
                placeholder="비밀번호 확인"
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
            {/* 비밀번호 확인 입력 에러 메시지 */}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/*3. button */}
        <div className="w-full max-w-md mt-2 mb-10">
          <button
            disabled={!isValid}
            className={`text-white text-xl rounded-[0.2rem] w-full flex items-center justify-center py-3 transition
    ${
      isValid
        ? "bg-[#816BFF] hover:bg-[#5e42c8] cursor-pointer"
        : "bg-gray-400 cursor-not-allowed"
    }
  `}
            onClick={handleClickSetPassword}
          >
            {isValid ? (
              <span className="inline-flex items-center gap-2">
                비밀번호 설정
              </span>
            ) : (
              "비밀번호 설정"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2SetPassword;
