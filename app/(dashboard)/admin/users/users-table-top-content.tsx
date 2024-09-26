"use client";

import DropdownColumns from "@/components/data-table/dropdown-columns";
import SelectRowsPerPage from "@/components/data-table/select-rows-per-page";
import { Input } from "@nextui-org/input";
import { Selection } from "@nextui-org/table";
import { User } from "@prisma/client";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Search } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import ControlButtons from "./users-table-control-buttons";
import { columns } from "./users-table-data";

const TopContent = (props: TopContentProps) => {
  const {
    users,
    filterValue,
    rowsPerPage,
    visibleColumns,
    isLoadingRefresh,
    setFilterValue,
    onSearchChange,
    onClickRefresh,
    onRowsPerPageChange,
    setVisibleColumns,
  } = props;

  return (
    <Flex className="z-20 flex flex-col gap-4">
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
            placeholder="Search by name..."
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
            <ControlButtons isLoadingRefresh={isLoadingRefresh} onClickRefresh={onClickRefresh} />
          </Flex>

          <Flex direction={{ initial: "column", xs: "row" }} gap={"12px"} justify={"end"}>
            <DropdownColumns
              columns={columns}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex justify="between" align="center">
        <Box>
          <Text size="2" className="text-muted-foreground">
            {"Found " + users.length + " of " + users.length + " issues"}
          </Text>
        </Box>
        <SelectRowsPerPage onRowsPerPageChange={onRowsPerPageChange} rowsPerPage={rowsPerPage} />
      </Flex>
    </Flex>
  );
};

export default TopContent;

interface TopContentProps {
  users: User[];
  filterValue: string | undefined;
  rowsPerPage: number;
  visibleColumns: Selection;
  isLoadingRefresh: boolean;
  setFilterValue: Dispatch<SetStateAction<string | undefined>>;
  onSearchChange: (value?: string) => void;
  onClickRefresh: () => Promise<void>;
  onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  setVisibleColumns: Dispatch<SetStateAction<Selection>>;
}
