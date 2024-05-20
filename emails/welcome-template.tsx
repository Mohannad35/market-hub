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
  baseUrl: string;
}

const WelcomeTemplate = ({ name, baseUrl }: Props) => {
  return (
    <Html>
      <Preview>Welcome aboard!</Preview>
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
              Hello <strong>{name}</strong>,<br />
              We&lsquo;re excited to have you on board. Let&lsquo;s{" "}
              <Link href={baseUrl} className="text-blue-600 no-underline">
                Visit our website
              </Link>
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

WelcomeTemplate.PreviewProps = {
  name: "Alan",
  baseUrl: "http://localhost:3001",
} as Props;

export default WelcomeTemplate;

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};
