"use client";

import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { LockIcon } from "@/components/icons/LockIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema, stringSchema } from "@/lib/validation/common-schema";
import { emailOrUsernameSchema, passwordSchema } from "@/lib/validation/user-schema";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Text } from "@radix-ui/themes";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SigninForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useState("/");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());
    setCallbackUrl(query.get("callbackUrl") ?? query.get("redirect") ?? "/");
    const error = query.get("error");
    const code = query.get("code");
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
    query.delete("callbackUrl");
    router.push(pathname + `${query.size > 0 ? "?" + query.toString() : ""}`);
  }, [pathname, router, searchParams]);

  const handleSubmitSignIn = async (formData: FormData) => {
    setIsLoading(true);
    const callbackUrl = searchParams.get("callbackUrl") ?? searchParams.get("redirect") ?? "/";
    const data = getFormDataObject<{ username: string; password: string }>(formData);
    const { username, password } = data;
    // await signIn("credentials", { username: data.email, password: data.password, callbackUrl });
    const promise = new Promise(async (resolve, reject) => {
      await signIn("credentials", { username, password, redirect: false }).then(data =>
        data?.error ? reject(data.error) : resolve(data)
      );
    });
    toast.promise(promise, {
      loading: "Signing in...",
      success: data => {
        setTimeout(() => router.replace(callbackUrl), 2000);
        return "Signed in successfully";
      },
      error: err => {
        if (err === "CredentialsSignin") return "Invalid email or password";
        else return err || "An unexpected error occurred";
      },
    });
    setIsLoading(false);
  };

  return (
    <form className="flex flex-col gap-4" action={handleSubmitSignIn}>
      <Input
        isRequired
        type="text"
        size="lg"
        name="username"
        variant="bordered"
        placeholder="Username or Email"
        startContent={
          <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
        }
        validate={value => validateSchema(value, emailOrUsernameSchema)}
        errorMessage={valid => valid.validationErrors}
      />

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
              <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
            ) : (
              <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
            )}
          </button>
        }
        errorMessage="Required"
      />

      <Button fullWidth type="submit" color="primary" isLoading={isLoading}>
        <Text size="3" weight="medium">
          Login
        </Text>
      </Button>
    </form>
  );
};

export default SigninForm;
