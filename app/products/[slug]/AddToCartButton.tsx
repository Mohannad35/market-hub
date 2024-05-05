"use client";

import { Button } from "@nextui-org/react";
import { Text } from "@radix-ui/themes";

const AddToCartButton = () => {
  return (
    <Button size="sm" color="primary" className="xs w-[8rem] max-w-xs max-[767px]:w-full">
      <Text size="4" weight="medium">
        Add to cart
      </Text>
    </Button>
  );
};

export default AddToCartButton;
