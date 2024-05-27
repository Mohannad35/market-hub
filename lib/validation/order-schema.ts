import { array, number, object, z } from "zod";
import { idSchema, integerSchema, phoneNumberSchema, stringSchema } from "./common-schema";

export type OrderValues = z.infer<typeof orderSchema>;
export const orderSchema = object({
  cartId: idSchema("Cart ID").optional(),
  address: stringSchema("Address"),
  phone: phoneNumberSchema,
  email: stringSchema("Email").email(),
  payment: stringSchema("Payment"),
  couponId: idSchema("Coupon ID").optional(),
}).strict();
