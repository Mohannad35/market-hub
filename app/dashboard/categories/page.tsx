import CategoryCard from "@/components/category/CategoryCard";
import CardContainer from "@/components/common/CardContainer";
import Search from "@/components/product/Search";
import SortBy from "@/components/product/SortBy";
import { Flex } from "@radix-ui/themes";

const sortOpts = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Title: A-Z", value: "name-asc" },
  { label: "Title: Z-A", value: "name-desc" },
];

const DashboardCategoriesPage = () => {
  return (
    <Flex direction="column" width="100%" gapY="4" className="container">
      <Flex direction="row" width="100%" justify="between" align="start" gapX="4">
        <Search queryName="q" api="" />
        <SortBy sortOpts={sortOpts} />
      </Flex>

      <Flex width="100%" direction="column" gap="5" justify="start">
        <CardContainer
          label="categories"
          api="/api/categories"
          uniqueKey="dashboardCategories"
          Card={CategoryCard}
        />
      </Flex>
    </Flex>
  );
};

export default DashboardCategoriesPage;
