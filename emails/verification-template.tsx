// Import React and necessary components from @react-email/components
import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// Define the properties expected by the VerificationTemplate component
interface VerificationTemplateProps {
  username: string;
  emailVerificationToken: string;
  baseUrl: string;
}

// Define the VerificationTemplate component that takes the defined properties
export const VerificationTemplate = ({
  username,
  emailVerificationToken,
  baseUrl,
}: VerificationTemplateProps) => (
  <Html>
    <Head />
    <Preview>Verification Email for {"Market Hub"}.</Preview>
    <Body>
      <Container>
        {/* <Img src="my-logo.png" alt="My SaaS" style={logo} /> */}
        <Text>Hi {username}!</Text>
        <Text>Welcome to Market Hub where you can buy whatever you want!</Text>
        <Text>Please verify your email, with the link below:</Text>
        <Section>
          {/* Button that takes the user to the verification link */}
          <Button href={`${baseUrl}/auth/verify-email?token=${emailVerificationToken}`}>
            Click here to verify
          </Button>
        </Section>
        <Hr />
        <Text>Thank you for choosing Market Hub.</Text>
        <Text>Yours truly, </Text>
        <Text>Support Team at {"Market Hub"}.</Text>
      </Container>
    </Body>
  </Html>
);
