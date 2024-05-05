import { Brand, Category, Product, Rate, User } from "@prisma/client";

export interface ProductWithBrandAndCategoryAndRates extends Product {
  brand: Brand;
  category: Category;
  rates: RateWithUser[];
}

export interface RateWithUser extends Rate {
  user: User;
}

export interface ProductWithBrandAndCategory extends Product {
  brand: Brand;
  category: Category;
}

export interface ProductWithRates extends Product {
  rates: Rate[];
}
