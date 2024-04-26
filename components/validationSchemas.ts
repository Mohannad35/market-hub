import { capitalize } from "lodash";
import { z } from "zod";

export const quantitySchema = z
  .number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity must be a number",
  })
  .int("Quantity must be an integer")
  .positive("Quantity must be a positive integer");

export const priceSchema = z
  .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
  .positive("Price must be a positive number");

export const nameSchema = z
  .string({ required_error: "Name is required", invalid_type_error: "Name must be a string" })
  .min(2, "Name must contain at least 2 character(s)")
  .max(128, "Name must contain at most 256 character(s)");

export const descriptionSchema = z
  .string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  })
  .min(2, "Description must contain at least 2 character(s)");

export const urlSchema = (label?: string) =>
  z
    .string({
      invalid_type_error: `${label || "URL"} must be a string`,
      required_error: `${label || "URL"} is required`,
    })
    .url("Invalid URL");

export const imageSchema = z
  .array(urlSchema(), {
    invalid_type_error: "Image must be an array",
    required_error: "Image is required",
  })
  .min(1, "Image must contain at least 1 URL(s)")
  .max(5, "Image must contain at most 5 URL(s)");

export const idSchema = (label?: string) =>
  z
    .string({
      invalid_type_error: `${label || "Id"} must be a string`,
      required_error: `${label || "Id"} is required`,
    })
    .regex(/^[a-f\d]{24}$/i, `Invalid ${label || "Id"}`);

export const booleanSchema = (label?: string) =>
  z
    .enum(["true", "false"], {
      required_error: `${label || "Boolean"} is required`,
      invalid_type_error: `${label || "Boolean"} must be a string`,
      message: `${label || "Boolean"} must be either true or false`,
    })
    .transform(value => (value === "true" ? true : false));

export const integerSchema = (label: string) =>
  z
    .string({
      invalid_type_error: `${label} must be a string`,
      required_error: `${label} is required`,
    })
    .regex(/^[0-9]+$/g, "Invalid take value");

export const numberSchema = (label: string) =>
  z
    .string({
      invalid_type_error: `${label} must be a string`,
      required_error: `${label} is required`,
    })
    .regex(/^[+-]?([0-9]*[.])?[0-9]+$/g, `Invalid ${label} value`);

export const sortBySchema = (regex: RegExp, label?: string, def?: string) =>
  z
    .string({
      invalid_type_error: `${label || "sortBy"} must be a string`,
      required_error: `${label || "sortBy"} is required`,
    })
    .regex(regex, `Invalid ${label || "sortBy"}`)
    .default(def || "createdAt");

export const searchSchema = (label: string) =>
  z
    .string({
      invalid_type_error: `${label || "search"} must be a string`,
      required_error: `${label || "search"} is required`,
    })
    .nullable()
    .optional()
    .transform(value => (["", null, undefined].includes(value) ? undefined : value));

const directionSchema = (label: string) =>
  z
    .string({
      invalid_type_error: `${label || "direction"} must be a string`,
      required_error: `${label || "direction"} is required`,
    })
    .regex(/^(asc|desc|ascending|descending)$/g)
    .default("asc")
    .transform(value => value.replace(/ending$/, ""));

const populateSchema = (regex: RegExp, label?: string) =>
  z
    .string({
      invalid_type_error: `${label || "populate"} must be a string`,
      required_error: `${label || "populate"} is required`,
    })
    .regex(regex, `Invalid ${label || "populate"} value`)
    .optional()
    .transform(value => (value ? value.split(",") : undefined));

export const newProductSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  price: numberSchema("Price").transform(value => parseFloat(value)),
  quantity: integerSchema("Quantity").transform(value => parseInt(value)),
  image: imageSchema,
});

export const newBrandSchema = z.object({
  name: nameSchema,
  image: urlSchema("Image").optional(),
});

export const newCategorySchema = z.object({
  name: nameSchema,
  predecessorId: idSchema("Predecessor ID").optional(),
  image: urlSchema("Image").optional(),
});

export const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const brandQuerySchema = z.object({
  take: integerSchema("Take")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  skip: integerSchema("Skip")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
});

export const categoryQuerySchema = z.object({
  take: integerSchema("Take")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  skip: integerSchema("Skip")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  predecessorId: idSchema("Predecessor ID").optional(),
  main: booleanSchema("Main").optional(),
});

export const productQuerySchema = z.object({
  take: integerSchema("Take")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  skip: integerSchema("Skip")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  sortBy: sortBySchema(/^(name|price|createdAt|sold|rating)$/g),
  direction: directionSchema("Direction"),
  search: searchSchema("Search"),
  categoryId: idSchema("Category ID").optional(),
  brandId: idSchema("Brand ID").optional(),
  minPrice: numberSchema("Min Price")
    .optional()
    .transform(value => (value ? parseFloat(value) : undefined)),
  maxPrice: numberSchema("Max Price")
    .optional()
    .transform(value => (value ? parseFloat(value) : undefined)),
  populate: populateSchema(/^(category|brand|vendor)$/g, "Populate"),
});
