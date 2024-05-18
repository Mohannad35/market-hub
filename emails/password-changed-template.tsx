// Import React and necessary components from @react-email/components
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from "@react-email/components";

// Define the properties expected by the PasswordChangedTemplate component
interface PasswordChangedTemplateProps {
  username: string;
  baseUrl: string;
}

// Define the PasswordChangedTemplate component that takes the defined properties
const PasswordChangedTemplate = ({ username, baseUrl }: PasswordChangedTemplateProps) => (
  <Html>
    <Head />
    <Preview>{"Market Hub"} Password Changed.</Preview>
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
            I hope this email finds you well.
            <br />
            We are writing to inform you that your password has been successfully changed.
            <br />
          </Text>
          <Text className="text-[14px] leading-[24px] text-black">
            Thank you for choosing <strong>{"Market Hub"}</strong>.<br /> Yours truly,
            <br /> Support Team at <strong>{"Market Hub"}</strong>.
          </Text>

          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Text className="text-[12px] leading-[24px] text-[#666666]">
            If you did not make this change, please reset your password immediately.
            <br />
            <Link href={`${baseUrl}/reset-password`} className="text-blue-600 no-underline">
              Reset Password
            </Link>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default PasswordChangedTemplate;
