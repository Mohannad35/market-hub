"use client";

import { Button } from "@nextui-org/react";
import { Text } from "@radix-ui/themes";
import Link from "next/link";

const NewProductButton = () => {
  return (
    <Button fullWidth as={Link} type="submit" color="primary" href="/products/new">
      <Text size="3" weight="medium">
        New Product
      </Text>
    </Button>
  );
};

export default NewProductButton;
