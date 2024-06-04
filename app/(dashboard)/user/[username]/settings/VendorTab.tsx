"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getProfile } from "@/lib/query-functions/user";
import { Modify } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema, urlSchema } from "@/lib/validation/common-schema";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { isEqual, pick } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DataKey = "businessAddress" | "websiteAddress";
type TData = Partial<Pick<Modify<User, { phoneNumber: string }>, DataKey>>;
type TBody = Partial<Pick<User, DataKey>>;
const VendorTabForm = ({ username }: { username: string }) => {
  const router = useRouter();
  const { update } = useSession();
  const editProfileMutation = useMutationHook<User, TBody>(`/api/user`, ["editProfile"], "PATCH");
  const { data, error, isSuccess, isLoading, isRefetching, refetch } = useQuery<User>({
    queryKey: ["getProfile"],
    queryFn: getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading || isRefetching) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>User not found</Text>;

  const handleSubmit = async (formData: FormData) => {
    const body = getFormDataObject<TData>(formData);
    // compare old profile data with new data
    const newData = {
      ...body,
      websiteAddress: body.websiteAddress?.startsWith("http")
        ? body.websiteAddress
        : body.websiteAddress?.length ?? 0 > 0
          ? `https://${body.websiteAddress}`
          : body.websiteAddress || null,
    };
    const differences = Object.keys(newData).filter(
      key => !isEqual(newData[key as DataKey], data[key as DataKey])
    );
    // if no changes detected, return
    if (differences.length < 1) return toast.error("No changes detected");
    const bodyEdits = pick(newData, differences);
    const promise = new Promise<User>(async (resolve, reject) => {
      await editProfileMutation.mutateAsync(bodyEdits).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Updating vendor details...",
      success: result => {
        setTimeout(async () => {
          refetch();
          await update({ id: result.id });
          router.refresh();
        }, 2000);
        return "Updated successfully";
      },
      error: err => err || "An unexpected error occurred",
    });
  };
  return (
    <form action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Text size="3" weight="medium">
          Vendor Details
          <br />
          <span className="text-sm text-muted-foreground">Update your vendor details</span>
        </Text>

        <Input
          type="text"
          variant="bordered"
          size="lg"
          name="websiteAddress"
          defaultValue={data.websiteAddress || undefined}
          label="Website"
          placeholder="example.org"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small text-default-400">https://</span>
            </div>
          }
          validate={value => (value ? validateSchema(value, urlSchema.nullish()) : undefined)}
          errorMessage={valid => valid.validationErrors}
        />

        <Textarea
          variant="bordered"
          size="lg"
          name="businessAddress"
          defaultValue={data.businessAddress || undefined}
          label="Business Address"
          classNames={{ label: "text-md" }}
          type="text"
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 0, 10_000))}
          errorMessage={valid => valid.validationErrors}
        />

        <Button type="submit" color="primary" isLoading={editProfileMutation.isPending}>
          <Text size="3" weight="medium">
            Update
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default VendorTabForm;
