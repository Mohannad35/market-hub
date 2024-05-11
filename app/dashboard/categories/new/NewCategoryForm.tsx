"use client";

import Upload from "@/components/common/Upload";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema, stringSchema } from "@/lib/validation-schemas";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Category } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const NewCategoryForm = () => {
  const router = useRouter();
  const [resources, setResources] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [deletedRes, setDeletedRes] = useState<string[]>([]);
  const [temp, setTemp] = useState<string[]>([]);
  const [parentPath, setParentPath] = useState<string>("/");
  const addCategoryMutation = useMutationHook<
    Category,
    Pick<Category, "name" | "image" | "parent">
  >("/api/categories", ["newCategory"]);
  const categoriesQuery = useQueryHook<{ items: Category[]; count: number }>("/api/categories", [
    "categories",
    "new",
  ]);

  const handleSubmit = async (formData: FormData) => {
    if (resources.length < 1) return toast.error("A category needs at least one image");
    const data = getFormDataObject<Pick<Category, "name">>(formData);
    const { name } = data;
    const promise = new Promise<Category>(async (resolve, reject) =>
      addCategoryMutation
        .mutateAsync({ name, parent: parentPath, image: resources[0] })
        .then(resolve)
        .catch(reject)
    );
    toast.promise(promise, {
      loading: "Adding Cateogry",
      success: data => {
        setResources([]);
        setTemp([]);
        fetch("/api/admin/upload", {
          method: "DELETE",
          body: JSON.stringify({ publicId: deletedRes }),
        });
        setTimeout(() => {
          router.push("/dashboard/categories");
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
          New Category
        </Text>
        <Upload
          resources={resources}
          setResources={setResources}
          temp={temp}
          setTemp={setTemp}
          setDeletedRes={setDeletedRes}
          folder="categories"
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
        {categoriesQuery.isSuccess && (
          <Autocomplete
            defaultItems={categoriesQuery.data.items}
            label="Parent Category"
            variant="underlined"
            selectedKey={parentPath}
            onSelectionChange={key => setParentPath(key as string)}
            validate={() => validateSchema(parentPath, stringSchema("Category").optional())}
            errorMessage={valid => valid.validationErrors}
          >
            {category => <AutocompleteItem key={category.path}>{category.name}</AutocompleteItem>}
          </Autocomplete>
        )}

        <Button type="submit" color="primary" isLoading={addCategoryMutation.isPending}>
          <Text size="3" weight="medium">
            Add Category
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default NewCategoryForm;
