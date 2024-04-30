import { Flex } from "@radix-ui/themes";
import BrandSelect from "./BrandSelect";
import CategorySelect from "./CategorySelect";
import SortBy from "./SortBy";
import PriceFilter from "./PriceFilter";

const FilterSidebar = () => {
  return (
    <Flex className="sticky h-full w-[20rem] border-none bg-transparent ps-3">
      <Flex direction="column" width="100%" gapY="5">
        <SortBy />
        <CategorySelect />
        <BrandSelect />
        <PriceFilter />
      </Flex>
    </Flex>
  );
};

export default FilterSidebar;
