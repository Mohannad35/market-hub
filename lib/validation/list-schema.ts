import { object, z } from "zod";
import { idSchema, stringSchema } from "./common-schema";

export type ModifyListFormValues = z.infer<typeof modifyList>;
export const modifyList = object({
  listName: stringSchema("List Name").optional(),
  productId: idSchema("Product ID"),
});

export type ListNameFormValues = z.infer<typeof listNameSchema>;
export const listNameSchema = object({
  listName: stringSchema("List Name").optional(),
});
