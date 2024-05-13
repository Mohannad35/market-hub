import { array, object } from "zod";
import {
  directionSchema,
  enumSchema,
  idSchema,
  imageSchema,
  integerSchema,
  numberSchema,
  populateSchema,
  regexSchema,
  searchSchema,
  stringMinMaxSchema,
} from "./common-schema";

const populateProductSchema = populateSchema(
  /^(category|brand|vendor|rates|lists|cartItems)(,(category|brand|vendor|rates|lists|cartItems))*$/g,
  "Populate"
);

export const newProductSchema = object({
  name: stringMinMaxSchema("Name", 4, 256),
  description: stringMinMaxSchema("Name", 2, 10_000),
  price: numberSchema("Price").transform(value => parseFloat(value)),
  quantity: integerSchema("Quantity").transform(value => parseInt(value)),
  image: array(imageSchema, {
    invalid_type_error: "Image must be an array",
    required_error: "Image is required",
  })
    .min(1, "Image must contain at least 1 image(s)")
    .max(10, "Image must contain at most 10 image(s)"),
  categoryId: idSchema("Category"),
  brandId: idSchema("Brand"),
}).strict();

export const editProductSchema = newProductSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, "At least one field is required");

export const productQuerySchema = object({
  pageSize: integerSchema("Page Size")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  page: integerSchema("Page")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  sortBy: regexSchema(/^(name|price|createdAt|sold|rating)$/g, "Sort By").default("createdAt"),
  direction: directionSchema("Direction"),
  search: searchSchema("Search"),
  category: stringMinMaxSchema("Name", 2, 256).optional(),
  brands: stringMinMaxSchema("Brands", 2, 256)
    .optional()
    .transform(value => (value ? value.split(",") : undefined)),
  minPrice: numberSchema("Min Price")
    .optional()
    .transform(value => (value ? parseFloat(value) : undefined)),
  maxPrice: numberSchema("Max Price")
    .optional()
    .transform(value => (value ? parseFloat(value) : undefined)),
  populate: populateProductSchema,
  popular: enumSchema("Popular", ["true", "false"])
    .optional()
    .transform(value => (value ? (value === "true" ? true : false) : undefined)),
});

export const productDetailsQuerySchema = object({
  populate: populateProductSchema,
});

export const productRatesQuerySchema = object({
  pageSize: integerSchema("Page Size")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  page: integerSchema("Page")
    .optional()
    .transform(value => (value ? parseInt(value) : undefined)),
  sortBy: regexSchema(/^(name|price|createdAt|sold|rating)$/g, "Sort By").default("createdAt"),
  direction: directionSchema("Direction"),
  productId: idSchema("Product").optional(),
  productSlug: stringMinMaxSchema("Product Slug", 2, 256).optional(),
}).refine(
  ({ productId, productSlug }) => productId || productSlug,
  "Product Id or Slug is required"
);
