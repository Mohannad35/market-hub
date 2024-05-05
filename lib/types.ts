import { Brand, Category, Product, Rate } from "@prisma/client";

export interface ProductWithBrandAndCategoryAndRates extends Product {
  brand: Brand;
  category: Category;
  rates: Rate[];
}

export interface ProductWithBrandAndCategory extends Product {
  brand: Brand;
  category: Category;
}

export interface ProductWithRates extends Product {
  rates: Rate[];
}
