import { PrismaAdapter } from "@auth/prisma-adapter";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { pick } from "lodash";
import { nanoid } from "nanoid";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { IconType } from "react-icons";
import { FaGithub, FaGoogle } from "react-icons/fa";
import slugify from "slugify";
import { idSchema } from "./lib/validation/common-schema";
import prisma from "./prisma/client";

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
      username: { label: "Username" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, request) {
      const username = credentials.username as string;
      const password = credentials.password as string;
      if (!username || !password) return null;
      // logic to verify if user exists
      const user = username.includes("@")
        ? await prisma.user.findUnique({ where: { email: username } })
        : await prisma.user.findUnique({ where: { username: username } });
      if (!user || !user.password) return null;
      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) return null;
      return {
        ...pick(user, ["id", "name", "email", "role", "username"]),
        image: user.image?.secure_url || user.avatar || undefined,
      };
    },
  }),
  Google({
    clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
    clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET,
    async profile(profile, tokens) {
      // Create a username for the user
      let username = slugify(profile.name, { lower: true, strict: true, replacement: "_" });
      while (await prisma.user.findUnique({ where: { username } }))
        username = `${username}_${nanoid(6)}`;
      return {
        id: profile.sub,
        name: profile.name,
        username: profile.email,
        email: profile.email,
        avatar: profile.picture,
        role: profile.role ?? "user",
      };
    },
  }),
  Github({
    clientId: process.env.NEXT_PUBLIC_AUTH_GITHUB_ID,
    clientSecret: process.env.NEXT_PUBLIC_AUTH_GITHUB_SECRET,
    async profile(profile, tokens) {
      // Create a username for the user
      let username = slugify(profile.name!, { lower: true, strict: true, replacement: "_" });
      while (await prisma.user.findUnique({ where: { username } }))
        username = `${username}_${nanoid(6)}`;
      return {
        id: profile.node_id,
        name: profile.name,
        username: profile.email,
        email: profile.email,
        avatar: profile.avatar_url,
        role: profile.role ?? "user",
      };
    },
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
  callbacks: {
    async jwt({ token, user, trigger, session, account, profile }) {
      if (trigger === "update") {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        const { success, data } = idSchema("User Id").safeParse(session.id);
        const dbUser = await prisma.user.findUnique({ where: { id: success ? data : token.sub } });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image?.secure_url || dbUser.avatar;
        }
      }
      if (user) {
        // User is available during sign-in
        const { id, name, email, role, username, image, avatar } = user as User;
        token.id = id;
        token.name = name;
        token.email = email;
        token.role = role;
        token.username = username;
        token.picture = image?.secure_url || avatar;
      }
      return token;
    },
  },
});
