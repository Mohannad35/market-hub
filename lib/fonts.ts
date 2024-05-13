import { Inter, Satisfy, Fira_Code } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const satisfy = Satisfy({
  subsets: ["latin"],
  variable: "--font-satisfy",
  display: "swap",
  weight: "400",
});

export const fira_code = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});
