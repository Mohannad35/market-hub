"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import Upload from "@/components/common/Upload";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { getCategory } from "@/lib/query-functions/category";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema, stringSchema } from "@/lib/validation-schemas";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Category } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { isEqual, pick } from "lodash";
import { getCldImageUrl } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DataKey = "name" | "image" | "parent";
const EditCategoryForm = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const [resources, setResources] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [toBeDeletedIds, setToBeDeletedIds] = useState<string[]>([]);
  const [parentPath, setParentPath] = useState<string>("/");
  const editCategoryMutation = useMutationHook<
    Category,
    Partial<Pick<Category, "name" | "image" | "parent">>
  >(`/api/categories/${slug}`, ["editCategory", slug], "PATCH");
  const categoriesQuery = useQueryHook<{ items: Category[]; count: number }>("/api/categories", [
    "categories",
    "editCategory",
  ]);
  const { data, error, isSuccess, isLoading, refetch } = useQuery<Category>({
    queryKey: ["getCategoryEdit", slug],
    queryFn: getCategory,
  });
  useEffect(() => {
    if (data) {
      data.image && setResources([data.image]);
      data.parent !== "/" && setParentPath(data.parent);
    }
  }, [data]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>Category not found</Text>;

  const handleSubmit = async (formData: FormData) => {
    if (resources.length < 1) return toast.error("A category needs an image");
    const { name } = getFormDataObject<Pick<Category, "name">>(formData);
    // compare old category data with new data
    const newData = { name, image: resources[0], parent: parentPath ? parentPath : "/" };
    const differences = Object.keys(newData).filter(
      key => !isEqual(newData[key as DataKey], data[key as DataKey])
    );
    // if no changes detected, return
    if (differences.length < 1) return toast.error("No changes detected");
    const bodyEdits = pick(newData, differences);
    const promise = new Promise<Category>(async (resolve, reject) => {
      await editCategoryMutation.mutateAsync(bodyEdits).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Editing category...",
      success: data => {
        setResources([]);
        setToBeDeletedIds([]);
        setTimeout(() => {
          refetch();
          router.replace("/dashboard/categories");
          router.refresh();
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
          toBeDeletedIds={toBeDeletedIds}
          setToBeDeletedIds={setToBeDeletedIds}
          folder="categories"
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
        {categoriesQuery.isSuccess && (
          <Autocomplete
            defaultItems={categoriesQuery.data.items.filter(cat => cat.path !== data.path)}
            label="Parent Category"
            variant="underlined"
            selectedKey={parentPath}
            onSelectionChange={key => setParentPath(key as string)}
            validate={() =>
              validateSchema(parentPath, stringSchema("Category").nullish().optional())
            }
            errorMessage={valid => valid.validationErrors}
          >
            {category => <AutocompleteItem key={category.path}>{category.name}</AutocompleteItem>}
          </Autocomplete>
        )}

        <Button type="submit" color="primary" isLoading={editCategoryMutation.isPending}>
          <Text size="3" weight="medium">
            Edit Category
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default EditCategoryForm;
