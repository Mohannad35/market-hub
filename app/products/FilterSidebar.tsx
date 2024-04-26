"use client";

import { useBrands, useCategories } from "@/hook/useQuery";
import { Accordion, AccordionItem, Card } from "@nextui-org/react";
import { Brand, Category } from "@prisma/client";

const FilterSidebar = () => {
  const brandQuery = useBrands();
  const categoriesQuery = useCategories();

  if (brandQuery.isLoading || categoriesQuery.isLoading) return <p>Loading...</p>;
  else if (brandQuery.error || categoriesQuery.error)
    return <p>Error: {brandQuery.error?.message || categoriesQuery.error?.message}</p>;
  else if (!brandQuery.isSuccess || !categoriesQuery.isSuccess) return <p>No data found</p>;
  return (
    <Card
      shadow="none"
      radius="none"
      className="sticky h-full min-h-screen min-w-[15rem] max-w-[20rem] border-none bg-transparent"
    >
      <Accordion isCompact>
        {categoriesQuery.data.map((category: Category) => (
          <AccordionItem key={category.id} aria-label={category.name} title={category.name}>
            {category.name}
          </AccordionItem>
        ))}
      </Accordion>
      <Accordion isCompact>
        {brandQuery.data.map((brand: Brand) => (
          <AccordionItem key={brand.id} aria-label={brand.name} title={brand.name}>
            {brand.name}
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};

export default FilterSidebar;
