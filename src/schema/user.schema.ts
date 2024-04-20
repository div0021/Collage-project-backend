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

// profile

export const updateProfileSchema = z.object({
  body: z.object({
    state: z.string().min(1, "state is required"),
    city: z.string().min(2, "city is required"),
    pincode: z
      .string()
      .length(6, "length should be 6") // Ensure input is a string
      .refine((value) => /^\d{6}$/.test(value), {
        message: "Input must be a six-digit number",
      })
      .refine((value) => /^[1-9]\d{5}$/.test(value), {
        message:
          "First digit must be between 1 and 9, and remaining digits between 0 and 9",
      }),
    address: z.string().min(4, `Address is required`),
  }),
});

export type UpdateProfileInput = z.TypeOf<typeof updateProfileSchema>;
