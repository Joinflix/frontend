import { z } from "zod";

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "비밀번호는 필수입니다." })
      .regex(/^\S*$/, { message: "비밀번호는 공백을 포함할 수 없습니다." })
      .min(8, { message: "비밀번호는 최소 8자리 이상이어야 합니다." }),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type PasswordForm = z.infer<typeof passwordSchema>;
