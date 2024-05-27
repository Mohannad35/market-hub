import NavBar from "@/components/nav-bar/NavBar";
import { Providers } from "@/components/root-layout/Providers";
import ToastContainer from "@/components/root-layout/ToastContainer";
import { inter, satisfy, fira_code, akaya_kanadaka, dosis } from "@/lib/fonts";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketHub",
  description:
    "MarketHub is a multi vendor website where you can find any thing you wish for a good price.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${satisfy.variable} ${fira_code.variable} ${akaya_kanadaka.variable} ${dosis.variable}`}
    >
      <body className="min-h-screen">
        <Providers>
          <NavBar height="70px" />
          <main className="font-inter">{children}</main>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
