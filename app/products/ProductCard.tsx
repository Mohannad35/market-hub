"use client";

import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import NextImage from "next/image";
import NextLink from "next/link";
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
      className="max-h-[30rem] min-h-[22rem] w-[14rem] bg-neutral-200 dark:bg-neutral-800"
      {...props}
    >
      <CardBody
        as={NextLink}
        className="items-center justify-normal overflow-x-clip overflow-y-visible p-0"
        href={`/products/${product.slug}`}
      >
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
          <Tooltip content={product.name} radius="sm">
            <Link href={`/products/${product.slug}`} color="foreground">
              <Text size="5" weight="medium" className="line-clamp-2 w-[260px] text-start">
                {product.name}
              </Text>
            </Link>
          </Tooltip>

          <Flex width="100%" direction="row" justify="start" align="center" gapX="2">
            <Rating
              readOnly
              size="small"
              name="product rating"
              defaultValue={product.rating}
              precision={0.5}
              icon={<StarIcon fontSize="small" className="text-yellow-400 dark:text-yellow-500" />}
              emptyIcon={<StarIcon fontSize="small" className="text-gray-400 opacity-20" />}
              className="z-50 cursor-pointer"
            />
            <Text className="text-muted-foreground">{product.ratingCount}</Text>
          </Flex>

          <Flex width="100%" direction="row" justify="between" align="center">
            <Text weight="medium" className="text-muted-foreground">
              {product.price} LE
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
