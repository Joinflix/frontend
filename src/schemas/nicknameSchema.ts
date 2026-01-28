import { z } from "zod";

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(3, { message: "닉네임은 3자 이상이어야 합니다." })
    .max(30, { message: "닉네임은 30자 이하여야 합니다." })
    .regex(/^\S*$/, { message: "닉네임은 공백을 포함할 수 없습니다." }),
});

export type NicknameForm = z.infer<typeof nicknameSchema>;
