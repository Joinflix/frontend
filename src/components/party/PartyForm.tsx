import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { PartyFormValues } from "../../schemas/partySchema";
import type { PartyType } from "../../types/party";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PartyFormProps {
  partyType: PartyType;
  register: UseFormRegister<PartyFormValues>;
  errors: FieldErrors<PartyFormValues>;
  touchedFields: Partial<Record<keyof PartyFormValues, boolean>>;
}

const PartyForm = ({
  partyType,
  register,
  errors,
  touchedFields,
}: PartyFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col gap-3 mt-3">
      <div className="flex flex-col gap-2">
        <label className="text-sm">파티 이름</label>
        <input
          {...register("name")}
          className="text-sm border border-white/50 p-3 rounded-xs bg-transparent"
          placeholder="다른 사람들에게 보여질 파티 이름이에요"
        />
        {touchedFields.name && errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}

        {partyType === "PRIVATE" && (
          <>
            <label className="text-sm">비밀번호 설정</label>
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
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PartyForm;
