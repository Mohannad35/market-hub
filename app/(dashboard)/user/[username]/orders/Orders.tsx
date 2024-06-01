"use client";

import CardImage from "@/components/common/CardImage";
import CardName from "@/components/common/CardName";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { getUserOrders } from "@/lib/query-functions/order";
import { OrderIncluded } from "@/lib/types";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";

const Orders = () => {
  const { data, error, isSuccess, isLoading, refetch } = useQuery<OrderIncluded[]>({
    queryKey: ["getUserOrders"],
    queryFn: getUserOrders,
  });

  if (isLoading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>No orders found</Text>;

  return (
    <Flex direction="column" gap="6">
      {data.map(
        ({ cart, address, bill, code, coupon, discount, email, payment, phone, status, user }) => (
          <Card key={code}>
            <CardBody className="gap-4">
              <Flex width="100%" justify="between">
                <Text size="6" weight="medium">
                  {code}
                </Text>
                <Text size="5" weight="medium">
                  {status}
                </Text>
              </Flex>
              <Flex width="100%" justify="between">
                <Text size="3" weight="medium">
                  Contact: {email}
                </Text>
                <Text size="3" weight="medium">
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
                <Text size="3" weight="medium">
                  Bill: {bill}
                </Text>
                <Text size="3" weight="medium">
                  {discount > 0 ? `Discount: ${discount} (-${coupon.value}%)` : ""}
                </Text>
              </Flex>

              <Text size="4" weight="medium">
                Your Order
              </Text>
              {cart.cartItems.map(({ id, product, quantity, priceAfter }) => (
                <Flex key={id} width="100%" gap="4" direction="column">
                  <Divider />
                  <Flex width="100%" gap="2">
                    <Flex width="16rem">
                      <CardImage
                        width="12rem"
                        height="12rem"
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
        )
      )}
    </Flex>
  );
};

export default Orders;
