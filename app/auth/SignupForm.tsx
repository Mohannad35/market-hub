"use client";

import DividerWithLabel from "@/components/common/DividerWithLabel";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import {
  dateSchema,
  regexSchema,
  stringMinMaxSchema,
  stringSchema,
  urlSchema,
} from "@/lib/validation/common-schema";
import { passwordSchema, usernameSchema } from "@/lib/validation/user-schema";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  DatePicker,
  Select,
  Tooltip,
  Textarea,
  SelectItem,
  Selection,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { Gender, Phone, User } from "@prisma/client";
import { Text } from "@radix-ui/themes";
import { countries } from "countries-list";
import { CountryCode, parsePhoneNumber } from "libphonenumber-js";
import { pick } from "lodash";
import {
  ContactRoundIcon,
  EyeIcon,
  EyeOffIcon,
  FingerprintIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type Keys =
  | "name"
  | "email"
  | "password"
  | "username"
  | "phoneNumber"
  | "gender"
  | "birthday"
  | "address"
  | "businessAddress"
  | "websiteAddress";
type TBody = Pick<Modify<User, { password: string; phoneNumber: string | null }>, Keys>;
type TData = Pick<Modify<User, { password: string }>, Keys>;
const SignupForm = ({ setTab }: { setTab: Dispatch<SetStateAction<string | number>> }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [birthday, setBirthday] = useState<DateValue>();
  const [genderValue, setGenderValue] = useState<Selection>();
  const [countryCode, setCountryCode] = useState<string>("EG");
  const signupMutation = useMutationHook<User, TData>("/api/auth", ["signup"]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleSubmitSignUp = async (formData: FormData) => {
    const body = getFormDataObject<TBody>(formData);
    // Get the phone number and parse it
    const phone = body.phoneNumber
      ? parsePhoneNumber(body.phoneNumber, countryCode as CountryCode)
      : undefined;
    // If the phone number is invalid, show an error toast
    if (phone && !phone.isValid()) return toast.error("Invalid phone number");
    const newData = {
      ...body,
      websiteAddress: body.websiteAddress?.startsWith("http")
        ? body.websiteAddress
        : body.websiteAddress?.length ?? 0 > 0
          ? `https://${body.websiteAddress}`
          : body.websiteAddress,
      gender:
        genderValue && genderValue !== "all" ? (genderValue.values().next().value as Gender) : null,
      birthday: birthday ? birthday.toDate(getLocalTimeZone()) : null,
      phoneNumber: phone
        ? (pick(phone, ["number", "nationalNumber", "country", "countryCallingCode"]) as Phone)
        : null,
    };
    const promise = new Promise<User>(async (resolve, reject) =>
      signupMutation.mutateAsync(newData).then(resolve).catch(reject)
    );
    toast.promise(
      promise,
      {
        pending: "Signing up...",
        success: {
          render: () => {
            setTimeout(() => setTab("login"), 2000);
            return "Signed up successfully";
          },
        },
        error: {
          render: ({ data }: { data: Error }) => data.message || "An unexpected error occurred",
        },
      },
      { toastId: "signup-toast" }
    );
  };

  return (
    <form className="flex flex-col gap-4" action={handleSubmitSignUp}>
      <Tooltip content="Public name" delay={1000} placement="top-start" size="lg">
        <div>
          <Input
            isRequired
            type="text"
            size="lg"
            variant="bordered"
            placeholder="John Doe"
            name="name"
            startContent={
              <ContactRoundIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
            }
            validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 100))}
            errorMessage={valid => valid.validationErrors}
          />
        </div>
      </Tooltip>

      <Tooltip content="Unique username" delay={1000} placement="top-start" size="lg">
        <div>
          <Input
            isRequired
            type="text"
            size="lg"
            name="username"
            variant="bordered"
            placeholder="john_doe"
            startContent={
              <FingerprintIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
            }
            validate={value => validateSchema(value, usernameSchema)}
            errorMessage={valid => valid.validationErrors}
          />
        </div>
      </Tooltip>

      <Tooltip content="User email address" delay={1000} placement="top-start" size="lg">
        <div>
          <Input
            isRequired
            type="email"
            variant="bordered"
            size="lg"
            name="email"
            placeholder="jhondoe@example.com"
            startContent={
              <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
            }
            validate={value => validateSchema(value, stringSchema("Email").email("Invalid email"))}
            errorMessage={valid => valid.validationErrors}
          />
        </div>
      </Tooltip>

      <Tooltip content="Password" delay={1000} placement="top-start" size="lg">
        <div>
          <Input
            isRequired
            type={isVisible ? "text" : "password"}
            size="lg"
            name="password"
            placeholder="Password"
            variant="bordered"
            startContent={
              <LockIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
            }
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <EyeOffIcon className="flex-shrink-0 text-2xl text-default-400" />
                ) : (
                  <EyeIcon className="flex-shrink-0 text-2xl text-default-400" />
                )}
              </button>
            }
            validate={value => {
              const result = validateSchema(value, passwordSchema);
              return result === true ? true : result.split("\n");
            }}
            errorMessage={valid =>
              valid.isInvalid && (
                <div>
                  {valid.validationErrors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )
            }
          />
        </div>
      </Tooltip>

      <Tooltip content="Birth date" delay={1000} placement="top-start" size="lg">
        <div>
          <DatePicker
            name="birthday"
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
        </div>
      </Tooltip>

      <Tooltip content="Phone number" delay={1000} placement="top-start" size="lg">
        <div>
          <Input
            type="tel"
            size="lg"
            variant="bordered"
            name="phoneNumber"
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
        </div>
      </Tooltip>

      <Tooltip content="Gender" delay={1000} placement="top-start" size="lg">
        <div>
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
        </div>
      </Tooltip>

      <Accordion>
        <AccordionItem
          key="1"
          aria-label="Advanced Details"
          hideIndicator
          className="p-0"
          classNames={{ trigger: "p-0" }}
          title={<DividerWithLabel label="Advanced Details" />}
        >
          <Tooltip content="Address" delay={1000} placement="top-start" size="lg">
            <div>
              <Textarea
                variant="bordered"
                size="lg"
                name="address"
                placeholder="25th Street, Cairo, Egypt"
                classNames={{ label: "text-md" }}
                type="text"
                validate={value => validateSchema(value, stringMinMaxSchema("Name", 0, 10_000))}
                errorMessage={valid => valid.validationErrors}
              />
            </div>
          </Tooltip>

          <Tooltip content="Website address" delay={1000} placement="top-start" size="lg">
            <div>
              <Input
                type="text"
                variant="bordered"
                size="lg"
                name="websiteAddress"
                placeholder="example.org"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-small text-default-400">https://</span>
                  </div>
                }
                validate={value => validateSchema(value, urlSchema.nullish())}
                errorMessage={valid => valid.validationErrors}
              />
            </div>
          </Tooltip>

          <Tooltip content="Business address" delay={1000} placement="top-start" size="lg">
            <div>
              <Textarea
                variant="bordered"
                size="lg"
                name="businessAddress"
                placeholder="25th Street, Cairo, Egypt"
                classNames={{ label: "text-md" }}
                type="text"
                validate={value => validateSchema(value, stringMinMaxSchema("Name", 0, 10_000))}
                errorMessage={valid => valid.validationErrors}
              />
            </div>
          </Tooltip>
        </AccordionItem>
      </Accordion>

      <Button fullWidth type="submit" color="primary" isLoading={signupMutation.isPending}>
        <Text size="3" weight="medium">
          Sign up
        </Text>
      </Button>
    </form>
  );
};

export default SignupForm;
