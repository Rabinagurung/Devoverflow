"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React from "react";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { signInAsGuest } from "@/lib/actions/auth.action";
import logger from "@/lib/logger";

import { Button } from "../ui/button";

const SocialAuthForm = () => {
  const router = useRouter();
  const buttonClass =
    "background-light900_dark400 text-dark200_light800 min-h-12 rounded-2 flex-1 py-4 px-3.5 ";

  const handleSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, {
        redirectTo: ROUTES.HOME,
        // redirect: false,
      });
    } catch (error) {
      logger.error(error);

      toast({
        title: "Sign-in Failed",
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "An error occured during sign-in",
      });
    }
  };

  const handleGuestSignIn = async () => {
    const result = await signInAsGuest();

    if (result?.success) {
      router.push(ROUTES.HOME);
    } else {
      toast({
        title: "Sign-in Failed",
        variant: "destructive",
        description: result?.error?.message ?? "Could not start guest session",
      });
    }
  };

  return (
    <div className="mt-9 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="Github logo"
          height={20}
          width={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Login with Github</span>
      </Button>

      <Button className={buttonClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          height={20}
          width={20}
          className="mr-2.5 object-contain"
        />
        <span>Login with Google</span>
      </Button>

      <Button className={buttonClass} onClick={handleGuestSignIn}>
        <span>Continue as Guest</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
