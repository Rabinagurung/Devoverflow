import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      isGuest?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isGuest?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    isGuest?: boolean;
    guestExpiresAt?: number;
  }
}
