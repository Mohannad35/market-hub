"use client";

import Uoload from "@/components/common/Upload";
import { useMutationHook, useQueryHook } from "@/hook/use-tanstack-hooks";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema, stringSchema } from "@/lib/validation-schemas";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Category } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { getCldImageUrl } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useBeforeUnload, useUnmount } from "react-use";
import { toast } from "sonner";

const NewCategoryForm = () => {
  const router = useRouter();
  const [publicId, setPublicId] = useState<string[]>([]);
  const [parentPath, setParentPath] = useState<string>("");
  const addCategoryMutation = useMutationHook<Category>("/api/categories", ["newCategory"]);
  const categoriesQuery = useQueryHook<Category[]>("/api/categories", ["categories", "new"]);

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
    if (publicId.length < 1) return toast.error("A category needs at least one image");
    const data = getFormDataObject(formData);
    const ids = publicId.map(id => getCldImageUrl({ src: id }));
    const { name } = data;
    const promise = new Promise<{ name: string }>(async (resolve, reject) =>
      addCategoryMutation
        .mutateAsync({
          name,
          path: `${parentPath}/${(name as string).toLowerCase()}`,
          image: ids[0],
        })
        .then(resolve)
        .catch(reject)
    );
    toast.promise(promise, {
      loading: "Adding Cateogry",
      success: data => {
        setPublicId([]);
        setTimeout(() => {
          router.push("/categories");
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
        <Uoload publicId={publicId} setPublicId={setPublicId} folder="categories" />
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
            defaultItems={categoriesQuery.data}
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
