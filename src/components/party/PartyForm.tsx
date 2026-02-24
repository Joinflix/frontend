import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { PartyFormValues } from "../../schemas/partySchema";
import type { PartyType } from "../../types/party";
import { useState } from "react";
import { Eye, EyeOff, OctagonX } from "lucide-react";

interface PartyFormProps {
  partyType: PartyType;
  register: UseFormRegister<PartyFormValues>;
  watch: UseFormWatch<PartyFormValues>;
  setValue: UseFormSetValue<PartyFormValues>;
  errors: FieldErrors<PartyFormValues>;
  touchedFields: Partial<Record<keyof PartyFormValues, boolean>>;
}

const PartyForm = ({
  partyType,
  register,
  watch,
  setValue,
  errors,
  touchedFields,
}: PartyFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col gap-3 mt-3">
      <div className="flex flex-col gap-2 gap-y-5">
        {/* 파티 이름 */}
        <div className="flex flex-col gap-y-2">
          <label className="text-sm">파티 이름</label>
          <input
            {...register("name")}
            className="text-sm border border-white/50 p-3 rounded-xs bg-transparent"
            placeholder="최소 1자, 최대 20자"
          />
          {touchedFields.name && errors.name && (
            <p className="text-red-500 text-sm flex gap-1 items-center">
              <OctagonX className="size-4" />
              {errors.name.message}
            </p>
          )}
        </div>

        {partyType === "PRIVATE" && (
          <>
            {/* 비밀번호 */}
            <div className="flex flex-col gap-y-2">
              <label className="text-sm">비밀번호 설정</label>

              <div className="flex flex-col">
                <div className="relative w-full">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="text-sm border border-white/50 p-3 rounded-xs bg-transparent w-full"
                    placeholder="숫자 4자리를 입력해 주세요"
                  />
                  <button
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <Eye className="size-5 text-white/50" />
                    ) : (
                      <EyeOff className="size-5 text-white/50" />
                    )}
                  </button>
                </div>
                {touchedFields.password && errors.password && (
                  <p className="text-red-500 text-sm flex mt-2 gap-1 items-center">
                    <OctagonX className="size-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* 호스트 통제 */}
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center gap-3 text-sm cursor-pointer"
                onClick={() => setValue("hostControl", !watch("hostControl"))}
              >
                <div>
                  <input
                    id="hostControl"
                    type="checkbox"
                    {...register("hostControl")}
                    className="w-6 h-6 accent-[#816BFF] cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <label
                  htmlFor="hostControl"
                  className="flex flex-col cursor-pointer"
                >
                  <span className="text-sm">호스트만 영상 조절</span>
                  <span className="text-sm text-white/50">
                    호스트만 영상을 조절할 수 있어요
                  </span>
                </label>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PartyForm;
