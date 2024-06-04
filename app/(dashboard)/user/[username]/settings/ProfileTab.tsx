"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import Upload from "@/components/common/Upload";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getProfile } from "@/lib/query-functions/user";
import { Modify } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { birthDateSchema, stringMinMaxSchema } from "@/lib/validation/common-schema";
import {
  fromDate,
  getLocalTimeZone,
  isSameDay,
  toCalendarDate,
  today,
} from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { DatePicker, DateValue, Select, Selection, SelectItem } from "@nextui-org/react";
import { Gender, User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { isEqual, pick } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DataKey = "name" | "image" | "gender" | "birthday";
type TData = Partial<Pick<Modify<User, { phoneNumber: string }>, DataKey>>;
type TBody = Partial<Pick<User, DataKey>>;
const ProfileTabForm = ({ username }: { username: string }) => {
  const router = useRouter();
  const { update } = useSession();
  const [resources, setResources] = useState<{ public_id: string; secure_url: string }[]>([]);
  const [deletedRes, setDeletedRes] = useState<string[]>([]);
  const [temp, setTemp] = useState<string[]>([]);
  const [genderValue, setGenderValue] = useState<Selection>();
  const [birthday, setBirthday] = useState<DateValue>();
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
    }
  }, [data]);

  if (isLoading || isRefetching) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>User not found</Text>;

  const handleSubmit = async (formData: FormData) => {
    const body = getFormDataObject<TData>(formData);
    // compare old profile data with new data
    const newData = {
      ...body,
      image: resources[0] || null,
      gender:
        genderValue && genderValue !== "all" ? (genderValue.values().next().value as Gender) : null,
      birthday: birthday ? birthday.toDate(getLocalTimeZone()) : null,
    };
    const differences = Object.keys(newData).filter(key => {
      switch (key) {
        case "image":
          return !isEqual(newData.image?.public_id, data.image?.public_id);
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
      loading: "Updating profile...",
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
          router.refresh();
        }, 2000);
        return "Profile updated successfully";
      },
      error: err => err || "An unexpected error occurred",
    });
  };
  return (
    <form action={handleSubmit}>
      <Flex direction="column" gap="4" align="start">
        <Text size="3" weight="medium">
          Profile
          <br />
          <span className="text-sm text-muted-foreground">
            This displays your public profile on the site.
          </span>
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
          labelPlacement="outside"
          description="Your full name as it will appear on your profile."
          name="name"
          placeholder="Jhon Doe"
          type="name"
          defaultValue={data.name}
          validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 256))}
          errorMessage={valid => valid.validationErrors}
        />

        <Select
          variant="bordered"
          placeholder="gender"
          description="Select your gender."
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

        <DatePicker
          name="birthday"
          // label="Birth Date"
          description="Select your birth date."
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
              birthDateSchema("Birthday", 18, 100)
            )
          }
          value={birthday}
          onChange={setBirthday}
        />

        <Button type="submit" color="primary" isLoading={editProfileMutation.isPending}>
          <Text size="3" weight="medium">
            Update Profile
          </Text>
        </Button>
      </Flex>
    </form>
  );
};

export default ProfileTabForm;
