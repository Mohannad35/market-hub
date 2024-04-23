"use client";

import { formatErrors, getFormDataObject } from "@/components/utils";
import { Button, Input } from "@nextui-org/react";
import { Text } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Id, toast } from "react-toastify";
import { string } from "zod";

const SignupForm = ({ setTab }: { setTab: Dispatch<SetStateAction<string | number>> }) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toastId = useRef<Id | null>(null);

  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: { [key: string]: FormDataEntryValue }) =>
      fetch("/api/users", { method: "POST", body: JSON.stringify(data) }).then(res => res.json()),
  });

  useEffect(() => {
    switch (signupMutation.status) {
      case "pending":
        toastId.current = toast("Signing up...", { autoClose: false, isLoading: true });
        break;
      case "success":
        if (toastId.current) {
          if (signupMutation.data.user) {
            toast.update(toastId.current, {
              isLoading: false,
              type: "success",
              render: "Signed up successfully",
              autoClose: 3000,
              progress: 0,
            });
            setTimeout(() => setTab("login"), 3000);
          } else if (signupMutation.data.error) {
            toast.update(toastId.current, {
              isLoading: false,
              type: "error",
              render: signupMutation.data.error,
              autoClose: 3000,
              progress: 0,
            });
          }
        }
      default:
        break;
    }
  }, [setTab, signupMutation.data, signupMutation.status]);

  const handleSubmitSignUp = async (formData: FormData) => {
    const data = getFormDataObject(formData);
    signupMutation.mutate(data);
  };
  return (
    <form className="flex flex-col gap-4" action={handleSubmitSignUp}>
      <Input
        isRequired
        variant="underlined"
        name="name"
        label="Name"
        validate={value => {
          const valid = string()
            .min(2, "Name must contain at least 2 character(s)")
            .max(256, "Name must contain at most 256 character(s)")
            .safeParse(value ?? "");
          return valid.success ? true : formatErrors(valid.error).messege;
        }}
        errorMessage={valid => valid.validationErrors}
      />
      <Input
        isRequired
        variant="underlined"
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
        isRequired
        variant="underlined"
        name="password"
        label="Password"
        type={isVisible ? "text" : "password"}
        endContent={
          <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
        validate={value => {
          const valid = string()
            .min(8, "Password must contain at least 2 character(s)")
            .max(30, "Password must contain at most 30 character(s)")
            .safeParse(value ?? "");
          return valid.success ? true : formatErrors(valid.error).messege;
        }}
        errorMessage={valid => valid.validationErrors}
      />

      <Button fullWidth type="submit" color="primary" isLoading={signupMutation.isPending}>
        <Text size="3" weight="medium">
          Sign up
        </Text>
      </Button>
    </form>
  );
};

export default SignupForm;
