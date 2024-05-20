"use client";

import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringSchema } from "@/lib/validation/common-schema";
import { Input, Link } from "@nextui-org/react";
import { MailFilledIcon } from "@nextui-org/shared-icons";
import { User } from "@prisma/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon as Iconify } from "@iconify/react";
import { Button } from "@nextui-org/react";
import { Text } from "@radix-ui/themes";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const resetPasswordMutation = useMutationHook<User, { email: string }>("/api/forgot-password", [
    "forgot-password",
  ]);
  async function handleResetPassword(formData: FormData) {
    const { email } = getFormDataObject<{ email: string }>(formData);
    const promise = new Promise<User>((resolve, reject) =>
      resetPasswordMutation.mutateAsync({ email }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Sending reset password email",
      success: data => {
        setTimeout(() => router.push("/auth"), 2000);
        return `Email sent to ${data.email}`;
      },
      error: err => {
        return err || "An unexpected error occurred";
      },
      id: "forgot-password-toast" + nanoid(4),
    });
  }

  return (
    <form action={handleResetPassword} className="w-full">
      <Input
        isRequired
        type="email"
        name="email"
        variant="bordered"
        placeholder="jhondoe@example.com"
        startContent={
          <MailFilledIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
        }
        validate={value => validateSchema(value, stringSchema("Name").email())}
        errorMessage={valid => valid.validationErrors}
      />

      <Button
        fullWidth
        type="submit"
        color="primary"
        className="mb-2 mt-3"
        endContent={<Iconify icon="streamline:mail-send-email-message-solid" fontSize={18} />}
      >
        <Text size="4" weight="medium">
          Get secure link
        </Text>
      </Button>

      <Text size="3">
        Remember your password?{" "}
        <Link color="secondary" href="/auth" underline="hover">
          Sign in
        </Link>
      </Text>
    </form>
  );
};

export default ForgotPasswordForm;
