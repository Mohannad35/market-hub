import moment from "moment";
import { array, coerce, date, enum as enum_, object, string } from "zod";

export const stringSchema = (label: string) =>
  string({
    required_error: `${label} is required`,
    invalid_type_error: `${label} must be a string`,
  });

export const stringMinMaxSchema = (label: string, min: number, max: number) =>
  stringSchema(label)
    .min(min, `${label} must contain at least ${min} character(s)`)
    .max(max, `${label} must contain at most ${max} character(s)`);

export const regexSchema = (regex: RegExp, label: string) =>
  stringSchema(label).regex(regex, `Invalid ${label}`);

export const idSchema = (label?: string) =>
  stringSchema(label || "Id").regex(/^[a-f\d]{24}$/i, `Invalid ${label || "Id"}`);

export const integerSchema = (label: string) =>
  stringSchema(label).regex(/^[0-9]+$/g, `Invalid ${label} value`);

export const positiveNumberSchema = (label: string) =>
  stringSchema(label).regex(/^([0-9]*[.])?[0-9]*$/g, `Invalid ${label} value`);

export const numberSchema = (label: string) =>
  stringSchema(label).regex(/^[+-]?([0-9]*[.])?[0-9]+$/g, `Invalid ${label} value`);

export const enumSchema = (label: string, values: [string, ...string[]]) =>
  enum_(values, {
    required_error: `${label} is required`,
    invalid_type_error: `${label} must be a string`,
    message: `${label} must be one of ${values.join(", ")}`,
  });

export const imageSchema = object({
  public_id: stringSchema("Public Id"),
  secure_url: stringSchema("Secure URL").url("Invalid Secure URL"),
});

export const dateSchema = (label: string, min: Date, max: Date) =>
  coerce
    .date({
      required_error: `${label} is required`,
      invalid_type_error: `${label} must be a date`,
    })
    .min(min, `Minimum ${label} is ${min.toDateString()}`)
    .max(max, `Maximum ${label} is ${max.toDateString()}`);

export const birthDateSchema = (label: string, min: number, max: number) =>
  coerce
    .date({
      required_error: `${label} is required`,
      invalid_type_error: `${label} must be a date`,
    })
    .min(moment().subtract(max, "years").toDate(), `You must be at most ${max} years old`)
    .max(moment().subtract(min, "years").toDate(), `You must be at least ${min} years old`)
    .optional();

export const searchSchema = (label: string) =>
  stringSchema(label)
    .nullable()
    .optional()
    .transform(value => (["", null, undefined].includes(value) ? undefined : value));

export const directionSchema = (label: string) =>
  stringSchema(label)
    .regex(/^(asc|desc|ascending|descending)$/g)
    .default("desc")
    .transform(value => value.replace(/ending$/, ""));

export const populateSchema = (regex: RegExp, label?: string) =>
  stringMinMaxSchema(label || "Populate", 2, 100)
    .regex(regex, `Invalid ${label || "Populate"} value`)
    .optional()
    .transform(value => (value ? Array.from(new Set(value.split(","))) : undefined));

export const adminUploadSchema = object({
  publicId: array(
    stringSchema("Public Id").min(3, "Public Id must contain at least 3 character(s)")
  ).min(1, "Public Ids must contain at least 1 Public Id"),
}).strict();

export const urlSchema = regexSchema(
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i,
  "URL"
);

export const phoneNumberSchema = object({
  number: stringMinMaxSchema("Phone Number", 8, 25),
  country: stringMinMaxSchema("Country", 2, 256),
  nationalNumber: stringMinMaxSchema("Phone Number", 8, 15),
  countryCallingCode: stringMinMaxSchema("Phone Number", 2, 100),
});
