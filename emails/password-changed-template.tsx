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
  Text,
} from "@react-email/components";

// Define the properties expected by the PasswordChangedTemplate component
interface Props {
  username: string;
  baseUrl: string;
}
// const regular = "text-justify text-base font-sans text-black";
// const muted = "text-justify text-base text-[#666666]";
// const mutedSm = "text-justify text-[12px] leading-[22px] text-[#666666]";
// Define the PasswordChangedTemplate component that takes the defined properties
const PasswordChangedTemplate = ({ username, baseUrl }: Props) => (
  <Html>
    <Head />
    <Preview>Password Change Confirmation</Preview>
    <Tailwind>
      <Body className="bg-[#f6f9fc] p-4">
        <Container className="rounded border border-solid border-[#f0f0f0] bg-white p-10">
          {/* Logo */}
          {/* <Section>
              <Img
                src={`${url}/logo-transparent.png`}
                width="60"
                height="60"
                alt="Logo"
                className="mx-auto my-0"
              />
            </Section> */}
          <Section>
            <Img
              src={`${baseUrl}/forgot-password.gif`}
              width="100"
              height="100"
              alt="Password Changed gif"
              className="mx-auto my-0"
            />
            <Text style={text} className="!m-0 text-center !text-[20px] leading-[30px]">
              Your Password has been Changed
              <Text
                style={text}
                className="!m-0 text-center !text-[12px] leading-[22px] text-[#666666]"
              >
                Please login to your email account again
              </Text>
            </Text>
          </Section>
          <Section className="bg-slate-100 p-4">
            <Text style={text} className="mt-0">
              Dear {username},<br />I hope this email finds you well.
            </Text>
            <Text style={text}>
              We are writing to inform you that your password has been successfully changed. Your
              account is now secured with the new password that you have set.
            </Text>
            <Text style={text}>
              If you did not change your password, please contact us immediately to report any
              unauthorized access to your account or{" "}
              <Link
                style={text}
                href={`${baseUrl}/auth/forgot-password`}
                className="text-blue-600 no-underline"
              >
                reset your password
              </Link>
              .
            </Text>
            <Text style={text}>
              If you have any issues or concerns regarding your account, please do not hesitate to
              contact our customer support team for further assistance.
            </Text>
            <Text style={text} className="mb-0">
              Thank you for choosing <strong>{"Market Hub"}</strong>.<br /> Best regards,
              <br /> Support Team at <strong>{"Market Hub"}</strong>.
            </Text>
          </Section>

          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

PasswordChangedTemplate.PreviewProps = {
  username: "Alan",
  baseUrl: "http://localhost:3001",
} as Props;

export default PasswordChangedTemplate;

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};
