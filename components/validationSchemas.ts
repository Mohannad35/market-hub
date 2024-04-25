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
  .max(256, "Name must contain at most 256 character(s)");

export const descriptionSchema = z
  .string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  })
  .min(2, "Description must contain at least 2 character(s)");

export const urlSchema = z
  .string({
    invalid_type_error: "URL must be a string",
    required_error: "URL is required",
  })
  .url("Invalid URL");

export const imageSchema = z
  .array(urlSchema, {
    invalid_type_error: "Image must be an array",
    required_error: "Image is required",
  })
  .min(1, "Image must contain at least 1 URL(s)")
  .max(5, "Image must contain at most 5 URL(s)");

export const newProductSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  price: priceSchema,
  quantity: quantitySchema,
  image: imageSchema,
});

export const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const querySchema = z.object({
  sortBy: z
    .string()
    .regex(/^(title|description|status|priority|createdAt)$/g)
    .default("createdAt"),
  direction: z
    .string()
    .regex(/^(asc|desc|ascending|descending)$/g)
    .default("desc")
    .transform(value => value.replace(/ending$/, "")),
  populate: z
    .enum(["true", "false"])
    .transform(value => (value === "true" ? true : false))
    .optional(),
  status: z
    .string()
    .regex(/^(OPEN|IN_PROGRESS|CLOSED|CANCELLED)(,(OPEN|IN_PROGRESS|CLOSED|CANCELLED))*$/g)
    .transform(value => value.split(","))
    .optional(),
  search: z
    .string()
    .nullable()
    .transform(value => (value === "" || value === null ? undefined : value))
    .optional(),
  take: z
    .string()
    .regex(/^[0-9]+$/g, "Invalid take value")
    .transform(value => parseInt(value))
    .optional(),
  skip: z
    .string()
    .regex(/^[0-9]+$/g, "Invalid skip value")
    .transform(value => parseInt(value))
    .optional(),
});
