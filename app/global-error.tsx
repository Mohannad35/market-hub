"use client";

import { Button, Link } from "@nextui-org/react";
import { Heading, Text } from "@radix-ui/themes";
import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";
import NextLink from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <Heading>Something went wrong!</Heading>
        <Text size="4" mt="4">
          An unexpected error occurred. Please try again or contact support if the issue persists.
        </Text>
        <Button color="primary" onClick={() => reset()}>
          Try again
        </Button>
        <Text>
          If the error persists, please contact us at{" "}
          <Link as={NextLink} href="/contact">
            {"Market Hub"} Help Center
          </Link>
          with the following error code: {error.digest}
        </Text>
      </body>
    </html>
  );
}
