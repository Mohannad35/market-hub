"use client";

import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { useDisclosure } from "@nextui-org/react";
import { Brand } from "@prisma/client";
import { truncate } from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";
import Modal from "../common/Modal";

interface Props extends CardProps {
  item: Brand;
}
const BrandCard = ({ item, ...props }: Props) => {
  const router = useRouter();
  const { slug, name, image } = item;
  const delBrandMutation = useMutationHook<Brand>(`/api/brands/${slug}`, ["deleteBrand"], "DELETE");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({});

  const handleDelete = () => {
    const promise = new Promise<Brand>(async (resolve, reject) => {
      await delBrandMutation.mutateAsync({}).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Deleting brand...",
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
          href={`/products?brands=${item.slug}`}
          edit={`/dashboard/brands/edit/${slug}`}
          name={name}
          handleDelete={onOpen}
        />
      </CardBody>
      <CardFooter className="flex-col p-2 text-small">
        <CardName href={`/products?brands=${item.slug}`} name={name} />
      </CardFooter>
      <Modal
        title={`Delete ${truncate(name, { length: 30 })}`}
        action="Delete"
        content="Are you sure?"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAction={handleDelete}
        isLoading={delBrandMutation.isPending}
      />
    </Card>
  );
};

export default BrandCard;
