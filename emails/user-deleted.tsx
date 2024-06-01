import {
  Body,
  Container,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  name: string;
  reason: string;
  uponRequest: boolean;
  baseUrl: string;
}

const UserDeletedTemplate = ({ name, reason, uponRequest, baseUrl }: Props) => {
  return (
    <Html>
      <Preview>Your account has been deleted.</Preview>
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
              Dear <strong>{name}</strong>,<br />
              {uponRequest
                ? "We're sorry to see you go. Your account has been deleted upon your request. "
                : `We regret to inform you that your account has been deleted due to "${reason}". `}
              If you have any questions, please contact our support team.
            </Text>
            <Text style={text}>
              Best regards,
              <br />
              Support Team at <strong>{"Market Hub"}</strong>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

UserDeletedTemplate.PreviewProps = {
  name: "Alan",
  reason: "Spamming",
  baseUrl: "http://localhost:3001",
} as Props;

export default UserDeletedTemplate;

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};
