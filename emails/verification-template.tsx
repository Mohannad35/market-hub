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
interface Props {
  username: string;
  emailVerificationToken: string;
  baseUrl: string;
}

// Define the VerificationTemplate component that takes the defined properties
const VerificationTemplate = ({ username, emailVerificationToken, baseUrl }: Props) => (
  <Html>
    <Head />
    <Preview>Verification Email for {"Market Hub"}.</Preview>
    <Tailwind>
      <Body className="bg-[#f6f9fc] p-4">
        <Container className="rounded border border-solid border-[#f0f0f0] bg-white p-10">
          {/* Logo */}
          <Section className="mb-[2rem]">
            <Img
              src={`${baseUrl}/logo-transparent.png`}
              width="100"
              height="100"
              alt="Logo"
              className="mx-auto my-0"
            />
          </Section>
          <Text style={text}>
            Hi <strong>{username}</strong>,<br />
            Welcome to Market Hub where you can buy whatever you want!
            <br />
            Please verify your email, with the link below:
          </Text>
          <Section className="text-center">
            {/* Button that takes the user to the verification link */}
            <Button
              className="rounded bg-slate-900 px-5 py-3 text-center font-sans text-[15px] text-white no-underline"
              href={`${baseUrl}/auth/verify-email?token=${emailVerificationToken}`}
            >
              Verify Email
            </Button>
          </Section>
          <Text style={text}>
            Thank you for choosing <strong>{"Market Hub"}</strong>.<br /> Yours truly,
            <br /> Support Team at <strong>{"Market Hub"}</strong>.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

VerificationTemplate.PreviewProps = {
  username: "Alan",
  baseUrl: "http://localhost:3001",
  emailVerificationToken: "123456",
} as Props;

export default VerificationTemplate;

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};
