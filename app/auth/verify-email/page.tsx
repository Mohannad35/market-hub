import EmailVerifiedTemplate from "@/emails/email-verified-template";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { MailCheckIcon, MailWarningIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const headersList = headers();
  const baseUrl = `${headersList.get("x-forwarded-proto")}://${headersList.get("host")}`;
  const token = searchParams?.token as string | undefined;
  let message = "Verifying email...";
  let verified = false;
  // Checks if a verification token is provided in the URL.
  if (!token) message = "No email verification token found. Check your email.";
  else {
    // Attempts to find a user in the database with the provided email verification token.
    const dbToken = await prisma.token.findUnique({ where: { token }, include: { user: true } });
    if (!dbToken) message = "No email verification token found. Check your email.";
    else {
      const user = dbToken.user;
      // Conditionally updates the message and verified status based on the user lookup.
      if (!user) message = "User not found. Check your email for the verification link.";
      else {
        const isExpired = dbToken.expires < new Date();
        // Checks if the email is already verified.
        if (user.isVerified) message = "Email already verified.";
        // Checks if the token type is not a verification token.
        else if (dbToken.type !== "verification") message = "Invalid token type.";
        // Checks if the email verification token has expired.
        else if (isExpired)
          message = "Verification token expired. Check your profile for a new verification link.";
        else {
          // If the user is found and token is not expired, update the user to be verified and delete the token.
          await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, tokens: { delete: { token } } },
          });
          // Updates the message and verified status based on the token expiration status.
          message = `Email verified! ${user.email}`;
          verified = true;
          // If the email is successfully verified, send an email to the user.
          if (process.env.SENDGRID_API_KEY) {
            // Send email verified email
            const emailVerifiedHtml = render(
              EmailVerifiedTemplate({ username: user.name, baseUrl })
            );
            await sendgrid
              .send({
                from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
                to: user.email!,
                subject: "Email verified successfully",
                html: emailVerifiedHtml,
              })
              .then(() => logger.info("Email sent"))
              .catch(logger.error);
          }
        }
      }
    }
  }

  return (
    <Flex justify="center" className="container" p="4" mt="9">
      <Card className="min-w-sm max-w-sm border p-2 text-center">
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
