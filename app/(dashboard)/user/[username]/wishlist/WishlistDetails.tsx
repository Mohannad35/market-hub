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
  if (!isSuccess || !data || data.products.length < 1) return <Text>Wishlist is empty</Text>;

  return (
    <Flex width="100%" direction="column" justify="start" align="start" gap="4">
      <Text size="6" weight="medium">
        Wishlist
      </Text>
      <ProductCardContainer
        label="products"
        items={data.products}
        count={data.products.length}
        showDelete={false}
        showEdit={false}
        showFav
        className="h-[16rem]"
        columns={{ initial: "1", xs: "2", sm: "2", md: "3", lg: "4" }}
      />
    </Flex>
  );
};

export default WishlistDetails;
