"use client";

import Pagination from "@/components/common/Pagination";
import { Flex, Grid, GridProps, Text } from "@radix-ui/themes";
import ProductCard from "./ProductCard";

type Props = {
  items: any[];
  count: number;
  label: string;
  width?: string;
  className?: string;
  showDelete: boolean;
  showEdit: boolean;
  showFav: boolean;
  columns?: GridProps["columns"];
};
const ProductCardContainer = ({ items, count, label, columns, ...props }: Props) => {
  if (count === 0)
    return (
      <Flex width="100%" direction="column" align="center" gapY="5">
        <Text size="5">No {label} found</Text>
      </Flex>
    );
  return (
    <Flex width="100%" direction="column" align="center" gapY="5">
      <Grid
        columns={columns || { initial: "2", sm: "3", md: "4", lg: "5", xl: "5" }}
        gapX="6"
        gapY="8"
        width="dauto"
      >
        {items && items.map((item, index) => <ProductCard key={index} item={item} {...props} />)}
      </Grid>
      {count && <Pagination count={count} />}
    </Flex>
  );
};

export default ProductCardContainer;
