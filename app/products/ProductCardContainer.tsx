"use client";

import Pagination from "@/components/common/Pagination";
import { useProducts } from "@/hook/use-query-hooks";
import { Flex, Text } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Spinner } from "@nextui-org/spinner";

const ProductCardContainer = () => {
  const searchParams = useSearchParams();
  const { data, isSuccess, error, isLoading, isRefetching, refetch } = useProducts(searchParams);

  useEffect(() => {
    refetch();
  }, [refetch, searchParams]);

  if (isLoading || isRefetching)
    return (
      <Flex height="100%" width="100%" justify="center" align="center">
        <Spinner />
      </Flex>
    );
  else if (error) return <Text>Error: {error.message}</Text>;
  else if (!isSuccess) return <Text>No products found</Text>;
  const { products, count } = data;
  if (count === 0)
    return (
      <Flex width="100%" direction="column" align="center" gapY="5">
        <Text size="5">No products found</Text>
      </Flex>
    );
  return (
    <Flex width="100%" direction="column" align="center" gapY="5">
      <Flex width="100%" direction="row" wrap="wrap" gap="3" justify="start" align="start">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Flex>
      <Pagination count={count} />
    </Flex>
  );
};

export default ProductCardContainer;
