import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { nanoid } from "nanoid";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import slugify from "slugify";
import { idSchema } from "./lib/validation/common-schema";
import prisma from "./prisma/client";
import { Role } from "@prisma/client";

if (!process.env.AUTH_GOOGLE_ID) {
  throw new Error("AUTH_GOOGLE_ID is not set");
}
if (!process.env.AUTH_GOOGLE_SECRET) {
  throw new Error("AUTH_GOOGLE_SECRET is not set");
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      username: string;
      role: Role;
    } & DefaultSession["user"];
  }
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    username: string;
    role: string;
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    username: string;
    role: string;
  }
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
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        image: user.image?.secure_url || user.avatar,
      };
    },
  }),
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    async profile(profile, tokens) {
      // Create a username for the user
      let username = slugify(profile.name, { lower: true, strict: true, replacement: "_" });
      while (await prisma.user.findUnique({ where: { username } }))
        username = `${username}_${nanoid(6)}`;
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        avatar: profile.picture,
        username,
        role: "user",
      };
    },
  }),
  Github({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
    async profile(profile, tokens) {
      // Create a username for the user
      let username = slugify(profile.name!, { lower: true, strict: true, replacement: "_" });
      while (await prisma.user.findUnique({ where: { username } }))
        username = `${username}_${nanoid(6)}`;
      return {
        id: profile.node_id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar_url,
        username,
        role: "user",
      };
    },
  }),
];

export const providerMap = providers.map(provider => {
  const providerData = typeof provider === "function" ? provider() : provider;
  let icon: string | null = null;
  switch (providerData.id) {
    case "google":
      icon = "logos:google-icon";
      break;
    case "github":
      icon = "skill-icons:github-dark";
      break;
  }
  return { id: providerData.id, name: providerData.name, icon: icon };
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma) as import("@auth/core/adapters").Adapter,
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
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.picture = dbUser.image?.secure_url || dbUser.avatar;
        }
      } else if (trigger === "signIn") {
        // User is available during sign-in
        const { id, name, email, role, username, image } = user;
        token.id = id!;
        token.name = name;
        token.email = email;
        token.role = role;
        token.username = username;
        token.picture = image;
      }
      if (user) {
        // User is available during sign-in
        const { id, name, email, role, username, image } = user;
        token.id = id!;
        token.name = name;
        token.email = email;
        token.role = role;
        token.username = username;
        token.picture = image;
      }
      // console.log("🚀 ~ file: auth.ts:147 ~ jwt ~ token:", token);
      return token;
    },
    async session({ session, token, user, newSession, trigger }) {
      // Add properties to the session, making them available in the front-end
      session.user.id = token.id as string;
      session.user.name = token.name;
      session.user.email = token.email!;
      session.user.role = token.role as Role;
      session.user.username = token.username;
      session.user.image = token.picture;
      return session;
    },
  },
});
