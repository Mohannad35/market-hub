import { Order, Product } from "@prisma/client";
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  Button,
} from "@react-email/components";
import { capitalize } from "lodash";
import * as React from "react";

// Define the properties expected by the EmailVerifiedTemplate component
interface Props {
  name: string;
  username: string;
  baseUrl: string;
  order: Order;
  items: Product[];
}

export const OrderStatusTemplate = ({ username, name, baseUrl, order, items }: Props) => (
  <Html>
    <Head />
    <Preview>
      {"Market Hub"} Order {order.code} Status Updated.
    </Preview>
    <Tailwind>
      <Body className="bg-[#f6f9fc] p-4">
        <Container className="rounded bg-[#f0f0f0] p-10">
          {/* Logo */}
          <Section className="gap-4">
            <Img
              src={`${baseUrl}/logo-transparent.png`}
              width="60"
              height="60"
              alt="Logo"
              className="mx-auto mb-[1rem] mt-0"
            />
            <Text style={text} className="mt-0 text-center text-3xl font-bold">
              Order {order.code} Status Updated.
            </Text>
          </Section>

          <Section className="bg-[#f6f9fc] p-10">
            <Row>
              <Column>
                <Text style={text} className="mt-0 text-lg font-semibold">
                  Shipping to: {name}
                </Text>
              </Column>
              <Column>
                <Text style={text} className="mt-0 text-lg font-semibold">
                  {capitalize(order.status)}
                </Text>
              </Column>
            </Row>
            <Text style={text} className="mt-0 text-[#666666]">
              {order.address}
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Section>
              {items.map(({ id, name, price, image }) => (
                <Row key={id}>
                  <Column>
                    <Img
                      src={image[0].secure_url}
                      alt={name}
                      style={{ float: "left" }}
                      width="200px"
                    />
                  </Column>
                  <Column style={{ verticalAlign: "top", paddingLeft: "12px" }}>
                    <Text style={{ ...text, fontWeight: "500" }} className="mt-0">
                      {name}
                    </Text>
                    <Text style={text} className="font-semibold">
                      {price} EGP
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Section>
              <Row style={{ display: "inline-flex" }}>
                <Column style={{ width: "170px" }}>
                  <Text style={text}>Order Code</Text>
                  <Text style={text} className="font-semibold">
                    {order.code}
                  </Text>
                </Column>
                <Column>
                  <Text style={text}>Order Date</Text>
                  <Text style={text} className="font-semibold">
                    {order.createdAt.toDateString()}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column align="center">
                  <Button
                    className="rounded bg-slate-900 px-5 py-3 text-center font-sans text-[15px] uppercase text-white no-underline"
                    href={`${baseUrl}/user/${username}/orders/${order.code}`}
                  >
                    Order Status
                  </Button>
                </Column>
              </Row>
            </Section>
          </Section>

          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

OrderStatusTemplate.PreviewProps = {
  name: "Alan",
  username: "alan123",
  baseUrl: "http://localhost:3001",
  items: [
    {
      id: "663cb3417c19478f3c387331",
      listsId: ["663cb3417c19478f3c387331"],
      name: "Samsung Galaxy S23 Ultra, 12GB, Phantom Black, Mobile Phone, Dual SIM, Android Smartphone, 1 Year Manufacturer Warranty.",
      slug: "samsung-galaxy-s23-ultra-12gb-phantom-black-mobile-phone-dual-sim-android-smartphone-1-year-manufacturer-warranty",
      description:
        'Samsung Galaxy S23 Ultra, 12GB, Phantom Black, Mobile Phone, Dual SIM, Android Smartphone, 1 Year Manufacturer Warranty.\nNOTE: Global Version. No Warranty. This device is globally unlocked and ready to be used with your preferred Carrier. SIM CARD NOT INCLUDED. Please confirm device compatibility with your service provider before placing your order. Supported Network Bands: 5G/4G/3G/2G. Please note that 5G requires the support of local telecom operator services and may not be available in all regions. Please check with your service provider to see if 5G is offered in your area.\nStorage: 256GB UFS3.1, 12GB RAM LPDDR5X\nDisplay: 6.8 inches, 114.7 cm2 (~89.9% screen-to-body ratio)\nPlatform: Android 13, One UI 5.1 Qualcomm SM8550-AC Snapdragon 8 Gen 2 (4 nm)\nCamera: 200 MP, f/1.7, 24mm (wide), 1/1.3\\", 0.6µm, multi-directional PDAF, Laser AF, OIS. HIGHEST PHONE CAMERA RESOLUTION: Create crystal-clear content worth sharing with Galaxy S23 Ultra’s 200MP camera — the highest camera resolution on a phone; Whether you’re posting or printing, Galaxy S23 Ultra always does the moment justice',
      price: 41500,
      quantity: 100,
      sold: 0,
      rating: 0,
      ratingCount: 0,
      vendorId: "663cb3417c19478f3c387331",
      brandId: "663bff9b375e2208d42e36b5",
      categoryId: "663bfe8b375e2208d42e36b2",
      createdAt: new Date("2024-05-10T00:57:29.693Z"),
      updatedAt: new Date("2024-05-10T00:57:29.693Z"),
      image: [
        {
          public_id: "market-hub/products/qn6izbdgdfjatmeky66d",
          secure_url:
            "https://res.cloudinary.com/dsjpljjth/image/upload/v1715302471/market-hub/products/qn6izbdgdfjatmeky66d.jpg",
        },
        {
          public_id: "market-hub/products/dfet2lgf1rthiamkx9ij",
          secure_url:
            "https://res.cloudinary.com/dsjpljjth/image/upload/v1715302512/market-hub/products/dfet2lgf1rthiamkx9ij.jpg",
        },
        {
          public_id: "market-hub/products/xjvkxhwscqp35uhv9k81",
          secure_url:
            "https://res.cloudinary.com/dsjpljjth/image/upload/v1715302512/market-hub/products/xjvkxhwscqp35uhv9k81.jpg",
        },
        {
          public_id: "market-hub/products/p3p89jijasetvzv7b3p7",
          secure_url:
            "https://res.cloudinary.com/dsjpljjth/image/upload/v1715302514/market-hub/products/p3p89jijasetvzv7b3p7.jpg",
        },
        {
          public_id: "market-hub/products/lsn6chuqtm9kgdhgqoot",
          secure_url:
            "https://res.cloudinary.com/dsjpljjth/image/upload/v1715302514/market-hub/products/lsn6chuqtm9kgdhgqoot.jpg",
        },
        {
          public_id: "market-hub/products/mall4rajysu93v0avjrk",
          secure_url:
            "https://res.cloudinary.com/dsjpljjth/image/upload/v1715302531/market-hub/products/mall4rajysu93v0avjrk.jpg",
        },
        {
          public_id: "market-hub/products/gpv16iuofg8tl88zu6aw",
          secure_url:
            "https://res.cloudinary.com/dsjpljjth/image/upload/v1715302531/market-hub/products/gpv16iuofg8tl88zu6aw.jpg",
        },
      ],
    },
  ],
  order: {
    id: "1",
    cartId: "1",
    userId: "1",
    couponId: "1",
    payment: "cod",
    code: "ORD-123",
    address: "2125 Chestnut St, San Francisco, CA 94123",
    email: "johndoe@gmail.com",
    bill: 100,
    discount: 0,
    phone: {
      number: "100200300",
      nationalNumber: "100200300",
      country: "EG",
      countryCallingCode: "20",
    },
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
} as Props;

export default OrderStatusTemplate;

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};
