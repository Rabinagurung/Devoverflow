"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { signInAsGuest } from "@/lib/actions/auth.action";

import { Button } from "../ui/button";

interface GuestSignInButtonProps {
  className?: string;
  children: ReactNode;
}

const GuestSignInButton = ({ className, children }: GuestSignInButtonProps) => {
  const router = useRouter();
  const { update } = useSession();

  const handleGuestSignIn = async () => {
    const result = await signInAsGuest();

    if (result?.success) {
      // The server action sets the session cookie directly, so the
      // client-side SessionProvider cache needs an explicit refresh -
      // otherwise already-mounted components (e.g. AnswerForm) keep
      // showing stale auth state until a full page reload.
      await update();
      router.push(ROUTES.HOME);
      router.refresh();
    } else {
      toast({
        title: "Sign-in Failed",
        variant: "destructive",
        description: result?.error?.message ?? "Could not start guest session",
      });
    }
  };

  return (
    <Button className={className} onClick={handleGuestSignIn}>
      {children}
    </Button>
  );
};

export default GuestSignInButton;
