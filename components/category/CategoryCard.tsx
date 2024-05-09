"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { Category } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { EditIcon, Trash2Icon } from "lucide-react";
import NextImage from "next/image";
import NextLink from "next/link";
import CardName from "../common/CardName";
import CardImage from "../common/CardImage";

interface Props extends CardProps {
  item: Category;
}
const CategoryCard = ({ item, ...props }: Props) => {
  const { path, name, image } = item;
  return (
    <Card radius="none" shadow="none" className="max-h-[30rem] w-[16rem] bg-transparent" {...props}>
      <CardBody
        as={NextLink}
        className="items-center justify-normal overflow-x-clip overflow-y-visible p-0"
        href={`/products?${new URLSearchParams({ category: item.path })}`}
      >
        <CardImage
          src={image}
          href={`/dashboard/categories/edit/${encodeURI(path.slice(1).replace(/\//g, "-"))}`}
          name={name}
          handleDelete={() => console.log("Delete")}
        />
      </CardBody>
      <CardFooter className="flex-col p-2 text-small">
        <CardName href={`/products?${new URLSearchParams({ category: item.path })}`} name={name} />
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
