import { object } from "zod";
import {
  directionSchema,
  imageSchema,
  integerSchema,
  populateSchema,
  regexSchema,
  searchSchema,
  stringMinMaxSchema,
} from "./common-schema";

export const newBrandSchema = object({
  name: stringMinMaxSchema("Name", 2, 256),
  image: imageSchema.optional(),
}).strict();

export const editBrandSchema = newBrandSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, "At least one field is required");

export const brandQuerySchema = object({
  pageSize: integerSchema("Page Size")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  page: integerSchema("Page")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  sortBy: regexSchema(/^(name|createdAt)$/g, "Sort By").default("createdAt"),
  direction: directionSchema("Direction"),
  search: searchSchema("Search"),
  populate: populateSchema(/^(products)$/g, "Populate"),
});
