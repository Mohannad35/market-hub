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

// Define the properties expected by the EmailVerifiedTemplate component
interface Props {
  username: string;
  baseUrl: string;
}

// Define the EmailVerifiedTemplate component that takes the defined properties
const EmailVerifiedTemplate = ({ username, baseUrl }: Props) => (
  <Html>
    <Head />
    <Preview>{"Market Hub"} email verified.</Preview>
    <Tailwind>
      <Body className="bg-[#f6f9fc] p-4">
        <Container className="rounded bg-[#f0f0f0] p-10">
          {/* Logo */}
          <Section className="mb-[1rem]">
            <Img
              src={`${baseUrl}/logo-transparent.png`}
              width="60"
              height="60"
              alt="Logo"
              className="mx-auto my-0"
            />
          </Section>

          <Section className="bg-[#f6f9fc] p-10">
            <Text style={text} className="mt-0 text-center text-lg font-semibold">
              Account Activated
            </Text>
            <Img
              src={`${baseUrl}/verify-email.png`}
              width="100"
              height="100"
              alt="Email verified image"
              className="mx-auto my-0"
            />
            <Text style={text}>
              Hello <strong>{username}</strong>,<br />
              Your email has been verified. Welcome to <strong>{"Market Hub"}</strong>!<br />
              Your account is now active and you can start using our services.
              <br />
              Please use link below to login to your account.
            </Text>
            <Section className="text-center">
              {/* Button that takes the user to login page */}
              <Button
                className="rounded bg-slate-900 px-5 py-3 text-center font-sans text-[15px] uppercase text-white no-underline"
                href={`${baseUrl}/auth`}
              >
                Login to your account
              </Button>
            </Section>
            <Text style={text}>
              Thank you for choosing <strong>{"Market Hub"}</strong>.<br /> Best regards,
              <br /> Support Team at <strong>{"Market Hub"}</strong>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

EmailVerifiedTemplate.PreviewProps = {
  username: "Alan",
  baseUrl: "http://localhost:3001",
} as Props;

export default EmailVerifiedTemplate;

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};
