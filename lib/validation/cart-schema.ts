import { array, number, object, z } from "zod";
import { idSchema, integerSchema } from "./common-schema";

export const cartSchema = object({
  userId: idSchema("User Id"),
}).strict();

export type CartValues = z.infer<typeof cartSchemaPartial>;
export const cartSchemaPartial = cartSchema.partial();

export type AddToCartValues = z.infer<typeof addToCartSchema>;
export const addToCartSchema = object({
  cartId: idSchema("Cart Id").optional(),
  productId: idSchema("Product Id"),
  // integerSchema("Quantity").transform(value => parseInt(value))
  quantity: number({
    invalid_type_error: "Quantity must be a number",
    required_error: "Quantity is required",
  })
    .int("Quantity must be an integer")
    .positive("Quantity must be positive"),
}).strict();

export type DeleteFromCartValues = z.infer<typeof deleteFromCartSchema>;
export const deleteFromCartSchema = object({
  cartId: idSchema("Cart Id").optional(),
  productId: idSchema("Product Id"),
}).strict();
