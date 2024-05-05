import { NextUIProvider } from "@nextui-org/system";
import { Theme } from "@radix-ui/themes";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import ReactQueryClientProvider from "./QueryClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ReactQueryClientProvider>
        <NextUIProvider>
          <SessionProvider>
            <Theme>{children}</Theme>
          </SessionProvider>
        </NextUIProvider>
      </ReactQueryClientProvider>
    </ThemeProvider>
  );
}
