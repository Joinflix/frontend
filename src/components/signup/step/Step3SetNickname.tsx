import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, IdCard, OctagonX } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import {
  type NicknameForm,
  nicknameSchema,
} from "../../../schemas/nicknameSchema";
import { useRequestSignup } from "../../../api/queries/useRequestSignup";
import { Spinner } from "../../ui/spinner";
import { useRequestNicknameCheck } from "../../../api/queries/useRequestNicknameCheck";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../api/axios";
import { useAuthStore } from "../../../store/useAuthStore";

const ICON_CLASSNAME = "size-5 stroke-[#816BFF]";

const Step3SetNickname = () => {
  const { setAuth } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const password = location.state?.password || "";

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<NicknameForm>({
    resolver: zodResolver(nicknameSchema),
    mode: "onChange",
    defaultValues: {
      nickname: "",
    },
  });

  const nickname = watch("nickname");
  const [isValidNickname, setIsValidNickname] = useState(null);
  const [debouncedNickname, setDebouncedNickname] = useState(nickname);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNickname(nickname);
    }, 500);

    return () => clearTimeout(timer);
  }, [nickname]);

  // TODO: nickname availability 확인
  const { mutateAsync: checkNickname, isPending: isCheckingNickname } =
    useRequestNicknameCheck({
      nickname,
      onSuccess: () => {
        setIsValidNickname(true);
      },
      onError: () => {
        setIsValidNickname(false);
      },
    });

  useEffect(() => {
    if (!debouncedNickname || !isValid) {
      setIsValidNickname(null);
      return;
    }

    checkNickname();
  }, [debouncedNickname, isValid]);

  const { mutateAsync, isPending } = useRequestSignup({
    email,
    password,
    nickname,
    onSuccess: async () => {
      try {
        await mutateAsyncSignin();
        alert("성공적으로 가입을 완료하였습니다.");
        navigate("/signup/step4-list-membership", { replace: true });
      } catch (error) {
        console.error("Login failed after signup", error);
      }
    },
  });

  const { mutateAsync: mutateAsyncSignin, isPending: isPendingSignin } =
    useMutation({
      mutationKey: ["signin"],
      mutationFn: async () => {
        const res = await apiClient.post("/auth/login", {
          email,
          password,
        });

        const authHeader = res.headers["authorization"];
        if (!authHeader) {
          throw new Error("No Authorization header found");
        }
        const token = authHeader.replace("Bearer ", "");

        setAuth(token);

        return res.data;
      },
    });

  const canSubmit = isValid && isValidNickname === true && !isCheckingNickname;

  const handleClickSignup = () => {
    if (!canSubmit) return;
    mutateAsync();
  };

  return (
    <div>
      <div className="w-full max-w-md mt-40 flex flex-col gap-y-5">
        {/* Header Container */}
        <div className="flex items-center gap-x-4">
          {/* 1. The Icon */}
          <div className="flex shrink-0 items-center justify-center size-14 rounded-full bg-[#816BFF]/10">
            <IdCard className="size-7 stroke-[#816BFF] stroke-[1.5]" />
          </div>

          {/* 2. Text Content Stack */}
          <div className="flex flex-col justify-center">
            <div className="text-sm text-black">
              <span className="tracking-wider">
                <strong className="text-black">3</strong>/<strong>3</strong>
                단계
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              닉네임 설정
            </h1>
          </div>
        </div>

        {/*2. step content */}
        <div>
          <div className="mt-3 font-light">
            <span>아래의 이메일 계정과 함께 사용할 닉네임을 입력해주세요.</span>
          </div>
        </div>

        <div className="flex flex-col m-1 gap-5 w-full">
          <div className="bg-gray-200/80 rounded-xs px-4 py-3 flex justify-between items-center">
            <span>{email}</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* 닉네임 */}
            <div className="relative w-full max-w-md">
              <input
                {...register("nickname")}
                className="w-full px-3 pr-10 border border-[#816BFF] bg-[#816BFF]/10 rounded-xs py-2.5"
                placeholder="닉네임(3자 이상 30자 이하)"
              />
            </div>

            {errors.nickname && (
              <p className="text-red-500 text-sm mt-1 flex gap-1 items-center">
                <OctagonX className="size-4" />
                {errors.nickname.message}
              </p>
            )}

            {!errors.nickname && isValidNickname === false && (
              <p className="text-red-500 text-sm mt-1 flex gap-1 items-center">
                <OctagonX className="size-4" />
                이미 사용 중인 닉네임입니다.
              </p>
            )}

            {!errors.nickname && isValidNickname === true && (
              <p className="text-[#816BFF] text-sm mt-1 flex gap-1 items-center">
                <CircleCheck className="size-4" />
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          {/*3. button */}
          <div className="w-full max-w-md mt-2 mb-30">
            <button
              disabled={!canSubmit || isPending}
              className={`text-white text-xl font-bold rounded-[0.2rem] w-full flex items-center justify-center py-3 transition
              ${
                !canSubmit || isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#816BFF] hover:bg-[#5e42c8] cursor-pointer"
              }
              `}
              onClick={handleClickSignup}
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-5 stroke-3" />
                  회원 가입 중
                </span>
              ) : isValid ? (
                <span className="inline-flex items-center gap-2">
                  회원 가입 완료
                </span>
              ) : (
                "회원 가입 완료"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3SetNickname;
