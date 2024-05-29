"use client";

import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Selection } from "@nextui-org/table";
import { capitalize } from "lodash";
import { ChevronDownIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const DropdownColumns = ({ visibleColumns, setVisibleColumns, columns }: DropdownColumnsProps) => {
  return (
    <Dropdown>
      <DropdownTrigger className="hidden sm:flex">
        <Button
          endContent={<ChevronDownIcon className="text-small" />}
          size="md"
          color="default"
          variant="ghost"
        >
          Columns
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Table Columns"
        closeOnSelect={false}
        selectedKeys={visibleColumns}
        selectionMode="multiple"
        onSelectionChange={setVisibleColumns}
      >
        {columns
          .filter(column => column.name !== "")
          .map(column => (
            <DropdownItem key={column.value} className="capitalize">
              {capitalize(column.name)}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownColumns;

interface DropdownColumnsProps {
  visibleColumns: Selection;
  setVisibleColumns: Dispatch<SetStateAction<Selection>>;
  columns: { name: string; value: string; sortable: boolean; align: string }[];
}
