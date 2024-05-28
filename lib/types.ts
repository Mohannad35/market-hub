import {
  Brand,
  Cart,
  CartItem,
  Category,
  Product,
  Rate,
  User,
  Token,
  Coupon,
  Order,
} from "@prisma/client";

export type Modify<T, R> = Omit<T, keyof R> & R;

export interface OrderIncluded extends Order {
  user: User;
  cart: CartWithItems;
  coupon: Coupon;
}

export interface CouponWithUser extends Coupon {
  user: User;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface CartWithItems extends Cart {
  cartItems: CartItemWithProduct[];
}

export interface UserWithToken extends User {
  tokens: Token[];
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
