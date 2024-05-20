"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { useZodValidationResolver } from "@/lib/utils";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
  ResetPasswordTokenFormValues,
  resetPasswordTokenSchema,
} from "@/lib/validation/user-schema";
import { Icon as Iconify } from "@iconify/react";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { nanoid } from "nanoid";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState({ password: false, confirmPassword: false });
  const form = useForm<ResetPasswordFormValues>({
    resolver: useZodValidationResolver(resetPasswordSchema),
    defaultValues: {},
    mode: "onTouched",
  });
  const resetPwdMutation = useMutationHook<User, ResetPasswordTokenFormValues>(
    "/api/reset-password",
    ["reset-password"]
  );

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!searchParams.has("token")) return toast.error("Missing token");
    const body = { ...data, token: searchParams.get("token")! };
    const promise = new Promise<User>((resolve, reject) =>
      resetPwdMutation.mutateAsync(body).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Changing password...",
      success: data => {
        setTimeout(() => router.push("/auth"), 2000);
        return "Password changed successfully";
      },
      error: err => {
        return err || "An unexpected error occurred";
      },
      id: "reset-password-toast" + nanoid(4),
    });
  }

  if (!searchParams.has("token")) notFound();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Flex direction="column" gap="4" align="start">
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
                        placeholder="Enter your new password"
                        variant="bordered"
                        startContent={
                          <Iconify icon="solar:lock-password-bold-duotone" fontSize={24} />
                        }
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() =>
                              setIsVisible(old => ({ ...old, password: !old.password }))
                            }
                          >
                            {isVisible.password ? (
                              <Iconify icon="solar:eye-bold-duotone" fontSize={24} />
                            ) : (
                              <Iconify icon="solar:eye-closed-line-duotone" fontSize={24} />
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
                        placeholder="Confirm your new password"
                        variant="bordered"
                        startContent={
                          <Iconify icon="solar:lock-password-bold-duotone" fontSize={24} />
                        }
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() =>
                              setIsVisible(old => ({
                                ...old,
                                confirmPassword: !old.confirmPassword,
                              }))
                            }
                          >
                            {isVisible.confirmPassword ? (
                              <Iconify icon="solar:eye-bold-duotone" fontSize={24} />
                            ) : (
                              <Iconify icon="solar:eye-closed-line-duotone" fontSize={24} />
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

          <Button fullWidth type="submit" color="primary" isLoading={resetPwdMutation.isPending}>
            <Text size="3" weight="medium">
              Reset Password
            </Text>
          </Button>
        </Flex>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
