"use client";

import DividerWithLabel from "@/components/common/DividerWithLabel";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { useZodValidationResolver } from "@/lib/utils";
import { signUpModifiedSchema, SignUpSchemaFormValues } from "@/lib/validation/user-schema";
import { fromDate, getLocalTimeZone, toCalendarDate, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Checkbox,
  DatePicker,
  Link,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import { Gender, Phone, User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
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
import { nanoid } from "nanoid";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ModifiedSignUpSchemaFormValues = Modify<SignUpSchemaFormValues, { phoneNumber: string }>;
const SignupForm = ({ setTab }: { setTab: Dispatch<SetStateAction<string | number>> }) => {
  const [isVisible, setIsVisible] = useState({ confirmPassword: false, password: false });
  const [countryCode, setCountryCode] = useState<string>("EG");
  const signupMutation = useMutationHook<User, SignUpSchemaFormValues>("/api/auth", ["signup"]);
  const form = useForm<ModifiedSignUpSchemaFormValues>({
    resolver: useZodValidationResolver(signUpModifiedSchema),
    defaultValues: {},
    mode: "onTouched",
  });

  const toggleVisibility = (value: string) =>
    setIsVisible(old => ({ ...old, [value]: !old[value as keyof typeof old] }));

  async function onSubmit(data: ModifiedSignUpSchemaFormValues) {
    if (!countryCode)
      return form.setError("phoneNumber", { type: "manual", message: "Select a country" });
    const phone = data.phoneNumber
      ? parsePhoneNumber(data.phoneNumber, countryCode as CountryCode)
      : undefined;
    if (phone && (!phone.isValid() || !phone.isPossible()))
      return form.setError("phoneNumber", { type: "manual", message: "Invalid phone number" });
    const newData = {
      ...data,
      phoneNumber:
        phone &&
        (pick(phone, ["number", "country", "countryCallingCode", "nationalNumber"]) as Phone),
      websiteAddress: data.websiteAddress?.startsWith("http")
        ? data.websiteAddress
        : data.websiteAddress?.length ?? 0 > 0
          ? `https://${data.websiteAddress}`
          : data.websiteAddress,
      gender: data.gender as Gender,
    };
    const promise = new Promise<User>(async (resolve, reject) =>
      signupMutation.mutateAsync(newData).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Signing up...",
      success: data => {
        setTimeout(() => setTab("login"), 2000);
        return "Signed up successfully";
      },
      error: err => {
        return err || "An unexpected error occurred";
      },
      id: "signup-toast" + nanoid(4),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4" align="start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Tooltip content="Public name" delay={1000} placement="top-start" size="lg">
                    <div>
                      <Input
                        isRequired
                        type="text"
                        size="lg"
                        variant="bordered"
                        placeholder="John Doe"
                        startContent={
                          <ContactRoundIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                        }
                        isInvalid={form.formState.errors.name ? true : false}
                        errorMessage={form.formState.errors.name?.message
                          ?.split("\n")
                          .map((msg, i) => <p key={i}>{msg}</p>)}
                        {...field}
                      />
                    </div>
                  </Tooltip>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Tooltip content="Unique username" delay={1000} placement="top-start" size="lg">
                    <div>
                      <Input
                        isRequired
                        type="text"
                        size="lg"
                        variant="bordered"
                        placeholder="john_doe"
                        startContent={
                          <FingerprintIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                        }
                        isInvalid={form.formState.errors.username ? true : false}
                        errorMessage={form.formState.errors.username?.message
                          ?.split("\n")
                          .map((msg, i) => <p key={i}>{msg}</p>)}
                        {...field}
                      />
                    </div>
                  </Tooltip>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Tooltip
                    content="User email address"
                    delay={1000}
                    placement="top-start"
                    size="lg"
                  >
                    <div>
                      <Input
                        isRequired
                        type="email"
                        variant="bordered"
                        size="lg"
                        placeholder="jhondoe@example.com"
                        startContent={
                          <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                        }
                        isInvalid={form.formState.errors.email ? true : false}
                        errorMessage={form.formState.errors.email?.message
                          ?.split("\n")
                          .map((msg, i) => <p key={i}>{msg}</p>)}
                        {...field}
                      />
                    </div>
                  </Tooltip>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Tooltip content="Password" delay={1000} placement="top-start" size="lg">
                    <div>
                      <Input
                        isRequired
                        type={isVisible.password ? "text" : "password"}
                        size="lg"
                        placeholder="Password"
                        variant="bordered"
                        startContent={
                          <LockIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                        }
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() => toggleVisibility("password")}
                          >
                            {isVisible.password ? (
                              <EyeOffIcon className="flex-shrink-0 text-2xl text-default-400" />
                            ) : (
                              <EyeIcon className="flex-shrink-0 text-2xl text-default-400" />
                            )}
                          </button>
                        }
                        isInvalid={form.formState.errors.password ? true : false}
                        errorMessage={form.formState.errors.password?.message
                          ?.split("\n")
                          .map((msg, i) => <p key={i}>{msg}</p>)}
                        {...field}
                      />
                    </div>
                  </Tooltip>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Tooltip content="Confirm Password" delay={1000} placement="top-start" size="lg">
                    <div>
                      <Input
                        isRequired
                        type={isVisible.confirmPassword ? "text" : "password"}
                        size="lg"
                        placeholder="Confirm Password"
                        variant="bordered"
                        startContent={
                          <LockIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                        }
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() => toggleVisibility("confirmPassword")}
                          >
                            {isVisible.confirmPassword ? (
                              <EyeOffIcon className="flex-shrink-0 text-2xl text-default-400" />
                            ) : (
                              <EyeIcon className="flex-shrink-0 text-2xl text-default-400" />
                            )}
                          </button>
                        }
                        isInvalid={form.formState.errors.confirmPassword ? true : false}
                        errorMessage={form.formState.errors.confirmPassword?.message
                          ?.split("\n")
                          .map((msg, i) => <p key={i}>{msg}</p>)}
                        {...field}
                      />
                    </div>
                  </Tooltip>
                </FormControl>
              </FormItem>
            )}
          />
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="Advanced Details"
              hideIndicator
              className="p-0"
              classNames={{ trigger: "p-0" }}
              title={<DividerWithLabel label="Advanced Details" />}
            >
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Tooltip content="Birth date" delay={1000} placement="top-start" size="lg">
                        <div>
                          <DatePicker
                            variant="bordered"
                            size="lg"
                            selectorButtonProps={{ size: "md" }}
                            classNames={{ selectorIcon: "text-primary-500 text-2xl" }}
                            showMonthAndYearPickers
                            minValue={today(getLocalTimeZone()).subtract({ years: 100 })}
                            maxValue={today(getLocalTimeZone()).subtract({ years: 18 })}
                            isInvalid={form.formState.errors.birthday ? true : false}
                            errorMessage={form.formState.errors.birthday?.message
                              ?.split("\n")
                              .map((msg, i) => <p key={i}>{msg}</p>)}
                            value={
                              field.value
                                ? toCalendarDate(
                                    fromDate(new Date(field.value), getLocalTimeZone())
                                  )
                                : undefined
                            }
                            onChange={date => {
                              field.onChange(new Date(date.toDate(getLocalTimeZone())));
                            }}
                            isDisabled={field.disabled}
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        </div>
                      </Tooltip>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Tooltip content="Phone number" delay={1000} placement="top-start" size="lg">
                        <div>
                          <Input
                            type="tel"
                            size="lg"
                            variant="bordered"
                            placeholder="000-000-0000"
                            startContent={
                              <div className="flex items-center">
                                <Autocomplete
                                  type="tel"
                                  defaultItems={Object.entries(
                                    pick(countries, ["US", "EG", "NG", "IN", "BR"])
                                  )}
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
                            isInvalid={form.formState.errors.phoneNumber ? true : false}
                            errorMessage={form.formState.errors.phoneNumber?.message
                              ?.split("\n")
                              .map((msg, i) => <p key={i}>{msg}</p>)}
                            {...field}
                          />
                        </div>
                      </Tooltip>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
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
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={keys => {
                              if (keys === "all") return;
                              field.onChange(keys.values().next().value);
                            }}
                          >
                            {({ value, label }) => <SelectItem key={value}>{label}</SelectItem>}
                          </Select>
                        </div>
                      </Tooltip>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Tooltip content="Address" delay={1000} placement="top-start" size="lg">
                        <div>
                          <Textarea
                            variant="bordered"
                            size="lg"
                            placeholder="25th Street, Cairo, Egypt"
                            classNames={{ label: "text-md" }}
                            type="text"
                            isInvalid={form.formState.errors.email ? true : false}
                            errorMessage={form.formState.errors.email?.message
                              ?.split("\n")
                              .map((msg, i) => <p key={i}>{msg}</p>)}
                            value={field.value ? field.value : undefined}
                            onValueChange={field.onChange}
                          />
                        </div>
                      </Tooltip>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="websiteAddress"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Tooltip
                        content="Website address"
                        delay={1000}
                        placement="top-start"
                        size="lg"
                      >
                        <div>
                          <Input
                            type="text"
                            variant="bordered"
                            size="lg"
                            placeholder="example.org"
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-small text-default-400">https://</span>
                              </div>
                            }
                            isInvalid={form.formState.errors.websiteAddress ? true : false}
                            errorMessage={form.formState.errors.websiteAddress?.message
                              ?.split("\n")
                              .map((msg, i) => <p key={i}>{msg}</p>)}
                            {...field}
                          />
                        </div>
                      </Tooltip>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Tooltip
                        content="Business address"
                        delay={1000}
                        placement="top-start"
                        size="lg"
                      >
                        <div>
                          <Textarea
                            variant="bordered"
                            size="lg"
                            placeholder="25th Street, Cairo, Egypt"
                            classNames={{ label: "text-md" }}
                            type="text"
                            isInvalid={form.formState.errors.businessAddress ? true : false}
                            errorMessage={form.formState.errors.businessAddress?.message
                              ?.split("\n")
                              .map((msg, i) => <p key={i}>{msg}</p>)}
                            value={field.value ? field.value : undefined}
                            onValueChange={field.onChange}
                          />
                        </div>
                      </Tooltip>
                    </FormControl>
                  </FormItem>
                )}
              />
            </AccordionItem>
          </Accordion>

          <Flex direction="column" width="100%" gap="2">
            <Checkbox isRequired>
              <Text size="3" weight="medium">
                I read and agree to the{" "}
                <Link color="secondary" href="#" size="sm" underline="hover">
                  Terms of Service
                </Link>{" "}
                and the{" "}
                <Link color="secondary" href="#" size="sm" underline="hover">
                  Privacy Policy
                </Link>
                .
              </Text>
            </Checkbox>
            <Button fullWidth type="submit" color="primary" isLoading={signupMutation.isPending}>
              <Text size="3" weight="medium">
                Sign up
              </Text>
            </Button>
            <Flex justify="between" width="100%">
              <Text>
                Already have an account?{" "}
                <Text onClick={() => setTab("sign-up")} className="cursor-pointer text-primary-500">
                  Sign in
                </Text>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Form>
  );
};

export default SignupForm;
