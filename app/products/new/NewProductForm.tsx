"use client";

import Uoload from "@/components/common/Upload";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
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
import { getCldImageUrl } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useBeforeUnload, useUnmount } from "react-use";
import { toast } from "sonner";

const NewProductForm = () => {
  const router = useRouter();
  const [publicId, setPublicId] = useState<string[]>([]);
  const [brandId, setBrandId] = useState<null | string>(null);
  const [categoryId, setCategoryId] = useState<null | string>(null);
  const addProductMutation = useMutationHook<Product>("/api/products", ["newProduct"]);
  const brandQuery = useQueryHook<Brand[]>("/api/brands", ["brands", "newProduct"]);
  const categoriesQuery = useQueryHook<Category[]>("/api/categories", ["categories", "newProduct"]);

  const beforeUnmount = useCallback(() => {
    if (publicId.length > 0) {
      setPublicId(publicId => {
        fetch("/api/admin/upload", { method: "DELETE", body: JSON.stringify({ publicId }) });
        return [];
      });
    }
    return publicId.length > 0;
  }, [publicId]);
  useUnmount(beforeUnmount);
  useBeforeUnload(beforeUnmount, "You have unsaved changes, are you sure?");

  const handleSubmit = async (formData: FormData) => {
    if (publicId.length < 1) return toast.error("A product needs at least one image");
    if (!brandId || !categoryId) return toast.error("Brand and Category are required");
    const data = getFormDataObject(formData);
    const ids = publicId.map(id => getCldImageUrl({ src: id }));
    const promise = new Promise<{ name: string }>(async (resolve, reject) => {
      await addProductMutation
        .mutateAsync({ ...data, image: ids, brandId, categoryId })
        .then(resolve)
        .catch(reject);
    });
    toast.promise(promise, {
      loading: "Adding product...",
      success: data => {
        setPublicId([]);
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
    <form className="flex flex-col gap-4" action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Uoload
          publicId={publicId}
          setPublicId={setPublicId}
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
              defaultItems={categoriesQuery.data}
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
              defaultItems={brandQuery.data}
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
