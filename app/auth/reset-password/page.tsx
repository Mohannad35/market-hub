import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import ResetPasswordForm from "./ResetPasswordForm";
import Image from "next/image";

const ResetPasswordPage = () => {
  return (
    <Flex justify="center" className="container" p="4" mt="9">
      <Card className="w-[28rem] border p-2">
        <CardHeader className="justify-center">
          <Heading>Reset your password</Heading>
        </CardHeader>

        <CardBody className="items-center gap-4">
          <Image src="/reset-password.png" alt="reset password image" width={72} height={72} />
          <Text size="4" className="w-full text-left text-muted-foreground" weight="medium">
            Enter your new password below.
          </Text>
          <ResetPasswordForm />
        </CardBody>
      </Card>
    </Flex>
  );
};

export default ResetPasswordPage;
