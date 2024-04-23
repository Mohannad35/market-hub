import { inter, satisfy } from "@/components/fonts";
import NavBar from "@/components/nav-bar/NavBar";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "MarketHub",
  description:
    "MarketHub is a multi vendor website where you can find any thing you wish for a good price.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${satisfy.variable}`}>
      <body className="min-h-svh">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <NavBar />
            <main className="container font-inter">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
