"use client";

import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { AddToCartValues } from "@/lib/validation/cart-schema";
import { Button } from "@nextui-org/react";
import { Cart, Product } from "@prisma/client";
import { Text } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddToCartButton = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { status } = useSession();
  const queryClient = useQueryClient();
  const addToCartMutation = useMutationHook<Cart, AddToCartValues>("api/cart/add", ["addToCart"]);

  const handleAddToCart = () => {
    if (status === "unauthenticated") {
      toast.error("Please sign in first to add to cart", { id: `sign-in-${nanoid(4)}` });
      setTimeout(async () => await signIn(), 1000);
      return;
    }
    const promise = new Promise<Cart>(async (resolve, reject) =>
      addToCartMutation
        .mutateAsync({ productId: product.id, quantity: 1 })
        .then(resolve)
        .catch(reject)
    );
    toast.promise(promise, {
      loading: "Adding to cart...",
      success: data => {
        queryClient.invalidateQueries({ queryKey: ["getCart"], exact: true });
        router.refresh();
        return `${product.name} has been added to cart`;
      },
      error: err => err || "An unexpected error occurred",
    });
  };

  return (
    <Button
      size="sm"
      color="primary"
      className="xs w-[8rem] max-w-xs max-[767px]:w-full"
      onPress={handleAddToCart}
      isLoading={addToCartMutation.isPending}
    >
      <Text size="4" weight="medium">
        Add to cart
      </Text>
    </Button>
  );
};

export default AddToCartButton;
