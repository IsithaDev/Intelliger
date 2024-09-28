import { z } from "zod";

export const PersonalInformationFormSchema = z.object({
  firstName: z
    .string({
      required_error: "Please provide your first name.",
    })
    .min(1, { message: "Please provide your first name." })
    .min(3, {
      message: "First name must be at least 3 characters.",
    })
    .max(10, { message: "First name must not exceed 10 characters." })
    .trim(),

  lastName: z
    .string({
      required_error: "Please provide your last name.",
    })
    .min(1, { message: "Please provide your last name." })
    .min(3, {
      message: "Last name must be at least 3 characters.",
    })
    .max(10, { message: "Last name must not exceed 10 characters." })
    .trim(),
});

export const BasicDetailsFormSchema = z.object({
  gender: z
    .enum(["male", "female"], {
      required_error: "Gender must be either 'male' or 'female'.",
    })
    .refine((value) => value !== undefined, {
      message: "Please specify your gender.",
    }),
  dateOfBirth: z
    .string()
    .min(1, { message: "Please provide your date of birth." })
    .refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date format. Please enter a valid date.",
      },
    )
    .refine(
      (value) => {
        const date = new Date(value);
        return date <= new Date();
      },
      {
        message: "Date of birth cannot be in the future.",
      },
    ),
});

export const AccountDetailsFormSchema = z
  .object({
    email: z
      .string()
      .email()
      .min(1, { message: "Please provide your email address." })
      .trim(),
    password: z
      .string()
      .min(1, { message: "Please provide your password." })
      .refine(
        (value) => new RegExp(import.meta.env.PASSWORD_REGEX).test(value),
        {
          message:
            "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
        },
      ),
    passwordConfirm: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match.",
  });
