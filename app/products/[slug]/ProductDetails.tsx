"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import Rating from "@/components/common/Rating";
import { getProduct } from "@/lib/query-functions/product";
import { ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { Selection } from "@nextui-org/react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";
import CategoriesBreadcrumbs from "./CategoriesBreadcrumbs";
import QuantitySelect from "./QuantitySelect";
import { Slider } from "./Slider";

const ProductDetails = ({ slug }: { slug: string }) => {
  const [selectedQuantity, setSelectedQuantity] = useState<Selection>(new Set(["1"]));
  const { data, error, isSuccess, isLoading, isRefetching, refetch } =
    useQuery<ProductWithBrandAndCategoryAndRates>({
      queryKey: ["product", slug],
      queryFn: getProduct,
    });

  if (isLoading || isRefetching) return <LoadingIndicator />;
  else if (error) return <div className="container">Error: {error.message}</div>;
  else if (!isSuccess || !data) return <div className="container">No data</div>;
  else if (!data) return <div className="container">No data</div>;
  const { image, name, description, price, quantity, brand, category, rating, ratingCount } = data;
  const { path } = category;
  return (
    <Flex direction="column" justify="start" gapY="2">
      <CategoriesBreadcrumbs path={path} />

      <Flex width="100%" direction={{ initial: "column", lg: "row" }} gap="1rem">
        <Slider items={image.map((img, i) => ({ id: i, url: img }))} />

        <Flex direction="column" gap="1rem" width="100%">
          <Heading>{name}</Heading>
          <Rating rating={rating} ratingCount={ratingCount} />

          <Flex align="start" className="text-muted-foreground">
            <Text size="2">EGP</Text>
            <Text size="8" style={{ lineHeight: "32px" }}>
              {price}
            </Text>
          </Flex>

          <Flex
            direction={{ initial: "column", sm: "row" }}
            gap="2"
            justify="between"
            align="start"
          >
            <QuantitySelect
              quantity={quantity}
              selectedQuantity={selectedQuantity}
              setSelectedQuantity={setSelectedQuantity}
            />

            <Flex
              direction={{ initial: "column", sm: "row" }}
              gap="2"
              justify="end"
              align="start"
              className="max-[767px]:w-full"
            >
              <AddToCartButton />
              <BuyNowButton />
            </Flex>
          </Flex>
          <Text size="5" weight="medium">
            Brand Name: {brand.name}
          </Text>
          <Text>{description}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProductDetails;
