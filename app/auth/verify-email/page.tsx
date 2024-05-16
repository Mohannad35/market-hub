import prisma from "@/prisma/client";
import { getLocalTimeZone, now, parseAbsoluteToLocal } from "@internationalized/date";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { MailCheckIcon, MailWarningIcon } from "lucide-react";
import Link from "next/link";

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const token = searchParams?.token as string | undefined;
  let message = "Verifying email...";
  let verified = false;
  // Checks if a verification token is provided in the URL.
  if (!token) message = "No email verification token found. Check your email.";
  else {
    // Attempts to find a user in the database with the provided email verification token.
    const user = await prisma.user.findFirst({
      where: { verificationToken: { token } },
      include: { verificationToken: true },
    });
    // Conditionally updates the message and verified status based on the user lookup.
    if (!user) message = "User not found. Check your email for the verification link.";
    else {
      // Checks if the email verification token has expired.
      const isExpired =
        now(getLocalTimeZone()).compare(
          parseAbsoluteToLocal(user.verificationToken!.expires.toISOString())
        ) > 0;
      if (isExpired)
        message = "Verification token expired. Check your profile for a new verification link.";
      else {
        // If the user is found and token is not expired, update the user to be verified and delete the token.
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true, verificationToken: { delete: true } },
        });
        // Updates the message and verified status based on the token expiration status.
        message = `Email verified! ${user.email}`;
        verified = true;
      }
    }
  }

  return (
    <Flex justify="center" className="container" p="4" mt="9">
      <Card className="max-w-sm border p-2 text-center">
        <CardHeader className="justify-center">
          <Heading>Email Verification</Heading>
        </CardHeader>
        <CardBody className="items-center gap-4">
          {verified ? <MailCheckIcon size={56} /> : <MailWarningIcon size={56} />}
          <Text size="4" className="text-center text-muted-foreground" weight="medium">
            {message}
          </Text>
        </CardBody>
        <CardFooter>
          {verified && (
            // Displays a sign-in link if the email is successfully verified.
            <Button as={Link} href={"/auth"} replace fullWidth>
              Sign in
            </Button>
          )}
        </CardFooter>
      </Card>
    </Flex>
  );
};

export default VerifyEmailPage;
