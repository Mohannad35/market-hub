"use client";

import Upload from "@/components/common/Upload";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema } from "@/lib/validation/common-schema";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Brand } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const NewBrandForm = () => {
  const router = useRouter();
  const [resources, setResources] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [deletedRes, setDeletedRes] = useState<string[]>([]);
  const [temp, setTemp] = useState<string[]>([]);
  const addBrandMutation = useMutationHook<Brand, Pick<Brand, "name" | "image">>("/api/brands", [
    "newBrand",
  ]);

  const handleSubmit = async (formData: FormData) => {
    if (resources.length < 1) return toast.error("A brand needs at least one image");
    const data = getFormDataObject<Pick<Brand, "name">>(formData);
    const { name } = data;
    const promise = new Promise<Brand>(async (resolve, reject) =>
      addBrandMutation.mutateAsync({ name, image: resources[0] }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      pending: "Adding Brand...",
      success: {
        render: ({ data }) => {
          setResources([]);
          setTemp([]);
          fetch("/api/admin/upload", {
            method: "DELETE",
            body: JSON.stringify({ publicId: deletedRes }),
          });
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
        <Upload
          resources={resources}
          setResources={setResources}
          temp={temp}
          setTemp={setTemp}
          setDeletedRes={setDeletedRes}
          folder="brands"
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
