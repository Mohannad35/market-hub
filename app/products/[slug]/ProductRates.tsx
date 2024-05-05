"use client";

import MuiRating from "@/components/common/Rating";
import { ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { AvatarIcon, Divider, User } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Rating } from "flowbite-react";
import { useSession } from "next-auth/react";
import AddRate from "./AddRate";
import { getProduct } from "./getProduct";
import { getRatingStats } from "./getRate";

const ProductRates = ({ slug }: { slug: string }) => {
  const { status } = useSession();
  const { data, error, isSuccess, isLoading, isRefetching, refetch } =
    useQuery<ProductWithBrandAndCategoryAndRates>({
      queryKey: ["product", slug],
      queryFn: getProduct,
    });
  const ratingStats = useQuery<{ _count: number; rate: number }[]>({
    queryKey: ["rate", slug],
    queryFn: getRatingStats,
  });

  if (isLoading || isRefetching || ratingStats.isLoading) return <></>;
  else if (error || ratingStats.error)
    return (
      <div className="container">
        Error: {error?.message} {ratingStats.error?.message}
      </div>
    );
  else if (!isSuccess || !data || !ratingStats.data)
    return <div className="container">No data</div>;
  const { id, rating, ratingCount, rates } = data;
  return (
    <Flex gapX="4" pb="9">
      <Flex direction="column" width="30rem" minWidth="30rem" gapY="2">
        <Flex gapX="2" justify="start" align="start">
          <MuiRating rating={rating} />
          <Text size="4" className="text-muted-foreground">
            {rating} out of 5
          </Text>
        </Flex>
        <Text size="4" className="text-muted-foreground">
          {ratingCount} global ratings
        </Text>
        <Flex direction="column" gapY="2">
          {[5, 4, 3, 2, 1].map((value, i) => {
            const count = ratingStats.data.find(val => val.rate === value)?._count || 0;
            const percentFilled = (count / (ratingCount || 1)) * 100;
            return (
              <Rating.Advanced key={i} percentFilled={percentFilled} className="mb-2">
                {value} star
              </Rating.Advanced>
            );
          })}
        </Flex>
      </Flex>

      <Flex width="100%" direction="column" gapY="4">
        {status === "authenticated" && <AddRate productId={id} refetchProduct={refetch} />}

        {rates.map((rate, index) => (
          <Flex key={index} direction="column" gapY="2" justify="start">
            {index !== 0 && <Divider className="my-2" />}
            <User
              name={rate.user.name}
              description={
                <Text>Reviewed in Egypt on {new Date(rate.createdAt).toDateString()}</Text>
              }
              avatarProps={{
                src: rate.user.image || undefined,
                showFallback: true,
                fallback: <AvatarIcon />,
                size: "sm",
              }}
              classNames={{ base: "flex justify-start items-center" }}
            />
            <MuiRating rating={rate.rate} readOnly />
            {rate.comment && (
              <Text size="3" className="text-muted-foreground">
                {rate.comment}
              </Text>
            )}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default ProductRates;
