import BrandContainer from "@/components/brand/BrandContainer";
import Search from "@/components/product/Search";
import SortBy from "@/components/product/SortBy";
import { Flex } from "@radix-ui/themes";

const sortOpts = [
  { label: "Newest", value: "createdAt-desc" },
  { label: "Oldest", value: "createdAt-asc" },
  { label: "Title: A-Z", value: "name-asc" },
  { label: "Title: Z-A", value: "name-desc" },
];

const DashboardBrandsPage = () => {
  return (
    <Flex direction="column" width="100%" gapY="4" className="container">
      <Flex direction="row" width="100%" justify="between" align="start" gapX="4">
        <Search queryName="q" />
        <SortBy sortOpts={sortOpts} />
      </Flex>

      <Flex direction="column" width="100%">
        <BrandContainer
          api="/api/brands"
          uniqueKey={["dashboardBrands"]}
          className="!h-[12rem] !w-[12rem]"
          showDelete
          showEdit
        />
      </Flex>
    </Flex>
  );
};

export default DashboardBrandsPage;
