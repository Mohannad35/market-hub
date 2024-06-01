"use client";

import { validateSchema } from "@/lib/utils";
import { positiveNumberSchema } from "@/lib/validation/common-schema";
import { Icon as Iconify } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
  SliderValue,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const MIN_PRICE = 0;
const MAX_PRICE = 100000;

const PriceFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>(() => {
    const minPrice = searchParams.get("minPrice") || MIN_PRICE.toString();
    const maxPrice = searchParams.get("maxPrice") || MAX_PRICE.toString();
    return [parseInt(minPrice), parseInt(maxPrice)];
  });

  const handleSubmit = (formData: FormData) => {
    const minPrice = formData.get("minPrice") as string;
    const maxPrice = formData.get("maxPrice") as string;
    const query = new URLSearchParams(searchParams.toString());
    if (minPrice && minPrice !== MIN_PRICE.toString()) query.set("minPrice", minPrice);
    else query.delete("minPrice");
    if (maxPrice && maxPrice !== MAX_PRICE.toString()) query.set("maxPrice", maxPrice);
    else query.delete("maxPrice");
    router.replace("?".concat(query.toString()));
  };

  const onCancel = () => {
    const minPrice = searchParams.get("minPrice") || MIN_PRICE.toString();
    const maxPrice = searchParams.get("maxPrice") || MAX_PRICE.toString();
    setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
  };

  return (
    <Popover
      showArrow
      offset={10}
      placement="bottom"
      isOpen={isOpen}
      onOpenChange={open => setIsOpen(open)}
    >
      <PopoverTrigger>
        <Button
          variant="bordered"
          className="capitalize"
          endContent={<Iconify icon="line-md:chevron-down" />}
        >
          Pricing Range
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 font-inter">
        {titleProps => (
          <div className="flex w-full flex-col gap-2 px-4 pb-1 pt-4">
            <form action={handleSubmit}>
              <div className="flex w-full flex-col items-start justify-center gap-4 text-small">
                <Slider
                  size="sm"
                  color="secondary"
                  label={<p {...titleProps}>Price Range</p>}
                  minValue={MIN_PRICE}
                  maxValue={MAX_PRICE}
                  value={priceRange}
                  onChange={(value: SliderValue) => setPriceRange(value as number[])}
                  formatOptions={{ style: "currency", currency: "EGP" }}
                  className="max-w-md"
                  classNames={{
                    labelWrapper: "mb-1",
                    label: "font-medium text-default-700 text-medium",
                    value: "font-medium text-default-500 text-small",
                  }}
                />
                <div className="flex w-full items-center">
                  <Input
                    type="number"
                    name="minPrice"
                    variant="bordered"
                    placeholder="Min"
                    value={priceRange[0].toString()}
                    onValueChange={value => setPriceRange([parseInt(value), priceRange[1]])}
                  />
                  <Divider className="mx-2 w-2" />
                  <Input
                    type="number"
                    name="maxPrice"
                    variant="bordered"
                    placeholder="Max"
                    value={priceRange[1].toString()}
                    onValueChange={value => setPriceRange([priceRange[0], parseInt(value)])}
                  />
                </div>
              </div>

              <Divider className="mt-3 bg-default-100" />

              <div className="flex w-full justify-end gap-2 py-2">
                <Button size="sm" variant="flat" color="default" onPress={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" variant="flat" color="secondary">
                  Apply
                </Button>
              </div>
            </form>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PriceFilter;
