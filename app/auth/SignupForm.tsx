"use client";

import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { Modify } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema, stringSchema } from "@/lib/validation-schemas";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { User } from "@prisma/client";
import { Text } from "@radix-ui/themes";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type SignupData = Pick<Modify<User, { password: string }>, "name" | "email" | "password">;
const SignupForm = ({ setTab }: { setTab: Dispatch<SetStateAction<string | number>> }) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const signupMutation = useMutationHook<User>("/api/auth", ["signup"]);

  const handleSubmitSignUp = async (formData: FormData) => {
    const data = getFormDataObject<SignupData>(formData);
    const promise = new Promise<{ name: string }>(async (resolve, reject) =>
      signupMutation.mutateAsync(data).then(resolve).catch(reject)
    );
    toast.promise(
      promise,
      {
        pending: "Signing up...",
        success: "Signed up successfully",
        error: {
          render: ({ data }: { data: Error }) => data.message || "An unexpected error occurred",
        },
      },
      { toastId: "signup-toast" }
    );
  };
  return (
    <form className="flex flex-col gap-4" action={handleSubmitSignUp}>
      <Input
        isRequired
        variant="underlined"
        name="name"
        label="Name"
        validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 100))}
        errorMessage={valid => valid.validationErrors}
      />
      <Input
        isRequired
        variant="underlined"
        name="email"
        label="Email"
        type="email"
        validate={value => validateSchema(value, stringSchema("Email").email("Invalid email"))}
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
        validate={value => validateSchema(value, stringMinMaxSchema("Password", 8, 30))}
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
