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

const WelcomeTemplate = ({ name, baseUrl }: { name: string; baseUrl: string }) => {
  return (
    <Html>
      <Preview>Welcome aboard!</Preview>
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
              Hello <strong>{name}</strong>,<br />
              We&lsquo;re excited to have you on board. Let&lsquo;s{" "}
              <Link href={baseUrl} className="text-blue-600 no-underline">
                Visit our website
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeTemplate;
