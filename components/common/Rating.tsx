"use client";
import { Icon as Iconify } from "@iconify/react";
import { Rating as MuiRating, RatingProps } from "@mui/material";
import { Flex, Text } from "@radix-ui/themes";

interface Props extends RatingProps {
  ratingCount?: number;
}
const Rating = ({ ratingCount, ...props }: Props) => {
  return (
    <Flex direction="row" justify="start" align="center" gapX="2">
      <MuiRating
        icon={<Iconify icon="solar:star-bold" fontSize="inherit" />}
        emptyIcon={
          <Iconify icon="solar:star-bold" fontSize="inherit" className="dark:text-neutral-600" />
        }
        // className="z-20 cursor-pointer"
        {...props}
      />
      {ratingCount && <Text className="text-muted-foreground">{ratingCount} ratings</Text>}
    </Flex>
  );
};

export default Rating;
