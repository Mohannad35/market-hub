"use client";

import BrandPopover from "@/components/product/BrandPopover";
import CategorySelect from "@/components/product/CategorySelect";
import SortBy from "@/components/product/SortBy";
import { Card } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import PriceFilter from "./PriceFilter";

const sortOpts = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Title: A-Z", value: "name-asc" },
  { label: "Title: Z-A", value: "name-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Popular", value: "sold-desc" },
  { label: "Rating", value: "rating-desc" },
];

const ProductFilter = ({ count }: { count: number }) => {
  return (
    <Card className="p-4">
      <Flex
        gap="4"
        width="100%"
        direction={{ initial: "column", md: "row" }}
        justify={{ initial: "start", md: "between" }}
        align={{ initial: "start", md: "center" }}
      >
        <Text size="3" weight="medium" wrap="nowrap">
          Products <span className="text-muted-foreground">({count})</span>
        </Text>
        <Flex direction="row" wrap="wrap" width="100%" gap="2" justify="end">
          <CategorySelect uniqueKey="searchCategories" />
          <BrandPopover uniqueKey="searchBrands" />
          <PriceFilter />
          <SortBy sortOpts={sortOpts} />
        </Flex>
      </Flex>
    </Card>
  );
};

export default ProductFilter;
