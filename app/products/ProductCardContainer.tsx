"use client";

import { Product } from "@prisma/client";
import ProductCard from "./ProductCard";

const ProductCardContainer = ({ list }: { list: Product[] }) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {list.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductCardContainer;
