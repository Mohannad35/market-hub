"use client";

import CardImage from "@/components/common/CardImage";
import CardName from "@/components/common/CardName";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { CartItemWithProduct, CartWithItems, CouponWithUser } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema, stringSchema } from "@/lib/validation/common-schema";
import { OrderValues } from "@/lib/validation/order-schema";
import { Icon as Iconify } from "@iconify/react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Select,
  Selection,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { MailFilledIcon } from "@nextui-org/shared-icons";
import { Order, Phone } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { countries } from "countries-list";
import { CountryCode, parsePhoneNumber } from "libphonenumber-js";
import { pick } from "lodash";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Checkout = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [couponCode, setCouponCode] = useState<string>();
  const [coupon, setCoupon] = useState<CouponWithUser>();
  const [items, setItems] = useState<CartItemWithProduct[]>();
  const [countryCode, setCountryCode] = useState<string>("EG");
  const [payment, setPayment] = useState<Selection>(new Set(["cod"]));
  const { data, isLoading, error, refetch } = useQueryHook<CartWithItems>({
    url: "/api/cart",
    key: ["getCart"],
  });
  const orderMutation = useMutationHook<Order, OrderValues>("/api/order/checkout", ["checkout"]);
  const applyCouponMutation = useMutationHook<CouponWithUser, { code: string }>(
    "/api/coupon/apply",
    ["applyCoupon"]
  );

  useEffect(() => {
    if (!data) return;
    const { cartItems } = data;
    const newItems = cartItems.map(({ product, ...item }) => {
      if (coupon) {
        const { price, vendorId } = product;
        const isActive =
          coupon.isActive &&
          new Date(coupon.startDate) < new Date() &&
          new Date(coupon.endDate) > new Date() &&
          (coupon.type === "admin" || coupon.userId === vendorId);
        if (isActive) {
          const discountValue = coupon.maxAmount
            ? Math.min(price * (coupon.value / 100), coupon.maxAmount)
            : price * (coupon.value / 100);
          return { ...item, product, priceAfter: price - discountValue };
        }
        return { ...item, product };
      }
      return { ...item, product };
    });
    setItems(newItems);
  }, [coupon, data]);

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

  const handleSubmit = (form: FormData) => {
    const paymentMethod = payment === "all" ? "cod" : payment.values().next().value;
    const body = getFormDataObject<{ address: string; phone: string; email: string }>(form);
    const phoneNumber = parsePhoneNumber(body.phone, countryCode as CountryCode);
    if (!phoneNumber.isValid() || !phoneNumber.isPossible())
      return toast.error("Invalid phone number", { id: "phone" + nanoid(4) });
    const promise = new Promise<Order>(async (resolve, reject) =>
      orderMutation
        .mutateAsync({
          address: body.address,
          phone: pick(phoneNumber, [
            "number",
            "country",
            "nationalNumber",
            "countryCallingCode",
          ]) as Phone,
          email: body.email,
          payment: paymentMethod,
          couponId: coupon?.id,
        })
        .then(resolve)
        .catch(reject)
    );
    toast.promise(promise, {
      loading: "Processing your order..",
      success: data => {
        refetch();
        router.push(`/user/${session?.user.username}/orders`);
        router.refresh();
        return `${data.code} has been placed successfully. Check your email for more details.`;
      },
      error: err => err || "An unexpected error occurred",
    });
  };

  const applyCoupon = () => {
    if (!couponCode) return;
    // Apply the coupon
    const promise = new Promise<CouponWithUser>(async (resolve, reject) =>
      applyCouponMutation.mutateAsync({ code: couponCode }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Applying coupon..",
      success: data => {
        setCouponCode("");
        setCoupon(data);
        return `${data.code} has been applied successfully.`;
      },
      error: err => err || "An unexpected error occurred",
    });
  };

  return (
    <form action={handleSubmit} className="w-full">
      <Flex width="100%" justify="between" gap="4">
        <Flex width="100%" direction="column">
          <Card radius="none" shadow="none" fullWidth className="gap-2 bg-card p-4">
            <Text size="7">Checkout</Text>
            <Textarea
              isRequired
              variant="bordered"
              name="address"
              placeholder="25th Street, Cairo, Egypt"
              type="text"
              validate={value => validateSchema(value, stringSchema("Address"))}
              errorMessage={valid => valid.validationErrors}
            />
            <Input
              isRequired
              type="tel"
              name="phone"
              variant="bordered"
              placeholder="000-000-0000"
              startContent={
                <div className="flex items-center">
                  <Autocomplete
                    type="tel"
                    defaultItems={Object.entries(pick(countries, ["US", "EG", "NG", "IN", "BR"]))}
                    aria-label="Select Country"
                    variant="underlined"
                    size="sm"
                    classNames={{ base: "w-[8rem] p-0", popoverContent: "w-[20rem]" }}
                    isClearable={false}
                    selectedKey={countryCode}
                    onSelectionChange={key => setCountryCode(key as string)}
                  >
                    {([key, { name, phone }]) => (
                      <AutocompleteItem
                        key={key}
                        value={name}
                        startContent={
                          <Avatar
                            alt={name}
                            className="h-6 w-6"
                            src={`https://flagcdn.com/${key.toLowerCase()}.svg`}
                          />
                        }
                      >
                        {`(+${phone}) ${name}`}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>
              }
              validate={value => validateSchema(value, stringMinMaxSchema("Phone", 2, 20))}
              errorMessage={valid => valid.validationErrors}
            />
            <Input
              isRequired
              type="email"
              variant="bordered"
              name="email"
              placeholder="jhondoe@example.com"
              startContent={
                <MailFilledIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
              }
              validate={value => validateSchema(value, stringSchema("Email").email())}
              errorMessage={valid => valid.validationErrors}
            />
            <Select
              variant="bordered"
              placeholder="payment method"
              items={[
                { label: "Cash on delivery", value: "cod" },
                { label: "Card", value: "card" },
              ]}
              disallowEmptySelection
              selectedKeys={payment}
              onSelectionChange={setPayment}
            >
              {({ value, label }) => <SelectItem key={value}>{label}</SelectItem>}
            </Select>
          </Card>
        </Flex>

        <Flex width="500px" direction="column" className="min-w-[500px]">
          <Card radius="none" shadow="none" fullWidth className="gap-2 bg-card">
            <CardBody className="gap-2">
              <Text size="4" weight="medium">
                Your Order
              </Text>
              {items?.map(({ id, product, quantity, priceAfter }) => (
                <Flex key={id} width="100%" gap="4" direction="column">
                  <Divider />
                  <Flex width="100%" gap="2">
                    <Flex width="16rem">
                      <CardImage
                        width="8rem"
                        height="8rem"
                        src={product.image[0].secure_url}
                        href={`/products/${product.slug}`}
                        edit={`/admin/products/edit/${product.slug}`}
                        name={product.name}
                        handleDelete={() => {}}
                      />
                    </Flex>
                    <Flex width="100%" direction="column" justify="between">
                      <Flex width="100%" gap="2" direction="column" justify="start" align="start">
                        <CardName name={product.name} href={`/products/${product.slug}`} />
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
              <Divider className="my-2" />

              <Flex width="100%" gap="4">
                <Input
                  type="text"
                  variant="bordered"
                  placeholder="Enter coupon code"
                  form="checkout"
                  startContent={
                    <Iconify icon="mdi:coupon" fontSize={24} color="hsl(var(--muted-foreground))" />
                  }
                  value={couponCode}
                  onValueChange={setCouponCode}
                />
                <Button
                  type="button"
                  onPress={applyCoupon}
                  isDisabled={couponCode ? couponCode.length < 3 : true}
                  isLoading={applyCouponMutation.isPending}
                >
                  <Text size="3" weight="medium">
                    Apply
                  </Text>
                </Button>
              </Flex>

              {coupon && (
                <Flex width="100%" gap="2" direction="column">
                  <Divider />
                  <Flex width="100%" gap="2" justify="between">
                    <Text size="4" weight="medium">
                      Coupon: {coupon.code}
                    </Text>
                    <Text size="4" weight="medium">
                      -{coupon.value}% {coupon.maxAmount ? `up to ${coupon.maxAmount} EGP` : ""}{" "}
                      {coupon.type === "admin"
                        ? "for all products"
                        : `for ${coupon.user.name} products`}
                    </Text>
                  </Flex>
                </Flex>
              )}

              <Text size="4" weight="medium">
                {items && items.length > 1
                  ? "Subtotal (" + items?.length + " items): "
                  : "Subtotal (" + items?.length + " item): "}
                {items?.reduce(
                  (acc, { product, quantity, priceAfter }) => acc + product.price * quantity,
                  0
                ) !==
                  items?.reduce(
                    (acc, { product, quantity, priceAfter }) => acc + priceAfter * quantity,
                    0
                  ) && (
                  <span className="font-medium text-muted-foreground line-through decoration-amber-400">
                    {items?.reduce(
                      (acc, { product, quantity, priceAfter }) => acc + product.price * quantity,
                      0
                    )}{" "}
                    EGP
                  </span>
                )}
                <span className="font-medium">
                  {" "}
                  {items?.reduce(
                    (acc, { product, quantity, priceAfter }) => acc + priceAfter * quantity,
                    0
                  )}{" "}
                  EGP
                </span>
              </Text>
              <Button type="submit">
                <Text size="3" weight="medium">
                  Checkout
                </Text>
              </Button>
            </CardBody>
          </Card>
        </Flex>
      </Flex>
    </form>
  );
};

export default Checkout;
