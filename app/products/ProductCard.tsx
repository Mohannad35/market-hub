"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import NextImage from "next/image";
import { useRouter } from "next/navigation";

export interface ProductCardProps extends CardProps {
  product: Product;
}

const ProductCard = ({ onPress, product, ...props }: ProductCardProps) => {
  const router = useRouter();

  const handlePress = (slug: string) => {
    router.push(`/products/${slug}`);
  };
  return (
    <Card
      radius="none"
      shadow="none"
      className="h-[20rem] w-[14rem] bg-neutral-200 dark:bg-neutral-800"
      isPressable
      onPress={() => handlePress(product.slug)}
      {...props}
    >
      <CardBody className="items-center justify-normal overflow-x-clip overflow-y-visible p-0">
        <Image
          shadow="none"
          radius="none"
          width={480}
          height={480}
          className="max-h-[14rem] object-contain"
          as={NextImage}
          alt={product.name || "Product Image"}
          src={product.image[0] || process.env.IMAGE_PLACEHOLDER}
        />
      </CardBody>
      <CardFooter className="justify-between p-2 text-small">
        <Flex width="260px" gap="2" direction="column" justify="start" align="start">
          <Text size="5" weight="medium" className="line-clamp-2 w-[260px] text-start">
            {product.name}
          </Text>
          <Flex width="100%" direction="row" justify="between" align="center">
            <Text weight="medium" className="text-muted-foreground">
              {product.price} $
            </Text>
            <Button color="primary" variant="solid" size="sm" radius="lg">
              Add to Cart
            </Button>
          </Flex>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
