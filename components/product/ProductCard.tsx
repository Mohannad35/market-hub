"use client";

import Rating from "@/components/common/Rating";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { useDisclosure } from "@nextui-org/react";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { truncate } from "lodash";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";
import Modal from "../common/Modal";

interface Props extends CardProps {
  item: Product;
}
const ProductCard = ({ item, ...props }: Props) => {
  const router = useRouter();
  const { name, image, price, slug, rating, ratingCount } = item;
  const delProductMutation = useMutationHook<Product>(
    `/api/products/${slug}`,
    ["deleteProduct"],
    "DELETE"
  );
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({});

  const handleDelete = () => {
    const promise = new Promise<Product>(async (resolve, reject) => {
      await delProductMutation.mutateAsync({}).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Deleting product...",
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
    <Card radius="none" shadow="none" className="max-h-[30rem] w-[16rem] bg-card" {...props}>
      <CardBody className="p-0">
        <CardImage
          src={image[0].secure_url}
          href={`/products/${slug}`}
          edit={`/admin/products/edit/${slug}`}
          name={name}
          handleDelete={onOpen}
        />
      </CardBody>
      <CardFooter className="justify-between p-2 text-small">
        <Flex width="260px" gap="2" direction="column" justify="start" align="start">
          <CardName href={`/products/${slug}`} name={name} />

          <Rating rating={rating} ratingCount={ratingCount} />

          <Flex width="100%" direction="row" justify="between" align="center">
            <Text weight="medium" className="text-muted-foreground">
              {price} EGP
            </Text>
            <Button color="primary" variant="solid" size="sm" radius="lg">
              Add to Cart
            </Button>
          </Flex>
        </Flex>
      </CardFooter>
      <Modal
        title={`Delete ${truncate(name, { length: 30 })}`}
        action="Delete"
        content="Are you sure?"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAction={handleDelete}
        isLoading={delProductMutation.isPending}
      />
    </Card>
  );
};

export default ProductCard;
