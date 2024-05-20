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

interface Props {
  userFirstname?: string;
  resetPasswordLink?: string;
  origin?: string;
}

const baseUrl = process.env.BASE_URL;

const ResetPasswordTemplate = ({ userFirstname, resetPasswordLink, origin }: Props) => {
  const url = origin || baseUrl || "";
  return (
    <Html>
      <Head />
      <Preview>{"Market Hub"} password reset</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] p-4">
          <Container className="border border-solid border-[#f0f0f0] bg-white p-10">
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
            <Section className="bg-slate-900 p-[1rem]">
              <Img
                src={`${url}/reset-password.png`}
                width="60"
                height="60"
                alt="Forgot Password image"
                className="mx-auto my-0"
              />
              <Text style={text} className="mb-0 text-center text-white">
                Please reset your password
              </Text>
            </Section>

            <Section>
              <Text style={text}>Hi {userFirstname},</Text>
              <Text style={text}>
                Someone recently requested a password change for your {"Market Hub"} account. If
                this was you, you can set a new password here:
              </Text>
              <Section className="text-center">
                <Button
                  className="rounded bg-slate-900 px-5 py-3 text-center font-sans text-[15px] text-white no-underline"
                  href={resetPasswordLink}
                >
                  Reset password
                </Button>
              </Section>
              <Text style={text}>
                If you don&apos;t want to change your password or didn&apos;t request this, just
                ignore and delete this message.
              </Text>
              <Text style={text}>
                To keep your account secure, please don&apos;t forward this email to anyone.
              </Text>
              <Text style={text}>
                Best regards,
                <br />
                Support Team at <strong>{"Market Hub"}</strong>.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordTemplate.PreviewProps = {
  userFirstname: "Alan",
  resetPasswordLink: "http://localhost:3001//reset-password?token=1234567890",
  origin: "http://localhost:3001",
} as Props;

export default ResetPasswordTemplate;

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
