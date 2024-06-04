"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { useZodValidationResolver } from "@/lib/utils";
import { ChangePasswordFormValues, changePasswordSchema } from "@/lib/validation/user-schema";
import { Button, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SecurityTabForm = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const changePassMutation = useMutationHook<User, ChangePasswordFormValues>(
    `/api/change-password`,
    ["changePassword"],
    "PATCH"
  );
  const form = useForm<ChangePasswordFormValues>({
    resolver: useZodValidationResolver(changePasswordSchema),
    defaultValues: {
      /* newPassword: "", oldPassword: "", confirmPassword: "" */
    },
    mode: "onTouched",
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    const promise = new Promise<User>(async (resolve, reject) => {
      await changePassMutation.mutateAsync(data).then(resolve).catch(reject);
    });
    toast.promise(promise, {
      loading: "Changing password...",
      success: result => {
        setTimeout(async () => {
          router.refresh();
        }, 2000);
        return "Password changed successfully!";
      },
      error: err => err || "An unexpected error occurred",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4" align="start">
          <Text size="3" weight="medium">
            Security Settings
            <br />
            <span className="text-sm text-muted-foreground">Manage your security preferences </span>
          </Text>

          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    isRequired
                    size="lg"
                    variant="bordered"
                    placeholder="Old Password"
                    description="Enter your old password"
                    type={isVisible.oldPassword ? "text" : "password"}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          setIsVisible(old => ({ ...old, oldPassword: !old.oldPassword }))
                        }
                      >
                        {isVisible.oldPassword ? (
                          <EyeOffIcon className="flex-shrink-0 text-2xl text-default-400" />
                        ) : (
                          <EyeIcon className="flex-shrink-0 text-2xl text-default-400" />
                        )}
                      </button>
                    }
                    isInvalid={form.formState.errors.oldPassword ? true : false}
                    errorMessage={form.formState.errors.oldPassword?.message
                      ?.split("\n")
                      .map((msg, i) => <p key={i}>{msg}</p>)}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      isRequired
                      size="lg"
                      variant="bordered"
                      placeholder="New Password"
                      description="Enter your new password"
                      type={isVisible.newPassword ? "text" : "password"}
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() =>
                            setIsVisible(old => ({ ...old, newPassword: !old.newPassword }))
                          }
                        >
                          {isVisible.newPassword ? (
                            <EyeOffIcon className="flex-shrink-0 text-2xl text-default-400" />
                          ) : (
                            <EyeIcon className="flex-shrink-0 text-2xl text-default-400" />
                          )}
                        </button>
                      }
                      isInvalid={form.formState.errors.newPassword ? true : false}
                      errorMessage={form.formState.errors.newPassword?.message
                        ?.split("\n")
                        .map((msg, i) => <p key={i}>{msg}</p>)}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    isRequired
                    size="lg"
                    variant="bordered"
                    placeholder="Confirm Password"
                    description="Confirm your new password"
                    type={isVisible.confirmPassword ? "text" : "password"}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() =>
                          setIsVisible(old => ({ ...old, confirmPassword: !old.confirmPassword }))
                        }
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
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" color="primary" isLoading={changePassMutation.isPending}>
            <Text size="3" weight="medium">
              Change Password
            </Text>
          </Button>
        </Flex>
      </form>
    </Form>
  );
};

export default SecurityTabForm;
