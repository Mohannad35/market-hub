// Import React and necessary components from @react-email/components
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

// Define the properties expected by the VerificationTemplate component
interface VerificationTemplateProps {
  username: string;
  emailVerificationToken: string;
  baseUrl: string;
}

// Define the VerificationTemplate component that takes the defined properties
const VerificationTemplate = ({
  username,
  emailVerificationToken,
  baseUrl,
}: VerificationTemplateProps) => (
  <Html>
    <Head />
    <Preview>Verification Email for {"Market Hub"}.</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white px-2 font-sans">
        <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          {/* Logo */}
          <Section className="mt-[32px]">
            <Img
              src={`${baseUrl}/logo-transparent.png`}
              width="100"
              height="100"
              alt="Logo"
              className="mx-auto my-0"
            />
          </Section>
          <Text className="text-[14px] leading-[24px] text-black">
            Hi <strong>{username}</strong>,<br />
            Welcome to Market Hub where you can buy whatever you want!
            <br />
            Please verify your email, with the link below:
          </Text>
          <Section className="mb-[32px] mt-[32px] text-center">
            {/* Button that takes the user to the verification link */}
            <Button
              className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
              href={`${baseUrl}/auth/verify-email?token=${emailVerificationToken}`}
            >
              Verify Email
            </Button>
          </Section>
          <Text className="text-[14px] leading-[24px] text-black">
            Thank you for choosing <strong>{"Market Hub"}</strong>.<br /> Yours truly,
            <br /> Support Team at <strong>{"Market Hub"}</strong>.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default VerificationTemplate;
