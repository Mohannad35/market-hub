import CategoryContainer from "@/components/category/CategoryContainer";
import Search from "@/components/product/Search";
import SortBy from "@/components/product/SortBy";
import { Flex } from "@radix-ui/themes";

const sortOpts = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Title: A-Z", value: "name-asc" },
  { label: "Title: Z-A", value: "name-desc" },
];

const CategoriesPage = () => {
  return (
    <Flex direction="column" width="100%" gapY="4" className="container">
      <Flex direction="row" width="100%" justify="between" align="start" gapX="4">
        <Search queryName="q" />
        <SortBy sortOpts={sortOpts} />
      </Flex>

      <Flex width="100%" direction="column" gap="5" justify="start">
        <CategoryContainer
          api="/api/categories"
          uniqueKey={["homeCategories"]}
          height="16rem"
          width="14rem"
          imageHeight="14rem"
          showDelete
          showEdit
        />
      </Flex>
    </Flex>
  );
};

export default CategoriesPage;
