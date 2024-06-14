"use client";

import CardImage from "@/components/common/CardImage";
import CardName from "@/components/common/CardName";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { getOrder } from "@/lib/query-functions/order";
import { OrderIncluded } from "@/lib/types";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { capitalize } from "lodash";
import { notFound } from "next/navigation";

const OrderDetails = ({ code }: { code: string }) => {
  const { data, error, isSuccess, isLoading } = useQuery<OrderIncluded>({
    queryKey: ["getOrder", code],
    queryFn: getOrder,
  });

  if (isLoading) return <LoadingIndicator />;
  if (error) {
    if (error.message.match(/not found/i)) notFound();
    return <Text>Error: {error.message}</Text>;
  }
  if (!isSuccess || !data) notFound();

  const { cart, address, bill, coupon, discount, email, payment, phone, status } = data;
  return (
    <Card key={code}>
      <CardBody className="gap-4 p-4">
        <Flex width="100%" justify="between">
          <Text size="6" weight="medium">
            #{code}
          </Text>
          <Text size="5" weight="medium">
            {capitalize(status)}
          </Text>
        </Flex>
        <Flex width="100%" justify="between">
          <Text size="4" weight="medium">
            Contact: {email}
          </Text>
          <Text size="4" weight="medium">
            {phone.number}
          </Text>
        </Flex>
        <Text size="3" weight="medium">
          Address: {address}
        </Text>

        <Divider />
        <Text size="3" weight="medium">
          Payment: {payment === "cod" ? "Cash on delivery" : "Card"}
        </Text>
        <Flex width="100%" justify="between">
          <Text size="4" weight="medium">
            Bill: <span className="font-fira_code">{bill} EGP</span>
          </Text>
          <Text size="4" weight="medium">
            {discount > 0 && "Discount: "}
            {discount > 0 && (
              <span className="font-fira_code">
                {discount} (-{coupon.value}%)
              </span>
            )}
          </Text>
        </Flex>

        <Divider />
        <Text size="4" weight="medium">
          Order
        </Text>
        {cart.cartItems.map(({ id, product, quantity, priceAfter }) => (
          <Flex key={id} width="100%" gap="4" direction="column">
            <Flex width="100%" gap="2">
              <Flex width="16rem">
                <CardImage
                  className="h-[12rem] w-[12rem]"
                  src={product.image[0].secure_url}
                  href={`/products/${product.slug}`}
                  name={product.name}
                />
              </Flex>
              <Flex width="100%" direction="column" justify="between">
                <Flex width="100%" gap="2" direction="column" justify="start" align="start">
                  <CardName name={product.name} href={`/products/${product.slug}`} size="4" />
                </Flex>
                <Flex direction="column">
                  {product.price !== priceAfter && (
                    <Text
                      size="3"
                      className="text-muted-foreground line-through decoration-amber-400"
                    >
                      {product.price} EGP
                    </Text>
                  )}
                  <Text weight="medium" className="text-muted-foreground">
                    {priceAfter} EGP x {quantity.toString()}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </CardBody>
    </Card>
  );
};

export default OrderDetails;
