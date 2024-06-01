"use client";

import Pagination from "@/components/common/Pagination";
import { Modify } from "@/lib/types";
import { Flex, FlexProps, Text } from "@radix-ui/themes";
import ProductCard from "./ProductCard";

type Props = Modify<
  FlexProps,
  {
    items: any[];
    count: number;
    label: string;
    showDelete: boolean;
    showEdit: boolean;
    showFav: boolean;
  }
>;
const ProductCardContainer = ({
  items,
  count,
  label,
  showDelete,
  showEdit,
  showFav,
  ...props
}: Props) => {
  if (count === 0)
    return (
      <Flex width="100%" direction="column" align="center" gapY="5">
        <Text size="5">No {label} found</Text>
      </Flex>
    );
  return (
    <Flex width="100%" direction="column" align="center" gapY="5">
      <Flex
        width="100%"
        direction="row"
        wrap="wrap"
        gap="6"
        justify="start"
        align="start"
        {...props}
      >
        {items &&
          items.map((item, index) => (
            <ProductCard
              key={index}
              item={item}
              showDelete={showDelete}
              showEdit={showEdit}
              showFav={showFav}
            />
          ))}
      </Flex>
      {count && <Pagination count={count} />}
    </Flex>
  );
};

export default ProductCardContainer;
