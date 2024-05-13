"use client";

import { validateSchema } from "@/lib/utils";
import { positiveNumberSchema } from "@/lib/validation/common-schema";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Flex } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

const PriceFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (formData: FormData) => {
    const minPrice = formData.get("minPrice") as string;
    const maxPrice = formData.get("maxPrice") as string;
    const query = new URLSearchParams(searchParams.toString());
    if (minPrice) query.set("minPrice", minPrice);
    else query.delete("minPrice");
    if (maxPrice) query.set("maxPrice", maxPrice);
    else query.delete("maxPrice");
    router.push(`${query ? "?" + query.toString() : ""}`);
  };

  return (
    <form action={handleSubmit}>
      <Flex gapX="2">
        <Input
          type="number"
          name="minPrice"
          variant="bordered"
          placeholder="Min"
          defaultValue={searchParams.get("minPrice") || ""}
          validate={value => validateSchema(value, positiveNumberSchema("Price"))}
          errorMessage={valid => valid.validationErrors}
        />
        <Input
          type="number"
          name="maxPrice"
          variant="bordered"
          placeholder="Max"
          defaultValue={searchParams.get("maxPrice") || ""}
          validate={value => validateSchema(value, positiveNumberSchema("Price"))}
          errorMessage={valid => valid.validationErrors}
        />
        <Button type="submit" isIconOnly variant="bordered">
          Go
        </Button>
      </Flex>
    </form>
  );
};

export default PriceFilter;
