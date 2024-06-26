import NavBar from "@/components/nav-bar/NavBar";
import { Providers } from "@/components/root-layout/Providers";
import ToastContainer from "@/components/root-layout/ToastContainer";
import { inter, satisfy, fira_code, akaya_kanadaka, dosis } from "@/lib/fonts";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "./Footer";

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
      className={`${inter.variable} ${satisfy.variable} ${fira_code.variable} ${akaya_kanadaka.variable} ${dosis.variable} font-inter`}
    >
      <body className="min-h-screen font-inter">
        <Providers>
          <main className="min-h-screen bg-white font-inter dark:bg-black">
            <NavBar height="70px" />
            <section className="min-h-[calc(100vh_-_70px)]">{children}</section>
            <Footer />
            <ToastContainer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
