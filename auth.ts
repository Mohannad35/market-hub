import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { IconType } from "react-icons";
import { FaGithub, FaGoogle } from "react-icons/fa";
import prisma from "./prisma/client";
import slugify from "slugify";
import { nanoid } from "nanoid";

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
  // debug: process.env.NODE_ENV === "development",
  events: {
    async createUser({ user }) {
      if (!user.email) return;
      // Create a slug for the user
      let slug = slugify(user.name ?? "", { lower: true, strict: true, trim: true });
      while (await prisma.user.findFirst({ where: { slug } })) slug = `${slug}-${nanoid(6)}`;
      await prisma.user.update({ where: { email: user.email }, data: { slug } });
    },
  },
});
