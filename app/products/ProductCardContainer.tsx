"use client";

import Pagination from "@/components/common/Pagination";
import ProductCard from "@/components/product/ProductCard";
import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Spinner } from "@nextui-org/spinner";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ProductCardContainer = () => {
  const searchParams = useSearchParams();
  const { data, isSuccess, error, isLoading, isRefetching, refetch } = useQueryHook<{
    products: Product[];
    count: number;
  }>("/api/products", ["products", searchParams.get("page") || "1"], searchParams.toString());

  useEffect(() => {
    refetch();
  }, [refetch, searchParams]);

  if (isLoading || isRefetching)
    return (
      <Flex className="h-[calc(100vh-120px)]" width="100%" justify="center" align="center">
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
