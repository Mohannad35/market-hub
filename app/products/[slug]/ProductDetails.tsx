"use client";

import { useProduct } from "@/hook/use-query-hooks";
import { Flex } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { Slider } from "./Slider";

const ProductDetails = ({ slug }: { slug: string }) => {
  const query = new URLSearchParams([
    ...Array.from(useSearchParams().entries()),
    ["populate", "brand,category"],
  ]);
  const { data, error, isSuccess, isLoading, isRefetching, refetch } = useProduct(slug, query);

  if (isLoading || isRefetching) return <div className="container">Loading...</div>;
  else if (error) return <div className="container">Error: {error.message}</div>;
  else if (!isSuccess || !data) return <div className="container">No data</div>;
  return (
    <Flex direction={{ initial: "column", sm: "row" }} gap="4">
      <Slider items={data.image.map((img, i) => ({ id: i, url: img }))} />
    </Flex>
  );
};

export default ProductDetails;
