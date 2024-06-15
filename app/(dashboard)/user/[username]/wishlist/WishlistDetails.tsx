"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import Pagination from "@/components/common/Pagination";
import ProductCard from "@/components/product/ProductCard";
import ProductCardContainer from "@/components/product/ProductCardContainer";
import { getWishlist } from "@/lib/query-functions/wishlist";
import { ListWithProducts } from "@/lib/types";
import { Flex, Grid, Text } from "@radix-ui/themes";
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
      <Flex width="100%" direction="column" align="center" gapY="5">
        <Grid columns={{ initial: "2", sm: "2", md: "3", lg: "4" }} gapX="6" gapY="8" width="dauto">
          {data.products.map((item, index) => (
            <ProductCard
              key={index}
              item={item}
              showDelete={false}
              showEdit={false}
              showFav
              className="h-[16rem] w-[16rem]"
              width="16rem"
            />
          ))}
        </Grid>
        {data.products.length && <Pagination count={data.products.length} />}
      </Flex>
    </Flex>
  );
};

export default WishlistDetails;
