import BrandCard from "@/components/brand/BrandCard";
import CategoryCard from "@/components/category/CategoryCard";
import CardScrollContainer from "@/components/common/CardScrollContainer";
import ProductRowContainer from "@/components/product/ProductRowContainer";
import { Card, Link } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import HeroCarousel from "./HeroCarousel";

export default function Home() {
  return (
    <Flex className="container min-h-[calc(100vh-70px)]" direction="column" gap="8" pt="6">
      {/* Slider with some images */}
      <Flex
        mt="-6"
        width="100%"
        align="center"
        justify="center"
        direction="column"
        className="min-h-[calc(100vh-70px)]"
      >
        <Flex
          width="100%"
          align={{ initial: "center", md: "start" }}
          direction={{ initial: "column", md: "row" }}
          gap={{ initial: "6", md: "9" }}
          maxWidth="60rem"
        >
          <Flex width="50%" direction="column">
            <Text
              size="8"
              className="bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text pt-4 font-semibold tracking-tight text-transparent dark:to-foreground-200 lg:inline-block"
            >
              Market hub
              <br />
            </Text>
            <Text size="3" className="text-justify">
              Welcome to our online shopping platform where you can buy or sell products. We have a
              wide range of products from different categories, brands, and prices with a secure
              payment system and fast delivery. Enjoy your shopping experience with us.
            </Text>
          </Flex>
          <Flex width="50%" direction="column">
            <HeroCarousel />
          </Flex>
        </Flex>
      </Flex>

      {/* Shop by category */}
      <Card className="p-6">
        <Flex direction="column" gap="2">
          <Flex justify="between" width="100%">
            <Text size="4" weight="medium">
              Shop by Category
            </Text>
            <Link href="/categories" showAnchorIcon color="secondary">
              <Text size="4" weight="medium">
                More
              </Text>
            </Link>
          </Flex>
          <CardScrollContainer
            api="/api/categories?pageSize=20"
            uniqueKey={["homeCategories"]}
            Card={CategoryCard}
            label="Categories"
            height="12rem"
            imageHeight="10rem"
            width="10rem"
          />
        </Flex>
      </Card>

      {/* Latest products */}
      <Card className="p-6">
        <Flex direction="column" gap="2">
          <Flex justify="between" width="100%">
            <Text size="4" weight="medium">
              Latest Products
            </Text>
            <Link href="/products" showAnchorIcon color="secondary">
              <Text size="4" weight="medium">
                More
              </Text>
            </Link>
          </Flex>
          <ProductRowContainer api="/api/products?pageSize=5" uniqueKey={["latestProducts"]} />
        </Flex>
      </Card>

      {/* Shop by brand */}
      <Card className="p-6">
        <Flex direction="column" gap="2">
          <Flex justify="between" width="100%">
            <Text size="4" weight="medium">
              Shop by Brand
            </Text>
            <Link href="/brands" showAnchorIcon color="secondary">
              <Text size="4" weight="medium">
                More
              </Text>
            </Link>
          </Flex>
          <CardScrollContainer
            api="/api/brands?pageSize=20"
            uniqueKey={["homeBrands"]}
            Card={BrandCard}
            label="Brands"
            height="12rem"
            imageHeight="10rem"
            width="10rem"
          />
        </Flex>
      </Card>

      {/* Popular products */}
      <Card className="p-6">
        <Flex direction="column" gap="2">
          <Flex justify="between" width="100%">
            <Text size="4" weight="medium">
              Popular Products
            </Text>
            <Link href="/products?sortBy=sold&direction=desc" showAnchorIcon color="secondary">
              <Text size="4" weight="medium">
                More
              </Text>
            </Link>
          </Flex>
          <ProductRowContainer
            api="/api/products?pageSize=5&popular=true"
            uniqueKey={["popularProducts"]}
          />
        </Flex>
      </Card>
    </Flex>
  );
}
