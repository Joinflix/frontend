import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, CircleX, IdCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { replace, useLocation, useNavigate } from "react-router";
import {
  type NicknameForm,
  nicknameSchema,
} from "../../../schemas/nicknameSchema";
import { useRequestSignup } from "../../../api/queries/useRequestSignup";
import { Spinner } from "../../ui/spinner";

const ICON_CLASSNAME = "size-5 stroke-[#816BFF]";

const Step3SetNickname = () => {
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

  // TODO: nickname availability 확인

  const { mutateAsync, isPending } = useRequestSignup({
    email,
    password,
    nickname,
    onSuccess: () => {
      alert("성공적으로 가입을 완료하였습니다.");
      navigate("/signin", { replace: true });
    },
  });

  const handleClickSignup = () => {
    mutateAsync();
  };

  return (
    <div>
      <div className="w-full max-w-md mt-10 flex flex-col gap-y-5">
        {/*1. icon */}
        <div className="flex flex-row items-center">
          <IdCard className="size-15 stroke-[#816BFF] stroke-1" />
        </div>

        {/*2. step content */}
        <div>
          <div className="text-sm">
            <span>
              <strong>3</strong>/<strong>3</strong>단계
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold leading-snug tracking-wide">
              닉네임 설정
            </h1>
          </div>
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
              <button className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                {nickname ? ( // only show icons if something is typed
                  isValid ? (
                    <CircleCheck className={ICON_CLASSNAME} />
                  ) : (
                    <CircleX className={`${ICON_CLASSNAME} stroke-red-500`} />
                  )
                ) : null}
              </button>
            </div>
            {errors.nickname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nickname.message}
              </p>
            )}
          </div>

          {/*3. button */}
          <div className="w-full max-w-md mt-2 mb-10">
            <button
              disabled={!isValid || isPending}
              className={`text-white text-xl rounded-[0.2rem] w-full flex items-center justify-center py-3 transition
    ${
      !isValid || isPending
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
                  회원 가입
                </span>
              ) : (
                "회원 가입"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3SetNickname;
