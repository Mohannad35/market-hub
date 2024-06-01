import { infer, object, z } from "zod";
import {
  birthDateSchema,
  enumSchema,
  imageSchema,
  phoneNumberSchema,
  regexSchema,
  stringMinMaxSchema,
  stringSchema,
} from "./common-schema";

export const usersQuerySchema = object({
  search: stringSchema("Search")
    .nullish()
    .transform(value => (value === "" ? undefined : value === null ? undefined : value)),
  sortBy: regexSchema(
    /^(user|verified|role|username|gender|phone|birthday|address|businessAddress|websiteAddress|banned|createdAt)$/,
    "Sort By"
  ).default("createdAt"),
  direction: regexSchema(/^(asc|desc|ascending|descending)$/g, "Direction")
    .default("desc")
    .transform(value => value.replace(/ending$/, "")),
}).strict();

export const password = stringSchema("Password").superRefine(
  (password: string, checkPassComplexity) => {
    const isUppercase = (ch: string) => /[A-Z]/.test(ch);
    const isLowercase = (ch: string) => /[a-z]/.test(ch);
    const isSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (isUppercase(ch)) countOfUpperCase++;
      else if (isLowercase(ch)) countOfLowerCase++;
      else if (isSpecialChar(ch)) countOfSpecialChar++;
    }
    if (countOfLowerCase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password must contain at least 1 lowercase letter",
      });
    }
    if (countOfUpperCase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password must contain at least 1 uppercase letter",
      });
    }
    if (countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password must contain at least 1 number",
      });
    }
    if (countOfSpecialChar < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password must contain at least 1 special character",
      });
    }
    if (password.length < 8) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password must contain at least 8 characters",
      });
    }
  }
);

export const usernameSchema = regexSchema(
  /^[a-zA-Z0-9\.!~_-]{3,100}$/g,
  "Username may not contain non-url-safe chars"
);

export type SignUpSchemaFormValues = z.infer<typeof signUpSchema>;
const signUp = object({
  name: stringMinMaxSchema("Name", 2, 256),
  email: stringSchema("Email").email("Invalid email"),
  password: password,
  confirmPassword: stringSchema("Confirm Password"),
  username: usernameSchema,
  address: stringMinMaxSchema("Address", 2, 10_000).optional(),
  businessAddress: stringMinMaxSchema("Business Address", 2, 10_000).optional(),
  websiteAddress: stringMinMaxSchema("Website Address", 2, 10_000).optional(),
  image: imageSchema.optional(),
  gender: enumSchema("Gender", ["male", "female"]).optional(),
  birthday: birthDateSchema("Birthday", 18, 100).optional(),
  phoneNumber: phoneNumberSchema.optional(),
});
export const signUpSchema = signUp.refine(
  ({ password, confirmPassword }) => password === confirmPassword,
  { message: "Passwords do not match", path: ["confirmPassword"] }
);
export const signUpModifiedSchema = signUp
  .omit({ phoneNumber: true })
  .extend({ phoneNumber: stringSchema("Phone Number").optional() })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editProfileSchema = signUp
  .partial()
  .refine(data => Object.keys(data).length > 0, "At least one field is required");

export const emailOrUsernameSchema = stringSchema("Email or Username").refine(value => {
  if (value.includes("@"))
    return stringSchema("Email").email("Invalid email").safeParse(value).success;
  else return stringMinMaxSchema("Username", 2, 256).safeParse(value).success;
}, "Invalid email or username");

export type SignInSchemaFormValues = z.infer<typeof signInSchema>;
export const signInSchema = object({
  username: emailOrUsernameSchema,
  password: stringSchema("Password"),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export const changePasswordSchema = object({
  oldPassword: stringSchema("Old Password"),
  newPassword: password,
  confirmPassword: stringSchema("Confirm Password"),
}).refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = object({
  email: stringSchema("Email").email("Invalid email"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export const verifyEmailSchema = object({
  token: stringSchema("Token"),
});

const passwordSchema = object({
  password: password,
  confirmPassword: stringSchema("Confirm Password"),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export const resetPasswordSchema = passwordSchema.refine(
  ({ password, confirmPassword }) => password === confirmPassword,
  { message: "Passwords do not match", path: ["confirmPassword"] }
);

export type ResetPasswordTokenFormValues = z.infer<typeof resetPasswordTokenSchema>;
export const resetPasswordTokenSchema = passwordSchema
  .extend({ token: stringSchema("Token") })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
