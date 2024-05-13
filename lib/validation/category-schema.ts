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

export const newCategorySchema = object({
  name: stringMinMaxSchema("Name", 2, 256).transform(val => val.toLowerCase()),
  parent: regexSchema(/^\/[ \w&-]*(\/[ \w&-]+)*$/g, "Path")
    .optional()
    .transform(val => (val ? val.toLowerCase() : undefined)),
  image: imageSchema.optional(),
}).strict();

export const editCategorySchema = newCategorySchema
  .partial()
  .refine(data => Object.keys(data).length > 0, "At least one field is required");

export const categoryQuerySchema = object({
  pageSize: integerSchema("Page Size")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  page: integerSchema("Page")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  path: regexSchema(/^\/[ \w&-]+(\/[ \w&-]+)*$/g, "Path")
    .optional()
    .transform(val => val && val.toLowerCase()),
  sortBy: regexSchema(/^(name|createdAt)$/g, "Sort By").default("createdAt"),
  direction: directionSchema("Direction"),
  search: searchSchema("Search"),
  populate: populateSchema(/^(products)$/g, "Populate"),
});
