import {TypeOf, object,string} from "zod";

export const resetPasswordEmailSchema = object({
    body:object({
        email:string({
            required_error: 'Email is required',
        }).email('Please enter a valid email address'),
    })
})

export type ResetPasswordEmailType = TypeOf<typeof resetPasswordEmailSchema>

export const resetPasswordOTPSchema = object({
    body:object({
        otp:string({
            required_error: 'OTP is required',
        }).length(6,"The OTP should be 6 digits long"),
    })
})
export type ResetPasswordOTPType = TypeOf<typeof resetPasswordOTPSchema>

export const resetPasswordSchema = object({
  body: object({
      password: string({
          required_error: "Password is required!",
        })
        .min(6, "Passoword too short - should be 6 chars minimum"),
      passwordConfirmation:string({
        required_error: "passwordConfirmation is required!",
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password do not match",
      path: ["passwordConfirmation"],
    }),
});
export type ResetPasswordType = TypeOf<typeof resetPasswordSchema>;
