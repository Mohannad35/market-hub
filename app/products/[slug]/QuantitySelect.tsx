"use client";

import { Select, Selection, SelectItem } from "@nextui-org/react";
import React, { Dispatch, SetStateAction } from "react";

interface QuantitySelectProps {
  quantity: number;
  selectedQuantity: Selection;
  setSelectedQuantity: Dispatch<SetStateAction<Selection>>;
}

const QuantitySelect = ({
  quantity,
  selectedQuantity,
  setSelectedQuantity,
}: QuantitySelectProps) => {
  return (
    <Select
      items={Array.from({ length: Math.min(quantity, 10) }).map((_, i) => ({
        value: (i + 1).toString(),
      }))}
      label="Quantity: "
      size="sm"
      labelPlacement="outside-left"
      classNames={{ label: "text-muted-foreground", base: "items-center" }}
      className="w-[8rem] max-w-xs"
      selectedKeys={selectedQuantity}
      onSelectionChange={setSelectedQuantity}
    >
      {item => <SelectItem key={item.value}>{item.value}</SelectItem>}
    </Select>
  );
};

export default QuantitySelect;
