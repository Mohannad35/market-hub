"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { ChangeEvent } from "react";

const SelectRowsPerPage = ({ rowsPerPage, onRowsPerPageChange }: DrobdownRowsPerPageProps) => {
  return (
    <Select
      label="Rows per page"
      labelPlacement="outside-left"
      classNames={{
        base: "max-w-[180px] items-center",
        label: "!text-default-400 text-sm",
        mainWrapper: "max-w-[70px]",
        trigger: "max-w-[70px] border-none",
        value: "text-center",
      }}
      value={rowsPerPage.toString()}
      defaultSelectedKeys={rowsPerPage.toString()}
      disallowEmptySelection
      onChange={onRowsPerPageChange}
      color="default"
      variant="underlined"
      size="sm"
    >
      {[5, 10, 15, 20, 25, 30].map(rows => (
        <SelectItem key={rows.toString()} value={rows.toString()}>
          {rows.toString()}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SelectRowsPerPage;

interface DrobdownRowsPerPageProps {
  rowsPerPage: number;
  onRowsPerPageChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}
