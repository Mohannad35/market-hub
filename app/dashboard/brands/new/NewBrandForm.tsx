"use client";

import Upload from "@/components/common/Upload";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema } from "@/lib/validation-schemas";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Brand } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { getCldImageUrl } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const NewBrandForm = () => {
  const router = useRouter();
  const [publicId, setPublicId] = useState<string[]>([]);
  const addBrandMutation = useMutationHook<Brand>("/api/brands", ["newBrand"]);

  const handleSubmit = async (formData: FormData) => {
    if (publicId.length < 1) return toast.error("A brand needs at least one image");
    const data = getFormDataObject<Pick<Brand, "name">>(formData);
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
            router.push("/dashboard/brands");
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
    <form action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Text size="7" weight="medium">
          New Brand
        </Text>
        <Upload publicId={publicId} setPublicId={setPublicId} folder="brands" />
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
