"use client";

import { formatErrors, getFormDataObject } from "@/components/utils";
import { Button, Input } from "@nextui-org/react";
import { Text } from "@radix-ui/themes";
import { EyeIcon, EyeOffIcon, LogInIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Id, toast } from "react-toastify";
import { string } from "zod";

const SigninForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toastId = useRef<Id | null>(null);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmitSignIn = async (formData: FormData) => {
    setIsLoading(true);
    const data = getFormDataObject(formData);
    toastId.current = toast("Signing in...", { autoClose: false, isLoading: true });
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    switch (res?.error) {
      case "CredentialsSignin":
        toast.update(toastId.current, {
          isLoading: false,
          type: "error",
          render: "Invalid email or password",
          autoClose: 3000,
          progress: 0,
        });
        setIsLoading(false);
        break;
    }
    if (!res?.error) {
      toast.update(toastId.current, {
        isLoading: false,
        type: "success",
        render: "Signed in successfully",
        autoClose: 3000,
        progress: 0,
      });
      const callbackUrl = searchParams.get("callbackUrl") ?? searchParams.get("redirect") ?? "/";
      setTimeout(() => router.replace(callbackUrl), 3000);
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" action={handleSubmitSignIn}>
      <Input
        variant="underlined"
        isRequired
        name="email"
        label="Email"
        type="email"
        validate={value => {
          const valid = string()
            .email("Invalid email")
            .safeParse(value ?? "");
          return valid.success ? true : formatErrors(valid.error).messege;
        }}
        errorMessage={valid => valid.validationErrors}
      />

      <Input
        type={isVisible ? "text" : "password"}
        name="password"
        label="Password"
        isRequired
        variant="underlined"
        endContent={
          <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
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
