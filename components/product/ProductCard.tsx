"use client";

import AddToCartButton from "@/app/products/[slug]/AddToCartButton";
import Rating from "@/components/common/Rating";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { ListWithProducts } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ModifyListFormValues } from "@/lib/validation/list-schema";
import { Card, CardBody, CardFooter, CardProps } from "@nextui-org/card";
import { useDisclosure } from "@nextui-org/react";
import { Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { truncate } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import CardImage from "../common/CardImage";
import CardName from "../common/CardName";
import Modal from "../common/Modal";

const TRUNCATE_LENGTH = 60;

interface Props extends CardProps {
  item: Product;
  showDelete: boolean;
  showEdit: boolean;
  showFav: boolean;
  width?: string;
  className?: string;
}
const ProductCard = ({ item, ...props }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, status } = useSession();
  const { name, image, price, slug, rating, ratingCount } = item;
  const wishlist = useQueryHook<ListWithProducts>({
    url: "/api/list?listName=wishlist",
    key: ["getWishlist"],
  });
  const delProductMutation = useMutationHook<Product>(
    `/api/products/${slug}`,
    ["deleteProduct"],
    "DELETE"
  );
  const favProductMutation = useMutationHook<Product, ModifyListFormValues>(
    "/api/list",
    ["addToList"],
    "POST"
  );
  const removeFavMutation = useMutationHook<Product, ModifyListFormValues>(
    "/api/list",
    ["delFromList"],
    "DELETE"
  );
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({});
  const showDelete = useMemo(() => {
    return props.showDelete && (data?.user?.role === "admin" || data?.user?.id === item.vendorId);
  }, [data, item, props.showDelete]);
  const showEdit = useMemo(() => {
    return props.showEdit && (data?.user?.role === "admin" || data?.user?.id === item.vendorId);
  }, [data, item, props.showEdit]);
  const showFav = useMemo(() => {
    return props.showFav && status === "authenticated";
  }, [status, props.showFav]);

  const handleDelete = () => {
    const promise = new Promise<Product>(async (resolve, reject) => {
      await delProductMutation.mutateAsync({}).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: `Deleting ${truncate(item.name, { length: TRUNCATE_LENGTH })}...`,
      success: data => {
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return `${item.name} has been deleted successfully`;
      },
      error: err => {
        onClose();
        return err || "An unexpected error occurred";
      },
    });
  };

  const handleFav = () => {
    const promise = new Promise<Product>(async (resolve, reject) => {
      await favProductMutation.mutateAsync({ productId: item.id }).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: `Adding ${truncate(item.name, { length: TRUNCATE_LENGTH })} to wishlist...`,
      success: data => {
        onClose();
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["getWishlist"], exact: true });
          router.refresh();
        }, 2000);
        return `${item.name} has been added to your wishlist`;
      },
      error: err => {
        onClose();
        return err || "An unexpected error occurred";
      },
    });
  };

  const handleRemoveFav = () => {
    const promise = new Promise<Product>(async (resolve, reject) => {
      await removeFavMutation.mutateAsync({ productId: item.id }).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: `Removing ${truncate(item.name, { length: TRUNCATE_LENGTH })} from wishlist...`,
      success: data => {
        onClose();
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["getWishlist"], exact: true });
          router.refresh();
        }, 2000);
        return `${item.name} has been removed from your wishlist`;
      },
      error: err => {
        onClose();
        return err || "An unexpected error occurred";
      },
    });
  };

  if (wishlist.isLoading) return null;

  return (
    <Flex justify="center" align="center" minWidth={props.width} width={props.width}>
      <Card radius="none" shadow="none" className="bg-card">
        <CardBody className="items-center justify-center p-0">
          <CardImage
            name={name}
            className={props.className}
            src={image[0].secure_url}
            href={`/products/${slug}`}
            showEdit={showEdit}
            edit={`/admin/products/edit/${slug}`}
            showDelete={showDelete}
            handleDelete={onOpen}
            showFav={showFav}
            isFav={wishlist.data && wishlist.data.productsId.includes(item.id)}
            handleFav={
              wishlist.data && wishlist.data.productsId.includes(item.id)
                ? handleRemoveFav
                : handleFav
            }
          />
        </CardBody>
        <CardFooter className="text-small">
          <Flex gap="2" direction="column" justify="start" align="start">
            <CardName href={`/products/${slug}`} name={name} size="3" />

            <Rating readOnly size="small" defaultValue={rating} ratingCount={ratingCount} />

            <Flex width="100%" direction="row" justify="between" align="center">
              <Text weight="medium" className="w-full text-muted-foreground">
                {price} EGP
              </Text>
              <AddToCartButton product={item} />
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
    </Flex>
  );
};

export default ProductCard;
