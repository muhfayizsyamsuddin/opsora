import { z } from "zod";

// export const registerSchema = z.object({
//   body: z.object({
//     name: z.string().min(3),
//     email: z.email(),
//     password: z.string().min(6),
//   }),
// });

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const logoutSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const updateMeSchema = z.object({
  body: z
    .object({
      name: z.string().min(3).max(100).optional(),
      email: z.email().optional(),
    })
    .strict()
    .refine(
      (data) =>
        data.name !== undefined ||
        data.email !== undefined,
      {
        message:
          "At least one profile field must be provided",
      },
    ),
  query: z.object({}),
  params: z.object({}),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(6),
      newPassword: z.string().min(8),
    })
    .strict(),
  query: z.object({}),
  params: z.object({}),
});