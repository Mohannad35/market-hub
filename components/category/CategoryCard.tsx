"use client";

import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Category } from "@prisma/client";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";

interface Props extends CardProps {
  item: Category;
}
const CategoryCard = ({ item, ...props }: Props) => {
  const { path, name, image } = item;
  const handleDelete = () => {
    console.log("Delete", item.path);
  };

  return (
    <Card radius="none" shadow="none" className="max-h-[30rem] w-[16rem] bg-transparent" {...props}>
      <CardBody className="p-0">
        <CardImage
          src={image?.secure_url}
          href={`/products?${new URLSearchParams({ category: item.path })}`}
          edit={`/dashboard/categories/edit/${encodeURI(path.slice(1).replace(/\//g, "-"))}`}
          name={name}
          handleDelete={() => handleDelete}
        />
      </CardBody>
      <CardFooter className="flex-col p-2 text-small">
        <CardName href={`/products?${new URLSearchParams({ category: item.path })}`} name={name} />
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
