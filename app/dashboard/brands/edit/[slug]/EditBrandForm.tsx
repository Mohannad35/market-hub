"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import Upload from "@/components/common/Upload";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getBrand } from "@/lib/query-functions/brand";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema } from "@/lib/validation-schemas";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Brand } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { isEqual, pick } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DataKey = "name" | "image";
const EditBrandForm = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const [resources, setResources] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [toBeDeletedIds, setToBeDeletedIds] = useState<string[]>([]);
  const editBrandMutation = useMutationHook<Brand, Partial<Pick<Brand, "name" | "image">>>(
    `/api/brands/${slug}`,
    ["editBrand"],
    "PATCH"
  );
  const { data, error, isSuccess, isLoading, refetch } = useQuery<Brand>({
    queryKey: ["getBrandEdit", slug],
    queryFn: getBrand,
  });
  useEffect(() => {
    if (data && data.image) setResources([data.image]);
  }, [data]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>Brand not found</Text>;

  const handleSubmit = async (formData: FormData) => {
    if (resources.length < 1) return toast.error("A brand needs at least one image");
    const { name } = getFormDataObject<Pick<Brand, "name">>(formData);
    // compare old brand data with new data
    const newData = { name, image: resources[0] };
    const differences = Object.keys(newData).filter(
      key => !isEqual(newData[key as DataKey], data[key as DataKey])
    );
    // if no changes detected, return
    if (differences.length < 1) return toast.error("No changes detected");
    const bodyEdits = pick(newData, differences);
    const promise = new Promise<Brand>(async (resolve, reject) => {
      await editBrandMutation.mutateAsync(bodyEdits).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Editing brand...",
      success: data => {
        setResources([]);
        setToBeDeletedIds([]);
        setTimeout(() => {
          refetch();
          router.replace("/dashboard/brands");
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
          folder="brands"
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

        <Button type="submit" color="primary" isLoading={editBrandMutation.isPending}>
          <Text size="3" weight="medium">
            Edit Brand
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default EditBrandForm;
