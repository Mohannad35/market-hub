import moment from "moment";
import { object, z } from "zod";
import {
  dateSchema,
  integerSchema,
  positiveNumberSchema,
  regexSchema,
  stringMinMaxSchema,
  stringSchema,
} from "./common-schema";

export type CouponValues = z.infer<typeof couponSchema>;
const couponSchema = object({
  code: stringMinMaxSchema("Code", 3, 30),
  value: integerSchema("Value"),
  name: stringSchema("Name").optional(),
  description: stringSchema("Description").optional(),
  minAmount: positiveNumberSchema("Min Amount").optional(),
  maxAmount: positiveNumberSchema("Max Amount").optional(),
  startDate: dateSchema(
    "Start Date",
    moment().subtract(1, "day").toDate(),
    moment().add(1, "year").toDate()
  ),
  endDate: dateSchema(
    "End Date",
    moment().add(1, "day").toDate(),
    moment().add(1, "year").toDate()
  ),
});

export const createCouponSchema = couponSchema
  .strict()
  .refine(({ startDate, endDate }) => startDate < endDate, {
    message: "Start date must be before end date",
    path: ["startDate"],
  })
  .refine(({ value }) => parseInt(value) < 100, {
    message: "Value must be less than 100",
    path: ["value"],
  })
  .refine(
    ({ minAmount, maxAmount }) => {
      if (minAmount === undefined || maxAmount === undefined) return true;
      return parseInt(minAmount) < parseInt(maxAmount);
    },
    {
      message: "Min amount must be less than max amount",
      path: ["minAmount"],
    }
  );

export const editCouponSchema = couponSchema
  .strict()
  .partial()
  .refine(
    ({ startDate, endDate }) => {
      if (startDate === undefined || endDate === undefined) return true;
      return startDate < endDate;
    },
    { message: "Start date must be before end date", path: ["startDate"] }
  )
  .refine(({ value }) => (value ? parseInt(value) < 100 : true), {
    message: "Value must be less than 100",
    path: ["value"],
  })
  .refine(
    ({ minAmount, maxAmount }) => {
      if (minAmount === undefined || maxAmount === undefined) return true;
      return parseInt(minAmount) < parseInt(maxAmount);
    },
    { message: "Min amount must be less than max amount", path: ["minAmount"] }
  );

export const deleteCouponSchema = couponSchema.pick({ code: true }).strict();

export const applyCouponSchema = couponSchema.pick({ code: true }).strict();

export const couponQuerySchema = object({
  search: stringSchema("Search")
    .nullish()
    .transform(value => (value === "" ? undefined : value === null ? undefined : value)),
  sortBy: regexSchema(
    /^(code|value|name|description|endDate|startDate|minAmount|maxAmount|createdAt)$/,
    "Sort By"
  ).default("createdAt"),
  direction: regexSchema(/^(asc|desc|ascending|descending)$/g, "Direction")
    .default("desc")
    .transform(value => value.replace(/ending$/, "")),
  column: stringSchema("Column").optional(),
}).strict();
