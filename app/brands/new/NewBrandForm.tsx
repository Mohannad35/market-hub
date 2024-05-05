"use client";

import Uoload from "@/components/common/Upload";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema } from "@/lib/validation-schemas";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Brand } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { getCldImageUrl } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useBeforeUnload, useUnmount } from "react-use";
import { toast } from "react-toastify";

const NewBrandForm = () => {
  const router = useRouter();
  const [publicId, setPublicId] = useState<string[]>([]);
  const addBrandMutation = useMutationHook<Brand>("/api/brands", ["newBrand"]);

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
    if (publicId.length < 1) return toast.error("A brand needs at least one image");
    const data = getFormDataObject(formData);
    const ids = publicId.map(id => getCldImageUrl({ src: id }));
    const { name } = data;
    const promise = new Promise<{ name: string }>(async (resolve, reject) =>
      addBrandMutation.mutateAsync({ name, image: ids[0] }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      pending: "Adding Brand...",
      success: {
        render: ({ data }) => {
          setPublicId([]);
          setTimeout(() => {
            router.push("/brands");
            router.refresh();
          }, 2000);
          return `${data.name} has been added`;
        },
      },
      error: {
        render: ({ data }: { data: Error }) => data.message || "An unexpected error occurred",
      },
    });
  };

  return (
    <form className="flex flex-col gap-4" action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Uoload publicId={publicId} setPublicId={setPublicId} folder="brands" />
        <Input
          isRequired
          variant="underlined"
          name="name"
          label="Name"
          type="text"
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 256))}
          errorMessage={valid => valid.validationErrors}
        />

        <Button type="submit" color="primary" isLoading={addBrandMutation.isPending}>
          <Text size="3" weight="medium">
            Add Brand
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default NewBrandForm;
