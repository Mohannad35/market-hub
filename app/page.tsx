import BrandCard from "@/components/brand/BrandCard";
import CategoryCard from "@/components/category/CategoryCard";
import CardScrollContainer from "@/components/common/CardScrollContainer";
import ProductRowContainer from "@/components/product/ProductRowContainer";
import { Card, Link } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex className="container min-h-[calc(100vh-70px)]" direction="column" gap="8" pt="6">
      {/* Slider with some images */}

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
            imageHeight="11rem"
            width="12rem"
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
