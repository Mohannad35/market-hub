"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Tooltip } from "@nextui-org/tooltip";
import { Category } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { EditIcon, Trash2Icon } from "lucide-react";
import NextImage from "next/image";
import NextLink from "next/link";

interface Props extends CardProps {
  item: Category;
}
const CategoryCard = ({ item, ...props }: Props) => {
  const { path, name, image } = item;
  return (
    <Card
      radius="none"
      shadow="none"
      className="max-h-[30rem] min-h-[22rem] w-[14rem] bg-neutral-200 dark:bg-neutral-800"
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
          alt={name || "Product Image"}
          src={image || process.env.IMAGE_PLACEHOLDER}
        />
      </CardBody>
      <CardFooter className="justify-between p-2 text-small">
        <Flex width="260px" gap="2" direction="column" justify="start" align="start">
          <Tooltip content={name} radius="sm">
            <Text size="5" weight="medium" className="line-clamp-2 w-[260px] text-start">
              {name}
            </Text>
          </Tooltip>

          <Flex gapX="2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              radius="lg"
              as={NextLink}
              href={`/dashboard/categories/edit/${encodeURI(path.slice(1).replace(/\//g, "-"))}`}
            >
              <EditIcon size={20} />
            </Button>
            <Button isIconOnly variant="light" size="sm" radius="lg">
              <Trash2Icon size={20} />
            </Button>
          </Flex>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
