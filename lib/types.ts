import { Category } from "@prisma/client";

export interface CategoryWithSuccessors extends Category {
  successors: Category[];
}
