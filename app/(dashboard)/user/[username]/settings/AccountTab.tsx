"use client";

import DividerWithLabel from "@/components/common/DividerWithLabel";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import Upload from "@/components/common/Upload";
import { MailIcon } from "@/components/icons/MailIcon";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getProfile } from "@/lib/query-functions/user";
import { Modify } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import {
  birthDateSchema,
  stringMinMaxSchema,
  stringSchema,
  urlSchema,
} from "@/lib/validation/common-schema";
import {
  DateValue,
  fromDate,
  getLocalTimeZone,
  isSameDay,
  toCalendarDate,
  today,
} from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  DatePicker,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import { Gender, Phone, User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { countries } from "countries-list";
import parsePhoneNumber, { CountryCode } from "libphonenumber-js";
import { isEqual, pick } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DataKey = "email" | "phoneNumber" | "address";
type TData = Partial<Pick<Modify<User, { phoneNumber: string }>, DataKey>>;
type TBody = Partial<Pick<User, DataKey>>;
const AccountTab = ({ username }: { username: string }) => {
  const router = useRouter();
  const { update } = useSession();
  const [countryCode, setCountryCode] = useState<string>("EG");
  const editProfileMutation = useMutationHook<User, TBody>(`/api/user`, ["editProfile"], "PATCH");
  const { data, error, isSuccess, isLoading, isRefetching, refetch } = useQuery<User>({
    queryKey: ["getProfile"],
    queryFn: getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (data) data.phoneNumber && setCountryCode(data.phoneNumber.country);
  }, [data]);

  if (isLoading || isRefetching) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>User not found</Text>;

  const handleSubmit = async (formData: FormData) => {
    const body = getFormDataObject<TData>(formData);
    // compare old profile data with new data
    const phone = body.phoneNumber
      ? parsePhoneNumber(body.phoneNumber, countryCode as CountryCode)
      : undefined;
    if (phone && !phone.isValid()) return toast.error("Invalid phone number");
    const newData = {
      ...body,
      phoneNumber: phone
        ? (pick(phone, ["number", "nationalNumber", "country", "countryCallingCode"]) as Phone)
        : null,
    };
    const differences = Object.keys(newData).filter(key => {
      switch (key) {
        case "phoneNumber":
          return !isEqual(newData.phoneNumber?.number, data.phoneNumber?.number);
        default:
          return !isEqual(newData[key as DataKey], data[key as DataKey]);
      }
    });
    // if no changes detected, return
    if (differences.length < 1) return toast.error("No changes detected");
    const bodyEdits = pick(newData, differences);
    const promise = new Promise<User>(async (resolve, reject) => {
      await editProfileMutation.mutateAsync(bodyEdits).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Updating account...",
      success: result => {
        setTimeout(async () => {
          refetch();
          await update({ id: result.id });
          router.refresh();
        }, 2000);
        return "Account updated successfully";
      },
      error: err => err || "An unexpected error occurred",
    });
  };
  return (
    <form action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Text size="3" weight="medium">
          Account
          <br />
          <span className="text-sm text-muted-foreground">Update your account information</span>
        </Text>
        <Input
          size="lg"
          variant="bordered"
          name="email"
          type="email"
          placeholder="jhondoe@example.com"
          description="Your email address."
          startContent={
            <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
          }
          defaultValue={data.email}
          validate={value => validateSchema(value, stringSchema("Email").email("Invalid email"))}
          errorMessage={valid => valid.validationErrors}
        />

        <Input
          type="tel"
          size="lg"
          variant="bordered"
          name="phoneNumber"
          defaultValue={data.phoneNumber?.nationalNumber || undefined}
          placeholder="000-000-0000"
          description="Your phone number."
          startContent={
            <div className="flex items-center">
              <Autocomplete
                type="tel"
                defaultItems={Object.entries(pick(countries, ["US", "EG", "NG", "IN", "BR"]))}
                aria-label="Select Country"
                variant="underlined"
                size="sm"
                classNames={{ base: "w-[8rem] p-0", popoverContent: "w-[20rem]" }}
                isClearable={false}
                selectedKey={countryCode}
                onSelectionChange={key => setCountryCode(key as string)}
              >
                {([key, { name, phone }]) => (
                  <AutocompleteItem
                    key={key}
                    value={name}
                    startContent={
                      <Avatar
                        alt={name}
                        className="h-6 w-6"
                        src={`https://flagcdn.com/${key.toLowerCase()}.svg`}
                      />
                    }
                  >
                    {`(+${phone}) ${name}`}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          }
        />

        <Textarea
          variant="bordered"
          size="lg"
          name="address"
          defaultValue={data.address || undefined}
          placeholder="25th Street, Cairo, Egypt"
          description="Your address."
          classNames={{ label: "text-md" }}
          type="text"
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 0, 10_000))}
          errorMessage={valid => valid.validationErrors}
        />

        <Button type="submit" color="primary" isLoading={editProfileMutation.isPending}>
          <Text size="3" weight="medium">
            Update Account
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default AccountTab;
