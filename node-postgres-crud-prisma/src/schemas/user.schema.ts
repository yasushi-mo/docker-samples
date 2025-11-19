import z from "zod";

/** ユーザー作成用スキーマ */
export const createUserSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  name: z
    .string({
      message: "Name is required",
    })
    .min(1, { message: "Name must be at least 1 character" })
    .max(100, { message: "Name must be at most 100 characters" }),
});

/** ユーザー更新用スキーマ */
export const updateUserSchema = z.object({
  email: z.email({ message: "Invalid email format" }).optional(),
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character" })
    .max(100, { message: "Name must be at most 100 characters" })
    .optional(),
});

/** IDパラメータ用スキーマ */
export const userIdSchema = z.object({
  id: z.string().refine((val) => /^\d+$/.test(val), {
    message: "ID must be a number",
  }),
});

// 型の推論
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdSchema>;
