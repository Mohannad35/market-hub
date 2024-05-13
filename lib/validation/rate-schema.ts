import { object } from "zod";
import { idSchema, numberSchema, stringMinMaxSchema } from "./common-schema";

export const newRateSchema = object({
  rate: numberSchema("Rate")
    .transform(value => parseFloat(value))
    .refine(value => value > 0 && value <= 5, "Rate must be between 0 and 5"),
  comment: stringMinMaxSchema("Comment", 2, 10_000).optional(),
  productId: idSchema("Product"),
}).strict();
