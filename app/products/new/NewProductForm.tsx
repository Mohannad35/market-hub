"use client";

import { formatErrors, getFormDataObject } from "@/components/utils";
import {
  descriptionSchema,
  nameSchema,
  priceSchema,
  quantitySchema,
} from "@/components/validationSchemas";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ZodSchema } from "zod";
import Uoload from "./Upload";
import { getCldImageUrl } from "next-cloudinary";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useBeforeUnload, useUnmount } from "react-use";

const NewProductForm = () => {
  const router = useRouter();
  const [publicId, setPublicId] = useState<string[]>([]);
  const signupMutation = useMutation({
    mutationKey: ["newProduct"],
    mutationFn: (data: { [key: string]: FormDataEntryValue | string[] }) =>
      fetch("/api/products", { method: "POST", body: JSON.stringify(data) }).then(res =>
        res.json()
      ),
  });

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

  const validate = (value: string | number, schema: ZodSchema): string | true => {
    const valid = schema.safeParse(value);
    return valid.success ? true : formatErrors(valid.error).messege;
  };

  const handleSubmitSignUp = async (formData: FormData) => {
    if (publicId.length < 1) return toast.error("A product needs at least one image");
    const data = getFormDataObject(formData);
    const ids = publicId.map(id => getCldImageUrl({ src: id }));
    const promise = new Promise<{ name: string }>(async (resolve, reject) => {
      const res = await signupMutation.mutateAsync({ ...data, image: ids });
      if (res.error) reject(res.error);
      resolve(res);
    });
    toast.promise(promise, {
      loading: "Adding product...",
      success: data => {
        setTimeout(() => router.push("/products"), 2000);
        return `${data.name} has been added`;
      },
      error: err => err || "An unexpected error occurred",
    });
  };
  return (
    <form className="flex flex-col gap-4" action={handleSubmitSignUp}>
      <Flex direction="column" gap="4" align="start">
        <Uoload publicId={publicId} setPublicId={setPublicId} />
        <Input
          isRequired
          variant="underlined"
          name="name"
          label="Name"
          type="text"
          validate={value => validate(value, nameSchema)}
          errorMessage={valid => valid.validationErrors}
        />
        <Textarea
          isRequired
          variant="underlined"
          name="description"
          label="Description"
          type="text"
          validate={value => validate(value, descriptionSchema)}
          errorMessage={valid => valid.validationErrors}
        />
        <Flex width="100%" gap="5" direction={{ initial: "column", xs: "row" }} justify="between">
          <Input
            isRequired
            variant="underlined"
            name="price"
            label="Price"
            type="number"
            validate={value => validate(parseFloat(value), priceSchema)}
            errorMessage={valid => valid.validationErrors}
          />
          <Input
            isRequired
            variant="underlined"
            name="quantity"
            label="Quantity"
            type="number"
            validate={value => validate(parseFloat(value), quantitySchema)}
            errorMessage={valid => valid.validationErrors}
          />
        </Flex>
        {/* Add category and brand fields here */}
        <Button type="submit" color="primary" isLoading={signupMutation.isPending}>
          <Text size="3" weight="medium">
            Add Product
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default NewProductForm;
