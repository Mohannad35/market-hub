"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import Upload from "@/components/common/Upload";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { getProduct } from "@/lib/query-functions/product";
import { Modify, ProductWithBrandAndCategory } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import {
  idSchema,
  integerSchema,
  numberSchema,
  stringMinMaxSchema,
} from "@/lib/validation/common-schema";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Brand, Category, Product } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { difference, pick } from "lodash";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DataKey = "name" | "description" | "price" | "quantity" | "image" | "brandId" | "categoryId";
type TBody = Pick<Modify<Product, { price: string; quantity: string }>, DataKey>;
const EditProductForm = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [resources, setResources] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [deletedRes, setDeletedRes] = useState<string[]>([]);
  const [temp, setTemp] = useState<string[]>([]);
  const [brandId, setBrandId] = useState<null | string>(null);
  const [categoryId, setCategoryId] = useState<null | string>(null);
  const editProductMutation = useMutationHook<Product, Partial<TBody>>(
    `/api/products/${slug}`,
    ["editProduct"],
    "PATCH"
  );
  const brandQuery = useQueryHook<{ items: Brand[]; count: number }>({
    url: "/api/brands",
    key: ["brands", "newProduct"],
  });
  const categoriesQuery = useQueryHook<{ items: Category[]; count: number }>({
    url: "/api/categories",
    key: ["categories", "newProduct"],
  });
  const { data, error, isSuccess, isLoading, refetch } = useQuery<ProductWithBrandAndCategory>({
    queryKey: ["editProduct", slug, "brand,category"],
    queryFn: getProduct,
  });

  useEffect(() => {
    if (data) {
      setResources(data.image);
      setBrandId(data.brandId);
      setCategoryId(data.categoryId);
    }
  }, [data]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>Product not found</Text>;

  const handleSubmit = async (formData: FormData) => {
    if (resources.length < 1) return toast.error("A product needs at least one image");
    if (!brandId || !categoryId) return toast.error("Brand and Category are required");
    const body = getFormDataObject<TBody>(formData);
    // compare old product data with new data
    const newData = { ...body, image: resources, brandId, categoryId };
    const differences = Object.keys(newData).filter(key => {
      switch (key) {
        case "image":
          return difference(newData.image, data.image).length > 0;
        // newData.image.some(({ public_id }) =>
        //   data.image.some(({ public_id: id }) => id === public_id));
        case "price":
          return newData[key as DataKey] !== data.price.toString();
        case "quantity":
          return newData[key as DataKey] !== data.quantity.toString();
        default:
          return newData[key as DataKey] !== data[key as DataKey];
      }
    });
    // if no changes detected, return
    if (differences.length < 1) return toast.error("No changes detected");
    const bodyEdits = pick(newData, differences);
    const promise = new Promise<Product>(async (resolve, reject) => {
      await editProductMutation.mutateAsync(bodyEdits).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Editing product...",
      success: data => {
        setResources([]);
        setTemp([]);
        fetch("/api/admin/upload", {
          method: "DELETE",
          body: JSON.stringify({ publicId: deletedRes }),
        });
        setTimeout(() => {
          refetch();
          if (differences.includes("name"))
            router.push(pathname.replace(/\/edit.*/, `/edit/${data.slug}`));
        }, 2000);
        return `${data.name} has been edited successfully`;
      },
      error: err => err || "An unexpected error occurred",
    });
  };
  return (
    <form action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Text size="7" weight="medium">
          Edit {data.name}
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
          defaultValue={data.name}
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 256))}
          errorMessage={valid => valid.validationErrors}
        />
        <Textarea
          isRequired
          variant="underlined"
          name="description"
          label="Description"
          type="text"
          defaultValue={data.description}
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
            defaultValue={data.price.toString()}
            validate={value => validateSchema(value, numberSchema("Price"))}
            errorMessage={valid => valid.validationErrors}
          />
          <Input
            isRequired
            variant="underlined"
            name="quantity"
            label="Quantity"
            type="number"
            defaultValue={data.price.toString()}
            validate={value => validateSchema(value, integerSchema("Quantity"))}
            errorMessage={valid => valid.validationErrors}
          />
        </Flex>
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
        <Button type="submit" color="primary" isLoading={editProductMutation.isPending}>
          <Text size="3" weight="medium">
            Edit Product
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default EditProductForm;
