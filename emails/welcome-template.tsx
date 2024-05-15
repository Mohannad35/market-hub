import React from "react";
import { Html, Body, Container, Text, Link, Preview, Tailwind } from "@react-email/components";

const WelcomeTemplate = ({ name }: { name: string }) => {
  return (
    <Html>
      <Preview>Welcome aboard!</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Text className="font-sans text-3xl font-bold">Hello {name}!</Text>
            <Text>
              We&lsquo;re excited to have you on board. Let&lsquo;s
              <Link href="https://google.com"> Visit our website </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeTemplate;
