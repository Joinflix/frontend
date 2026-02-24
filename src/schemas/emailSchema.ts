import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .email({ message: "유효한 이메일 양식이 아닙니다." })
    .regex(/^\S*$/, { message: "이메일은 공백을 포함할 수 없습니다." }),
});

export type EmailForm = z.infer<typeof emailSchema>;
