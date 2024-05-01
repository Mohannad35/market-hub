"use client";

import { useProduct } from "@/hook/use-query-hooks";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { Slider } from "./Slider";
import { Spinner } from "@nextui-org/spinner";

const ProductDetails = ({ slug }: { slug: string }) => {
  const query = new URLSearchParams([
    ...Array.from(useSearchParams().entries()),
    ["populate", "brand,category"],
  ]);
  const { data, error, isSuccess, isLoading, isRefetching, refetch } = useProduct(slug, query);

  if (isLoading || isRefetching)
    return (
      <Flex className="h-[calc(100vh-120px)]" width="100%" justify="center" align="center">
        <Spinner />
      </Flex>
    );
  else if (error) return <div className="container">Error: {error.message}</div>;
  else if (!isSuccess || !data) return <div className="container">No data</div>;
  return (
    <Flex width="100%" direction={{ initial: "column", md: "row" }} gap="1rem">
      <Slider items={data.image.map((img, i) => ({ id: i, url: img }))} />
      <Flex direction="column" gap="1rem" width="100%">
        <Heading>{data.name}</Heading>
        <Text>{data.description}</Text>
        <Text>{data.price}</Text>
      </Flex>
    </Flex>
  );
};

export default ProductDetails;
