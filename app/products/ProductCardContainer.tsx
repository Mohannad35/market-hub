"use client";

import Pagination from "@/components/common/Pagination";
import { useProducts } from "@/hook/use-query-hooks";
import { Flex } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ProductCard from "./ProductCard";

const ProductCardContainer = () => {
  const searchParams = useSearchParams();
  const { data, isSuccess, error, isLoading, refetch } = useProducts(searchParams);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (isLoading) return <p>Loading...</p>;
  else if (error) return <p>Error: {error.message}</p>;
  else if (!isSuccess) return <p>No products found</p>;
  const { products, count } = data;
  return (
    <Flex width="100%" direction="column" align="center" gapY="5">
      <Flex width="100%" direction="row" wrap="wrap" gap="5" justify="start" align="start">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Flex>
      <Pagination count={count} />
    </Flex>
  );
};

export default ProductCardContainer;
