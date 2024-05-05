"use client";

import { Button } from "@nextui-org/react";
import { Text } from "@radix-ui/themes";
import React from "react";

const BuyNowButton = () => {
  return (
    <Button size="sm" color="primary" className="w-[8rem] max-w-xs max-[767px]:w-full">
      <Text size="4" weight="medium">
        Buy now
      </Text>
    </Button>
  );
};

export default BuyNowButton;
