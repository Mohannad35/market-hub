"use client";

import MuiRating from "@/components/common/Rating";
import { ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Rating } from "flowbite-react";
import { getProduct } from "./getProduct";
import { Spinner } from "@nextui-org/react";

const ProductRates = ({ slug }: { slug: string }) => {
  const { data, error, isSuccess, isLoading, isRefetching, refetch } =
    useQuery<ProductWithBrandAndCategoryAndRates>({
      queryKey: ["product", slug],
      queryFn: getProduct,
    });

  if (isLoading || isRefetching)
    return (
      <Flex width="100%" justify="center" align="center">
        <Spinner />
      </Flex>
    );
  else if (error) return <div className="container">Error: {error.message}</div>;
  else if (!isSuccess || !data) return <div className="container">No data</div>;
  else if (!data) return <div className="container">No data</div>;
  const { rating, ratingCount, rates } = data;
  return (
    <Flex gapX="4" pb="9">
      <Flex direction="column" width="30rem">
        <Rating className="mb-2 gap-2">
          <MuiRating rating={rating} icon={<Rating.Star />} />
          <Text size="4" className="text-muted-foreground">
            {rating} out of 5
          </Text>
        </Rating>
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          1,745 global ratings
        </p>
        <Rating.Advanced percentFilled={70} className="mb-2">
          5 star
        </Rating.Advanced>
        <Rating.Advanced percentFilled={17} className="mb-2">
          4 star
        </Rating.Advanced>
        <Rating.Advanced percentFilled={8} className="mb-2">
          3 star
        </Rating.Advanced>
        <Rating.Advanced percentFilled={4} className="mb-2">
          2 star
        </Rating.Advanced>
        <Rating.Advanced percentFilled={1}>1 star</Rating.Advanced>
      </Flex>
    </Flex>
  );
};

export default ProductRates;
