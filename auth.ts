import prisma from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google, { GoogleProfile } from "next-auth/providers/google";
import { compare, hash } from "bcryptjs";
import { ReactNode } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { IconType } from "react-icons";

if (!process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID) {
  throw new Error("NEXT_PUBLIC_AUTH_GOOGLE_ID is not set");
}
if (!process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET) {
  throw new Error("NEXT_PUBLIC_AUTH_GOOGLE_SECRET is not set");
}

const providers: Provider[] = [
  Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials, req) => {
      const { email, password } = credentials;
      if (!email || !password) return null;
      // logic to verify if user exists
      const user = await prisma.user.findUnique({ where: { email: email as string } });
      if (!user || !user.password) return null;
      const passwordMatch = await compare(password as string, user.password);
      return passwordMatch ? user : null;
    },
  }),
  Google({
    clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
    clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET,
    profile: (profile: GoogleProfile) => {
      console.log(profile.email_verified);
      return {
        name: profile.name as string,
        email: profile.email as string,
        image: profile.picture as string,
        isVerified: profile.email_verified,
      };
    },
  }),
  Github({
    clientId: process.env.NEXT_PUBLIC_AUTH_GITHUB_ID,
    clientSecret: process.env.NEXT_PUBLIC_AUTH_GITHUB_SECRET,
  }),
];

export const providerMap = providers.map(provider => {
  const providerData = typeof provider === "function" ? provider() : provider;
  let icon: IconType | null = null;
  switch (providerData.id) {
    case "google":
      icon = FaGoogle;
      break;
    case "github":
      icon = FaGithub;
      break;
  }
  return { id: providerData.id, name: providerData.name, icon: icon };
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  pages: { signIn: "/auth", newUser: "/auth" },
  providers,
  session: { strategy: "jwt" },
});
