import { capitalize } from "lodash";
import { z } from "zod";

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
