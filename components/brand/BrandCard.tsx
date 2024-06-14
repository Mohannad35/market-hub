"use client";

import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { useDisclosure } from "@nextui-org/react";
import { Brand } from "@prisma/client";
import { truncate } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";
import Modal from "../common/Modal";
import { Flex } from "@radix-ui/themes";

interface Props extends CardProps {
  item: Brand;
  showDelete: boolean;
  showEdit: boolean;
  width?: string;
  className?: string;
}
const BrandCard = ({ item, ...props }: Props) => {
  const { slug, name, image } = item;
  const router = useRouter();
  const { data, status } = useSession();
  const delBrandMutation = useMutationHook<Brand>(`/api/brands/${slug}`, ["deleteBrand"], "DELETE");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({});
  const showDelete = useMemo(() => {
    return props.showDelete && data?.user?.role === "admin";
  }, [data, props.showDelete]);
  const showEdit = useMemo(() => {
    return props.showEdit && data?.user?.role === "admin";
  }, [data, props.showEdit]);

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
    <Flex justify="center" align="center" minWidth={props.width || "12rem"}>
      <Card radius="none" shadow="none" className="bg-transparent">
        <CardBody className="p-0">
          <CardImage
            className={props.className || "h-[12rem] w-[12rem]"}
            src={image?.secure_url}
            name={name}
            href={`/products?brands=${item.slug}`}
            showEdit={showEdit}
            edit={`/admin/brands/edit/${slug}`}
            showDelete={showDelete}
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
    </Flex>
  );
};

export default BrandCard;
