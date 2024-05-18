import { NextUIProvider } from "@nextui-org/system";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import ReactQueryClientProvider from "./QueryClientProvider";
import { auth } from "@/auth";

export async function Providers({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactQueryClientProvider>
        <NextUIProvider>
          <SessionProvider session={session}>
            <Theme>{children}</Theme>
          </SessionProvider>
        </NextUIProvider>
      </ReactQueryClientProvider>
    </ThemeProvider>
  );
}
