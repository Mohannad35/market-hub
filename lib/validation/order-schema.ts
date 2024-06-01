import { object, z } from "zod";
import { idSchema, phoneNumberSchema, regexSchema, stringSchema } from "./common-schema";

export type OrderValues = z.infer<typeof orderSchema>;
export const orderSchema = object({
  cartId: idSchema("Cart ID").optional(),
  address: stringSchema("Address"),
  phone: phoneNumberSchema,
  email: stringSchema("Email").email(),
  payment: stringSchema("Payment"),
  couponId: idSchema("Coupon ID").optional(),
}).strict();

export const orderQuerySchema = object({
  search: stringSchema("Search")
    .nullish()
    .transform(value => (value === "" ? undefined : value === null ? undefined : value)),
  sortBy: regexSchema(
    /^(code|user|address|phone|email|payment|bill|discount|status|coupon|createdAt)$/,
    "Sort By"
  ).default("createdAt"),
  direction: regexSchema(/^(asc|desc|ascending|descending)$/g, "Direction")
    .default("desc")
    .transform(value => value.replace(/ending$/, "")),
  admin: regexSchema(/^(true|false)$/g, "Admin")
    .default("false")
    .transform(value => (value === "true" ? true : false)),
}).strict();
