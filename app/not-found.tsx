"use client";

import { Button } from "@nextui-org/react";
import { Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import NextLink from "next/link";
import { ParticlesContainer } from "./ParticlesContainer";

export default function NotFound() {
  return (
    <Flex
      width="100%"
      justify="center"
      height="100%"
      className="relative min-h-[calc(100vh-70px)] font-dosis"
    >
      <ParticlesContainer />
      <Flex
        direction="column"
        width="384px"
        align="center"
        position="relative"
        className="text-center"
        pt="20px"
      >
        <Text className="text-8xl" weight="bold">
          404
        </Text>
        <Text className="max-w-[330px] text-lg">
          LOST IN <Text className="line-through decoration-amber-400">SPACE</Text> {"Market Hub"}?
          Hmm, looks like that page doesn&apos;t exist.
        </Text>
        <Image
          src="/astronaut.svg"
          alt="astronaut"
          width={43}
          height={43}
          className="absolute right-[30px] top-[240px] animate-spin-slow"
        />
        <Image src="/planet.svg" alt="planet" width={400} height={400} />
        <Button
          fullWidth={false}
          variant="bordered"
          color="primary"
          as={NextLink}
          href="/"
          size="lg"
        >
          Go Home
        </Button>
      </Flex>
    </Flex>
  );
}
