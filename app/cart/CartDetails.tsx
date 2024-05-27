"use client";

import CardImage from "@/components/common/CardImage";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { CartWithItems } from "@/lib/types";
import { AddToCartValues, DeleteFromCartValues } from "@/lib/validation/cart-schema";
import { Icon as Iconify } from "@iconify/react";
import { Button, Card, CardBody, Divider, Select, SelectItem } from "@nextui-org/react";
import { Cart, Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CartDetails = () => {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useQueryHook<CartWithItems>({
    url: "/api/cart",
    key: ["getCart"],
  });
  const addToCartMutation = useMutationHook<Cart, AddToCartValues>("api/cart/add", ["addToCart"]);
  const deleteFromCartMutation = useMutationHook<Cart, DeleteFromCartValues>("api/cart/remove", [
    "deleteFromCart",
  ]);

  if (isLoading) return <LoadingIndicator />;
  else if (error) return <></>;
  else if (!data)
    return (
      <Card className="border border-warning">
        <CardBody className="flex-row gap-2">
          <Iconify icon="ph:seal-warning-duotone" fontSize={24} color="#f5a524" />
          <Text className="text-warning">
            Your cart is empty. Please add some products to your cart.
          </Text>
        </CardBody>
      </Card>
    );

  const { cartItems } = data;
  const updateQuantity = async (product: Product, quantity: string) => {
    const promise = new Promise<Cart>(async (resolve, reject) =>
      addToCartMutation
        .mutateAsync({ productId: product.id, quantity: parseInt(quantity) })
        .then(resolve)
        .catch(reject)
    );
    toast.promise(promise, {
      loading: "Adding to cart...",
      success: data => {
        router.refresh();
        return `${product.name} has been updated`;
      },
      error: err => err || "An unexpected error occurred",
    });
  };
  const checkout = () => {
    router.push("/order/checkout");
  };

  const handleDelete = async (product: Product) => {
    const promise = new Promise<Cart>(async (resolve, reject) =>
      deleteFromCartMutation.mutateAsync({ productId: product.id }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Removing from cart...",
      success: data => {
        refetch();
        router.refresh();
        return `${product.name} has been removed`;
      },
      error: err => err || "An unexpected error occurred",
    });
  };

  return (
    <Flex width="100%" justify="between" gap="4">
      <Card radius="none" shadow="none" fullWidth className="gap-4 bg-card p-4">
        <Text size="7">Shopping Cart</Text>
        {cartItems.map(({ id, product, quantity }) => (
          <Flex key={id} width="100%" gap="4" direction="column">
            <Divider />
            <Flex width="100%" gap="2">
              <Flex width="16rem">
                <CardImage
                  src={product.image[0].secure_url}
                  href={`/products/${product.slug}`}
                  edit={`/admin/products/edit/${product.slug}`}
                  name={product.name}
                  handleDelete={() => {}}
                />
              </Flex>
              <Flex width="100%" direction="column" justify="between">
                <Flex width="100%" gap="2" direction="column" justify="start" align="start">
                  <Text size="5" weight="medium" align={"left"}>
                    {product.name}
                  </Text>
                  <Text className="line-clamp-6 text-start">{product.description}</Text>
                </Flex>
                <Flex width="100%" direction="row" justify="between" align="center">
                  <Text weight="medium" className="text-muted-foreground">
                    {product.price} EGP
                  </Text>
                  <Flex gap="2">
                    <Select
                      items={Array.from({ length: Math.min(10) }).map((_, i) => ({
                        value: (i + 1).toString(),
                      }))}
                      label="Quantity: "
                      size="sm"
                      labelPlacement="outside-left"
                      classNames={{ label: "text-muted-foreground", base: "items-center" }}
                      className="w-[8rem] max-w-xs"
                      selectedKeys={quantity.toString()}
                      onSelectionChange={keys =>
                        keys !== "all" && updateQuantity(product, keys.values().next().value)
                      }
                      isLoading={addToCartMutation.isPending}
                    >
                      {item => <SelectItem key={item.value}>{item.value}</SelectItem>}
                    </Select>
                    <Button
                      size="sm"
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => handleDelete(product)}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold-duotone" fontSize={24} />
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Card>

      <Flex width="300px" direction="column" className="min-w-[300px]">
        <Card radius="none" shadow="none" fullWidth className="bg-card">
          <CardBody className="gap-2">
            <Text size="4" weight="medium">
              {cartItems.length > 1
                ? "Subtotal (" + cartItems.length + " items): "
                : "Subtotal (" + cartItems.length + " item): "}
              <span className="font-medium">
                {cartItems.reduce(
                  (acc, { product, quantity }) => acc + product.price * quantity,
                  0
                )}{" "}
                EGP
              </span>
            </Text>
            <Button onPress={checkout}>
              <Text size="3" weight="medium">
                Proceed to checkout
              </Text>
            </Button>
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
};

export default CartDetails;
