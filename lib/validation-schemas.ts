import { z } from "zod";

export const stringSchema = (label: string) =>
  z.string({
    required_error: `${label} is required`,
    invalid_type_error: `${label} must be a string`,
  });

export const stringMinMaxSchema = (label: string, min: number, max: number) =>
  z
    .string({
      required_error: `${label} is required`,
      invalid_type_error: `${label} must be a string`,
    })
    .min(min, `${label} must contain at least ${min} character(s)`)
    .max(max, `${label} must contain at most ${max} character(s)`);

export const idSchema = (label?: string) =>
  z
    .string({
      invalid_type_error: `${label || "Id"} must be a string`,
      required_error: `${label || "Id"} is required`,
    })
    .regex(/^[a-f\d]{24}$/i, `Invalid ${label || "Id"}`);

const booleanSchema = (label?: string) =>
  z.enum(["true", "false"], {
    required_error: `${label || "Boolean"} is required`,
    invalid_type_error: `${label || "Boolean"} must be a string`,
    message: `${label || "Boolean"} must be either true or false`,
  });

export const integerSchema = (label: string) =>
  z
    .string({
      invalid_type_error: `${label} must be a string`,
      required_error: `${label} is required`,
    })
    .regex(/^[0-9]+$/g, `Invalid ${label} value`);

export const positiveNumberSchema = (label: string) =>
  z
    .string({
      invalid_type_error: `${label} must be a string`,
      required_error: `${label} is required`,
    })
    .regex(/^([0-9]*[.])?[0-9]*$/g, `Invalid ${label} value`);

export const numberSchema = (label: string) =>
  z
    .string({
      invalid_type_error: `${label} must be a string`,
      required_error: `${label} is required`,
    })
    .regex(/^[+-]?([0-9]*[.])?[0-9]+$/g, `Invalid ${label} value`);

export const regexSchema = (regex: RegExp, label: string) =>
  z
    .string({
      invalid_type_error: `${label} must be a string`,
      required_error: `${label} is required`,
    })
    .regex(regex, `Invalid ${label || "sortBy"}`);

const searchSchema = (label: string) =>
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
    .default("desc")
    .transform(value => value.replace(/ending$/, ""));

const populateSchema = (regex: RegExp, label?: string) =>
  stringMinMaxSchema(label || "Populate", 2, 100)
    .regex(regex, `Invalid ${label || "Populate"} value`)
    .optional()
    .transform(value => (value ? Array.from(new Set(value.split(","))) : undefined));

const populateProductSchema = populateSchema(
  /^(category|brand|vendor|rates|lists|cartItems)(,(category|brand|vendor|rates|lists|cartItems))*$/g,
  "Populate"
);

const imageSchema = z
  .array(stringSchema("URL").url("Invalid URL"), {
    invalid_type_error: "Image must be an array",
    required_error: "Image is required",
  })
  .min(1, "Image must contain at least 1 image(s)")
  .max(10, "Image must contain at most 10 image(s)");

export const newProductSchema = z
  .object({
    name: stringMinMaxSchema("Name", 4, 256),
    description: stringMinMaxSchema("Name", 2, 10_000),
    price: numberSchema("Price").transform(value => parseFloat(value)),
    quantity: integerSchema("Quantity").transform(value => parseInt(value)),
    image: imageSchema,
    categoryId: idSchema("Category"),
    brandId: idSchema("Brand"),
  })
  .strict();

export const editProductSchema = newProductSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, "At least one field is required");

export const newBrandSchema = z
  .object({
    name: stringMinMaxSchema("Name", 2, 256),
    image: stringSchema("Image").url("Invalid URL").optional(),
  })
  .strict();

export const editBrandSchema = newBrandSchema
  .partial()
  .refine(data => Object.keys(data).length > 0, "At least one field is required");

export const newCategorySchema = z
  .object({
    name: stringMinMaxSchema("Name", 2, 256).transform(val => val.toLowerCase()),
    parent: regexSchema(/^\/[ \w&-]*(\/[ \w&-]+)*$/g, "Path")
      .optional()
      .transform(val => (val ? val.toLowerCase() : undefined)),
    image: stringSchema("Image").url("Invalid URL").optional(),
  })
  .strict();

export const editCategorySchema = newCategorySchema
  .partial()
  .refine(data => Object.keys(data).length > 0, "At least one field is required");

export const newRateSchema = z
  .object({
    rate: numberSchema("Rate")
      .transform(value => parseFloat(value))
      .refine(value => value > 0 && value <= 5, "Rate must be between 0 and 5"),
    comment: stringMinMaxSchema("Comment", 2, 10_000).optional(),
    productId: idSchema("Product"),
  })
  .strict();

export const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const brandQuerySchema = z.object({
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

export const categoryQuerySchema = z.object({
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

export const productQuerySchema = z.object({
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
  popular: booleanSchema("Popular")
    .optional()
    .transform(value => (value ? (value === "true" ? true : false) : undefined)),
});

export const productDetailsQuerySchema = z.object({
  populate: populateProductSchema,
});

export const productRatesQuerySchema = z
  .object({
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
  })
  .refine(
    ({ productId, productSlug }) => productId || productSlug,
    "Product Id or Slug is required"
  );

export const adminUploadSchema = z
  .object({
    publicId: z
      .array(stringSchema("Public Id").min(3, "Public Id must contain at least 3 character(s)"))
      .min(1, "Public Ids must contain at least 1 Public Id"),
  })
  .strict();
