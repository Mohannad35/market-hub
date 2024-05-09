import BrandSelect from "@/components/product/BrandSelect";
import CategorySelect from "@/components/product/CategorySelect";
import SortBy from "@/components/product/SortBy";
import { Flex } from "@radix-ui/themes";
import PriceFilter from "./PriceFilter";

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

const FilterSidebar = () => {
  return (
    <Flex className="sticky h-full w-[20rem] border-none bg-transparent ps-3">
      <Flex direction="column" width="100%" gapY="5">
        <SortBy sortOpts={sortOpts} />
        <PriceFilter />
        <CategorySelect uniqueKey="searchCategories" />
        <BrandSelect uniqueKey="searchBrands" />
      </Flex>
    </Flex>
  );
};

export default FilterSidebar;
