import * as z from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "Name is required",
      }),
      email: z
        .string({
          required_error: "Please provide email.",
        })
        .email("Please enter a valid email"),
      password: z
        .string({
          required_error: "Password is required!",
        })
        .min(6, "Passoword too short - should be 6 chars minimum"),
      passwordConfirmation: z.string({
        required_error: "passwordConfirmation is required!",
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password do not match",
      path: ["passwordConfirmation"],
    }),
});
export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
