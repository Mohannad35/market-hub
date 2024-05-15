import { object } from "zod";
import {
  dateSchema,
  enumSchema,
  imageSchema,
  regexSchema,
  stringMinMaxSchema,
  stringSchema,
} from "./common-schema";

export const passwordSchema = stringSchema("Password").superRefine(
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

const phoneNumberSchema = object({
  number: stringMinMaxSchema("Phone Number", 8, 25),
  country: stringMinMaxSchema("Country", 2, 256),
  nationalNumber: stringMinMaxSchema("Phone Number", 8, 15),
  countryCallingCode: stringMinMaxSchema("Phone Number", 2, 100),
});

export const usernameSchema = regexSchema(
  /^[a-zA-Z0-9\.!~_-]{3,100}$/g,
  "Username may not contain non-url-safe chars"
);

export const signUpSchema = object({
  name: stringMinMaxSchema("Name", 2, 256),
  email: stringSchema("Email").email("Invalid email"),
  password: passwordSchema,
  username: usernameSchema,
  address: stringMinMaxSchema("Address", 2, 10_000).nullish(),
  businessAddress: stringMinMaxSchema("Business Address", 2, 10_000).nullish(),
  websiteAddress: stringMinMaxSchema("Website Address", 2, 10_000).nullish(),
  image: imageSchema.nullish(),
  gender: enumSchema("Gender", ["male", "female"]).nullish(),
  birthday: dateSchema("Birthday", 18, 100).nullish(),
  phoneNumber: phoneNumberSchema.nullish(),
});

export const editProfileSchema = signUpSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, "At least one field is required");

export const emailOrUsernameSchema = stringSchema("Email or Username").refine(value => {
  if (value.includes("@"))
    return stringSchema("Email").email("Invalid email").safeParse(value).success;
  else return stringMinMaxSchema("Username", 2, 256).safeParse(value).success;
}, "Invalid email or username");

export const signInSchema = object({
  email: emailOrUsernameSchema,
  password: passwordSchema,
});
