"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import ProductCardContainer from "@/components/product/ProductCardContainer";
import { getWishlist } from "@/lib/query-functions/wishlist";
import { ListWithProducts } from "@/lib/types";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";

const WishlistDetails = () => {
  const { data, error, isSuccess, isLoading } = useQuery<ListWithProducts>({
    queryKey: ["getWishlist"],
    queryFn: getWishlist,
  });

  if (isLoading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>Category not found</Text>;

  return (
    <Flex width="100%" direction="column" justify="start" align="start" gap="4">
      <Text size="6" weight="medium">
        Wishlist
      </Text>
      <ProductCardContainer
        label="Products"
        items={data.products}
        count={data.products.length}
        showDelete={false}
        showEdit={false}
        showFav
      />
    </Flex>
  );
};

export default WishlistDetails;
