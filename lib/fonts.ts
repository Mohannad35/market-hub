import { Inter, Satisfy, Fira_Code, Akaya_Kanadaka } from "next/font/google";

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

export const akaya_kanadaka = Akaya_Kanadaka({
  subsets: ["latin"],
  variable: "--font-akaya-kanadaka",
  display: "swap",
  weight: "400",
});
