import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .email({ message: "유효한 이메일 양식이 아닙니다." })
    .regex(/^\S*$/, { message: "이메일은 공백을 포함할 수 없습니다." }),
  password: z
    .string()
    .min(1, { message: "비밀번호는 필수입니다." })
    .regex(/^\S*$/, { message: "비밀번호는 공백을 포함할 수 없습니다." })
    .min(8, { message: "비밀번호는 최소 8자리 이상이어야 합니다." }),
});

export type SigninForm = z.infer<typeof signinSchema>;
