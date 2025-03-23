import bycrpt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { IAccountDoc } from "./database/account.model";
import { IUserDoc } from "./database/user.model";
import { api } from "./lib/handlers/api";
import { SignInSchema } from "./lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const { data: existingAccount } = (await api.accounts.getByProvider(
          email,
        )) as ActionResponse<IAccountDoc>;

        if (!existingAccount) return null;

        const { data: existingUser } = (await api.users.getById(
          existingAccount.userId.toString(),
        )) as ActionResponse<IUserDoc>;

        if (!existingUser) return null;

        const isValidPassword = await bycrpt.compare(
          password,
          existingAccount.password!,
        );

        if (!isValidPassword) return null;

        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;

      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        const { success, data: existingAccount } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId,
          )) as ActionResponse<IAccountDoc>;

        if (!success || !existingAccount) return null;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },

    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "google"
            ? (user.name?.toLowerCase() as string)
            : (profile?.login as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "google" | "github",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;
      return true;
    },
  },
});

// auth: provided information about current session.
// It is imported in middleware.ts file.
