import CardContainer from "@/components/common/CardContainer";
import BrandSelect from "@/components/product/BrandSelect";
import CategorySelect from "@/components/product/CategorySelect";
import ProductCardOwner from "@/components/product/ProductCardOwner";
import Search from "@/components/product/Search";
import SortBy from "@/components/product/SortBy";
import { Flex } from "@radix-ui/themes";

const sortOpts = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Title: A-Z", value: "name-asc" },
  { label: "Title: Z-A", value: "name-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Popular", value: "sold-asc" },
  { label: "Rating", value: "rating-desc" },
];

const DashboardProductsPage = () => {
  return (
    <Flex direction="column" width="100%" gapY="4" className="container">
      <Search queryName="q" api="" />
      <Flex direction="row" width="100%" justify="between" align="start" gapX="4">
        <SortBy sortOpts={sortOpts} />
        <CategorySelect uniqueKey="dashboardCategories" />
        <BrandSelect uniqueKey="dashboardBrands" />
      </Flex>

      <Flex width="100%" direction="column" gap="5" justify="start">
        <CardContainer
          label="products"
          api="/api/products"
          uniqueKey="dashboardProducts"
          Card={ProductCardOwner}
        />
      </Flex>
    </Flex>
  );
};

export default DashboardProductsPage;
