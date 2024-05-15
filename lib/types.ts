import { Brand, Category, Product, Rate, User, VerificationToken } from "@prisma/client";

export type Modify<T, R> = Omit<T, keyof R> & R;

export interface UserWithToken extends User {
  verificationToken: VerificationToken;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export interface BrandWithProducts extends Brand {
  products: Product[];
}

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
