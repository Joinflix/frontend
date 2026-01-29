import z from "zod";

export const partySchema = z.object({
  name: z
    .string()
    .min(1, "파티 이름을 입력해주세요")
    .max(20, "파티 이름은 20자를 초과할 수 없습니다."),
  password: z
    .string()
    .regex(/^\d{4}$/, "비밀번호는 숫자 4자리여야 합니다")
    .optional(),
});

export type PartyFormValues = z.infer<typeof partySchema>;
