"use client";

import Upload from "@/components/common/Upload";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import {
  idSchema,
  integerSchema,
  numberSchema,
  stringMinMaxSchema,
} from "@/lib/validation-schemas";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Brand, Category, Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DataKey = "name" | "description" | "price" | "quantity" | "image" | "brandId" | "categoryId";
type TBody = Pick<Modify<Product, { price: string; quantity: string }>, DataKey>;
const NewProductForm = () => {
  const router = useRouter();
  const [resources, setResources] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [deletedRes, setDeletedRes] = useState<string[]>([]);
  const [temp, setTemp] = useState<string[]>([]);
  const [brandId, setBrandId] = useState<null | string>(null);
  const [categoryId, setCategoryId] = useState<null | string>(null);
  const addProductMutation = useMutationHook<Product, TBody>("/api/products", ["newProduct"]);
  const brandQuery = useQueryHook<{ items: Brand[]; count: number }>("/api/brands", [
    "brands",
    "newProduct",
  ]);
  const categoriesQuery = useQueryHook<{ items: Category[]; count: number }>("/api/categories", [
    "categories",
    "newProduct",
  ]);

  const handleSubmit = async (formData: FormData) => {
    if (resources.length < 1) return toast.error("A product needs at least one image");
    if (!brandId || !categoryId) return toast.error("Brand and Category are required");
    const data = getFormDataObject<TBody>(formData);
    const promise = new Promise<{ name: string }>(async (resolve, reject) => {
      await addProductMutation
        .mutateAsync({ ...data, image: resources, brandId, categoryId })
        .then(resolve)
        .catch(reject);
    });
    toast.promise(promise, {
      loading: "Adding product...",
      success: data => {
        setResources([]);
        setTemp([]);
        fetch("/api/admin/upload", {
          method: "DELETE",
          body: JSON.stringify({ publicId: deletedRes }),
        });
        setTimeout(() => {
          router.push("/products");
          router.refresh();
        }, 2000);
        return `${data.name} has been added`;
      },
      error: err => err || "An unexpected error occurred",
    });
  };

  return (
    <form action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Text size="7" weight="medium">
          New Product
        </Text>
        <Upload
          resources={resources}
          setResources={setResources}
          temp={temp}
          setTemp={setTemp}
          setDeletedRes={setDeletedRes}
          folder="products"
          maxFiles={10}
          multiple
        />
        <Input
          isRequired
          variant="underlined"
          name="name"
          label="Name"
          type="text"
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 256))}
          errorMessage={valid => valid.validationErrors}
        />
        <Textarea
          isRequired
          variant="underlined"
          name="description"
          label="Description"
          type="text"
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 10_000))}
          errorMessage={valid => valid.validationErrors}
        />
        <Flex width="100%" gap="5" direction={{ initial: "column", xs: "row" }} justify="between">
          <Input
            isRequired
            variant="underlined"
            name="price"
            label="Price"
            type="number"
            validate={value => validateSchema(value, numberSchema("Price"))}
            errorMessage={valid => valid.validationErrors}
          />
          <Input
            isRequired
            variant="underlined"
            name="quantity"
            label="Quantity"
            type="number"
            validate={value => validateSchema(value, integerSchema("Quantity"))}
            errorMessage={valid => valid.validationErrors}
          />
        </Flex>
        {/* Add category and brand fields here */}
        <Flex width="100%" gap="5" direction={{ initial: "column", xs: "row" }} justify="between">
          {categoriesQuery.isSuccess && (
            <Autocomplete
              isRequired
              defaultItems={categoriesQuery.data.items}
              label="Category"
              variant="underlined"
              selectedKey={categoryId}
              onSelectionChange={key => setCategoryId(key as string)}
              validate={() => validateSchema(categoryId, idSchema("Category"))}
              errorMessage={valid => valid.validationErrors}
            >
              {category => <AutocompleteItem key={category.id}>{category.name}</AutocompleteItem>}
            </Autocomplete>
          )}
          {brandQuery.isSuccess && (
            <Autocomplete
              isRequired
              defaultItems={brandQuery.data.items}
              label="Brand"
              variant="underlined"
              selectedKey={brandId}
              onSelectionChange={key => setBrandId(key as string)}
              validate={() => validateSchema(brandId, idSchema("Brand"))}
              errorMessage={valid => valid.validationErrors}
            >
              {brand => <AutocompleteItem key={brand.id}>{brand.name}</AutocompleteItem>}
            </Autocomplete>
          )}
        </Flex>
        <Button type="submit" color="primary" isLoading={addProductMutation.isPending}>
          <Text size="3" weight="medium">
            Add Product
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default NewProductForm;
