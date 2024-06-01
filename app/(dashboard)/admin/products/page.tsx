import BrandPopover from "@/components/product/BrandPopover";
import CategorySelect from "@/components/product/CategorySelect";
import ProductContainer from "@/components/product/ProductContainer";
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
      <Search queryName="q" />

      <Flex width="100%" direction="column" gap="5" justify="start">
        <ProductContainer api="/api/products" uniqueKey={["dashboardProducts"]} />
      </Flex>
    </Flex>
  );
};

export default DashboardProductsPage;
