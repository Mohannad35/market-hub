import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <Flex justify="center" className="container" p="4" mt="9">
      <Card className="w-[28rem] border p-2">
        <CardHeader className="justify-center">
          <Heading>Forgot your password?</Heading>
        </CardHeader>

        <CardBody className="items-center gap-4">
          <Image src="/forgot-password.png" alt="forgot password image" width={72} height={72} />
          <Text size="4" className="text-left text-muted-foreground" weight="medium">
            That&apos;s okay! It happens to the best of us.
            <br />
            Enter your email below and we&apos;ll send you a secure link to reset your password.
          </Text>
          <ForgotPasswordForm />
        </CardBody>
      </Card>
    </Flex>
  );
};

export default ForgotPasswordPage;
