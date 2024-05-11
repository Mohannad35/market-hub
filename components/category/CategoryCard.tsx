"use client";

import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { Category } from "@prisma/client";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";
import { useRouter } from "next/navigation";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { useDisclosure } from "@nextui-org/react";
import { toast } from "sonner";
import Modal from "../common/Modal";
import { truncate } from "lodash";

interface Props extends CardProps {
  item: Category;
}
const CategoryCard = ({ item, ...props }: Props) => {
  const router = useRouter();
  const { path, name, image } = item;
  const delCategoryMutation = useMutationHook<Category>(
    `/api/categories/${encodeURI(path.slice(1).replace(/\//g, "-"))}`,
    ["deleteCategory"],
    "DELETE"
  );
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({});

  const handleDelete = () => {
    console.log("Delete", encodeURI(path.slice(1).replace(/\//g, "-")));
    const promise = new Promise<Category>(async (resolve, reject) => {
      await delCategoryMutation.mutateAsync({}).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Deleting category...",
      success: data => {
        onClose();
        setTimeout(() => {
          router.refresh();
        }, 2000);
        return `${data.name} has been deleted successfully`;
      },
      error: err => {
        onClose();
        return err || "An unexpected error occurred";
      },
    });
  };

  return (
    <Card radius="none" shadow="none" className="max-h-[30rem] w-[16rem] bg-transparent" {...props}>
      <CardBody className="p-0">
        <CardImage
          src={image?.secure_url}
          href={`/products?${new URLSearchParams({ category: item.path })}`}
          edit={`/dashboard/categories/edit/${encodeURI(path.slice(1).replace(/\//g, "-"))}`}
          name={name}
          handleDelete={onOpen}
        />
      </CardBody>
      <CardFooter className="flex-col p-2 text-small">
        <CardName href={`/products?${new URLSearchParams({ category: item.path })}`} name={name} />
      </CardFooter>
      <Modal
        title={`Delete ${truncate(name, { length: 30 })}`}
        action="Delete"
        content="Are you sure?"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAction={handleDelete}
        isLoading={delCategoryMutation.isPending}
      />
    </Card>
  );
};

export default CategoryCard;
