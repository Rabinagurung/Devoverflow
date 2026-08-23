import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { IAccountDoc } from "./database/account.model";
import { IUserDoc } from "./database/user.model";
import { api } from "./lib/handlers/api";
import { SignInSchema } from "./lib/validations";

// Guests get a short-lived, DB-less identity so recruiters can browse
// without leaving an account behind to clean up or revoke.
const GUEST_SESSION_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

// POST /api/auth/credntials { email, password}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        return {
          id: `guest-${crypto.randomUUID()}`,
          name: "Guest Recruiter",
          email: null,
          image: null,
          isGuest: true,
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const { data: existingAccount } = (await api.accounts.getByProvider(
          email,
          password,
        )) as ActionResponse<IAccountDoc>;

        if (!existingAccount) return null;

        const { data: existingUser } = (await api.users.getById(
          existingAccount.userId.toString(),
        )) as ActionResponse<IUserDoc>;

        if (!existingUser) return null;

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
      session.user.isGuest = token.isGuest;

      return session;
    },

    async jwt({ token, account, user }) {
      // Guest identities are never written to the DB: skip the account
      // lookup entirely and stamp a short, self-enforced expiry instead.
      if (account?.provider === "guest") {
        token.sub = user!.id;
        token.isGuest = true;
        token.guestExpiresAt = Date.now() + GUEST_SESSION_MAX_AGE_MS;

        return token;
      }

      if (
        token.isGuest &&
        token.guestExpiresAt &&
        Date.now() > token.guestExpiresAt
      ) {
        return null;
      }

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
        token.isGuest = false;
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
