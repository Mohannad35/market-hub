"use client";

import { Product } from "@prisma/client";
import ProductCard from "./ProductCard";
import { Flex } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Pagination } from "@nextui-org/react";
import { useState } from "react";

const ProductCardContainer = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: products, isSuccess, error, isLoading } = useProducts(searchParams);

  if (isLoading) return <p>Loading...</p>;
  else if (error) return <p>Error: {error.message}</p>;
  else if (!isSuccess) return <p>No products found</p>;
  return (
    <Flex direction="column" align="center" gapY='5'>
      <Flex direction="row" wrap="wrap" gap="5" justify="start" align="start">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </Flex>
      <Pagination
        showControls
        color="primary"
        total={10}
        page={currentPage}
        onChange={setCurrentPage}
      />
    </Flex>
  );
};

export default ProductCardContainer;

const useProducts = (searchParams: ReadonlyURLSearchParams) => {
  const query = searchParams.toString();
  return useQuery<Product[]>({
    queryKey: ["issues"],
    queryFn: () => fetch(`/api/products${query ? "?" + query : ""}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};
