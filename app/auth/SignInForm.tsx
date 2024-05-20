"use client";

import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { LockIcon } from "@/components/icons/LockIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useZodValidationResolver } from "@/lib/utils";
import { signInSchema, SignInSchemaFormValues } from "@/lib/validation/user-schema";
import { Icon as Iconify } from "@iconify/react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/react";
import { Flex, Text } from "@radix-ui/themes";
import { nanoid } from "nanoid";
import { signIn } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSessionStorage } from "react-use";
import { toast } from "sonner";

const SigninForm = ({ setTab }: { setTab: Dispatch<SetStateAction<string | number>> }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useSessionStorage("callbackUrl", "/");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const form = useForm<SignInSchemaFormValues>({
    resolver: useZodValidationResolver(signInSchema),
    defaultValues: {},
    mode: "onTouched",
  });

  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());
    const callBackUrl = query.get("callbackUrl") ?? query.get("redirect");
    const error = query.get("error");
    const code = query.get("code");
    if (callBackUrl) {
      setCallbackUrl(callBackUrl);
      query.delete("callbackUrl");
    }
    if (error || code) {
      switch (code) {
        case "credentials":
          toast.error("Invalid email or password", { id: "credentials" });
          break;
        default:
          if (error) toast.error(error, { id: "error" });
          break;
      }
      query.delete("error");
      query.delete("code");
    }
    router.replace(pathname + `${query.size > 0 ? "?" + query.toString() : ""}`);
  }, [pathname, router, searchParams, setCallbackUrl]);

  async function onSubmit(data: SignInSchemaFormValues) {
    setLoading(true);
    const promise = new Promise(async (resolve, reject) => {
      await signIn("credentials", { ...data, redirect: false }).then(data =>
        data?.error ? reject(data.error) : resolve(data)
      );
    });
    toast.promise(promise, {
      loading: "Signing in...",
      success: data => {
        setLoading(false);
        setTimeout(() => {
          router.replace(callbackUrl);
          setCallbackUrl("/");
        }, 2000);
        return "Signed in successfully";
      },
      error: err => {
        setLoading(false);
        if (err === "CredentialsSignin") return "Invalid email or password";
        else return err || "An unexpected error occurred";
      },
      id: "signin-toast" + nanoid(4),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4" align="start">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    isRequired
                    type="text"
                    size="lg"
                    variant="bordered"
                    placeholder="Username or Email"
                    startContent={
                      <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
                    }
                    isInvalid={form.formState.errors.username ? true : false}
                    errorMessage={form.formState.errors.username?.message
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
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    isRequired
                    type={isVisible ? "text" : "password"}
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
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                        ) : (
                          <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                        )}
                      </button>
                    }
                    isInvalid={form.formState.errors.password ? true : false}
                    errorMessage={form.formState.errors.password?.message
                      ?.split("\n")
                      .map((msg, i) => <p key={i}>{msg}</p>)}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Flex justify="between" width="100%">
            <Text>
              Don&apos;t have an account?{" "}
              <Text onClick={() => setTab("sign-up")} className="cursor-pointer text-primary-500">
                Sign up
              </Text>
            </Text>
            <Link color="secondary" href="/auth/forgot-password" size="sm">
              Forgot password?
            </Link>
          </Flex>

          <Button
            fullWidth
            type="submit"
            color="primary"
            isLoading={loading}
            endContent={<Iconify icon="solar:login-3-bold-duotone" fontSize={24} />}
          >
            <Text size="3" weight="medium">
              Login
            </Text>
          </Button>
        </Flex>
      </form>
    </Form>
  );
};

export default SigninForm;
