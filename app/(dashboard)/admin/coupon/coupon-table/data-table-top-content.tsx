"use client";

import { Input } from "@nextui-org/input";
import { Selection } from "@nextui-org/table";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Search } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import SelectRowsPerPage from "./select-rows-per-page";
import ControlButtons from "./control-buttons";
import DropdownColumns from "./dropdown-columns";
import { Coupon } from "@prisma/client";

const TopContent = (props: TopContentProps) => {
  const {
    coupons,
    status,
    filterValue,
    rowsPerPage,
    visibleColumns,
    isLoadingRefresh,
    isLoadingNew,
    setFilterValue,
    onSearchChange,
    onClickRefresh,
    onPressNew,
    onRowsPerPageChange,
    setVisibleColumns,
  } = props;

  return (
    <Flex className="flex flex-col gap-4">
      <Flex
        direction={{ initial: "column", md: "row" }}
        justify={"between"}
        gap={"12px"}
        align={"end"}
      >
        <Flex justify={"start"} width={"100%"}>
          <Input
            isClearable
            size="md"
            color="primary"
            variant="bordered"
            className="group"
            classNames={{
              base: "w-full sm:max-w-[36rem]",
            }}
            placeholder="Search by title..."
            startContent={
              <Search className="text-default-300 transition-colors duration-75 ease-in-out group-focus-within:text-default-700" />
            }
            value={filterValue}
            onValueChange={onSearchChange}
            onClear={() => setFilterValue("")}
          />
        </Flex>

        <Flex direction={{ initial: "column", sm: "row" }} gap={"12px"}>
          <Flex direction={{ initial: "column", xs: "row" }} gap={"12px"}>
            <ControlButtons
              isLoadingNew={isLoadingNew}
              isLoadingRefresh={isLoadingRefresh}
              onClickRefresh={onClickRefresh}
              onPressNew={onPressNew}
              status={status}
            />
          </Flex>

          <Flex direction={{ initial: "column", xs: "row" }} gap={"12px"} justify={"end"}>
            <DropdownColumns
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex justify="between" align="center">
        <Box>
          <Text size="2" className="text-muted-foreground">
            {"Found " + coupons.length + " of " + coupons.length + " issues"}
          </Text>
        </Box>
        <SelectRowsPerPage onRowsPerPageChange={onRowsPerPageChange} rowsPerPage={rowsPerPage} />
      </Flex>
    </Flex>
  );
};

export default TopContent;

interface TopContentProps {
  coupons: Coupon[];
  status: "authenticated" | "loading" | "unauthenticated";
  filterValue: string | undefined;
  rowsPerPage: number;
  visibleColumns: Selection;
  isLoadingRefresh: boolean;
  isLoadingNew: boolean;
  setFilterValue: Dispatch<SetStateAction<string | undefined>>;
  onSearchChange: (value?: string) => void;
  onClickRefresh: () => Promise<void>;
  onPressNew: () => void;
  onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  setVisibleColumns: Dispatch<SetStateAction<Selection>>;
}
