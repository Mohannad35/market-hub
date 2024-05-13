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
  dateSchema,
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

type DataKey =
  | "name"
  | "email"
  | "image"
  | "phoneNumber"
  | "gender"
  | "birthday"
  | "address"
  | "businessAddress"
  | "websiteAddress";
type TData = Partial<Pick<Modify<User, { phoneNumber: string }>, DataKey>>;
type TBody = Partial<Pick<User, DataKey>>;
const EditProfileForm = () => {
  const router = useRouter();
  const { update } = useSession();
  const [resources, setResources] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [deletedRes, setDeletedRes] = useState<string[]>([]);
  const [temp, setTemp] = useState<string[]>([]);
  const [genderValue, setGenderValue] = useState<Selection>();
  const [birthday, setBirthday] = useState<DateValue>();
  const [countryCode, setCountryCode] = useState<string>("EG");
  const editProfileMutation = useMutationHook<User, TBody>(`/api/user`, ["editProfile"], "PATCH");
  const { data, error, isSuccess, isLoading, isRefetching, refetch } = useQuery<User>({
    queryKey: ["getProfile"],
    queryFn: getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (data) {
      data.avatar && setResources([{ public_id: data.avatar, secure_url: data.avatar }]);
      data.image && setResources([data.image]);
      data.gender && setGenderValue(new Set([data.gender]));
      data.birthday &&
        setBirthday(toCalendarDate(fromDate(new Date(data.birthday), getLocalTimeZone())));
      data.phoneNumber && setCountryCode(data.phoneNumber.country);
    }
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
      address: body.address,
      businessAddress: body.businessAddress,
      websiteAddress: body.websiteAddress?.startsWith("http")
        ? body.websiteAddress
        : body.websiteAddress?.length ?? 0 > 0
          ? `https://${body.websiteAddress}`
          : body.websiteAddress,
      image: resources[0] || null,
      gender:
        genderValue && genderValue !== "all" ? (genderValue.values().next().value as Gender) : null,
      birthday: birthday ? birthday.toDate(getLocalTimeZone()) : null,
      phoneNumber: phone
        ? (pick(phone, ["number", "nationalNumber", "country", "countryCallingCode"]) as Phone)
        : null,
    };
    const differences = Object.keys(newData).filter(key => {
      switch (key) {
        case "image":
          return !isEqual(newData.image?.public_id, data.image?.public_id);
        case "phoneNumber":
          return !isEqual(newData.phoneNumber?.number, data.phoneNumber?.number);
        case "birthday":
          return birthday && data.birthday
            ? !isSameDay(birthday, fromDate(new Date(data.birthday), getLocalTimeZone()))
            : false;
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
      loading: "Editing profile...",
      success: result => {
        setResources([]);
        setTemp([]);
        fetch("/api/admin/upload", {
          method: "DELETE",
          body: JSON.stringify({ publicId: deletedRes }),
        });
        setTimeout(async () => {
          refetch();
          await update({ id: result.id });
          router.push("/dashboard/settings/profile");
        }, 2000);
        return "Profile updated successfully";
      },
      error: err => err || "An unexpected error occurred",
    });
  };
  return (
    <form action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Text size="7" weight="medium">
          Edit Profile
        </Text>
        <Upload
          resources={resources}
          setResources={setResources}
          temp={temp}
          setTemp={setTemp}
          setDeletedRes={setDeletedRes}
          folder="avatar"
          cropping
        />
        <Input
          isRequired
          size="lg"
          variant="bordered"
          label="Name"
          name="name"
          placeholder="Jhon Doe"
          type="name"
          defaultValue={data.name}
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 256))}
          errorMessage={valid => valid.validationErrors}
        />
        <Flex width="100%" gap="4" direction={{ initial: "column", xs: "row" }} justify="between">
          <Input
            isRequired
            size="lg"
            variant="bordered"
            label="Email"
            name="email"
            type="email"
            placeholder="jhondoe@example.com"
            endContent={
              <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
            }
            defaultValue={data.email}
            validate={value => validateSchema(value, stringSchema("Email").email("Invalid email"))}
            errorMessage={valid => valid.validationErrors}
          />
          <DatePicker
            name="birthday"
            label="Birth Date"
            variant="bordered"
            size="lg"
            selectorButtonProps={{ size: "md" }}
            classNames={{ selectorIcon: "text-primary-500 text-2xl" }}
            showMonthAndYearPickers
            minValue={today(getLocalTimeZone()).subtract({ years: 100 })}
            maxValue={today(getLocalTimeZone()).subtract({ years: 18 })}
            validate={value =>
              validateSchema(
                value ? value.toDate(getLocalTimeZone()) : undefined,
                dateSchema("Birthday", 18, 100)
              )
            }
            value={birthday}
            onChange={setBirthday}
          />
        </Flex>

        <Flex width="100%" gap="4" direction={{ initial: "column", xs: "row" }} justify="between">
          <Input
            type="tel"
            size="lg"
            variant="bordered"
            name="phoneNumber"
            defaultValue={data.phoneNumber?.nationalNumber || undefined}
            placeholder="000-000-0000"
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
          <Select
            variant="bordered"
            placeholder="gender"
            size="lg"
            items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
            selectedKeys={genderValue}
            onSelectionChange={setGenderValue}
          >
            {({ value, label }) => <SelectItem key={value}>{label}</SelectItem>}
          </Select>
        </Flex>

        <Textarea
          variant="bordered"
          size="lg"
          name="address"
          defaultValue={data.address || undefined}
          label="Address"
          classNames={{ label: "text-md" }}
          type="text"
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 0, 10_000))}
          errorMessage={valid => valid.validationErrors}
        />

        <DividerWithLabel label="Vendor Details" />

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
          validate={value => validateSchema(value, urlSchema.nullish())}
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

export default EditProfileForm;
