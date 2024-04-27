import NavBar from "@/components/nav-bar/NavBar";
import { Providers } from "@/components/root-layout/Providers";
import { inter, satisfy } from "@/lib/fonts";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

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
            <main className="font-inter">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
