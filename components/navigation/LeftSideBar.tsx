import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

import NavLinks from "./navbar/NavLinks";

const LeftSideBar = async () => {
  const session = null; // await auth();

  return (
    <section
      className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between gap-6 
    overflow-y-auto border-r p-6 pt-36 shadow-light-200 
    dark:shadow-none dark:backdrop-blur-[150px] max-sm:hidden lg:w-[266px] "
    >
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks isMobileNav={false} />
      </div>
      <div className="flex flex-col gap-3">
        {session?.user ? (
          <form
            action={async () => {
              "use server";

              await signOut({ redirectTo: "/" });
            }}
          >
            <Button className="light-border-2 body-semibold text-dark400_light900 btn-tertiary min-h-[42px] w-full rounded-lg border px-4 py-3 shadow-none">
              <Image
                src="/icons/sign-up.svg"
                height={20}
                width={20}
                alt="Account image"
                className="invert-colors max-md:hidden"
              />
              <span className="max-lg:hidden">Log Out</span>
            </Button>
          </form>
        ) : (
          <>
            <Button
              className="body-semibold btn-secondary min-h-[42px] w-full rounded-lg px-4 py-3 shadow-none"
              asChild
            >
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  height={20}
                  width={20}
                  alt="Account image"
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Login
                </span>
              </Link>
            </Button>

            <Button
              className="light-border-2 body-semibold text-dark400_light900 btn-tertiary min-h-[42px] w-full rounded-lg 
            border px-4 py-3 shadow-none"
              asChild
            >
              <Link href={ROUTES.SIGN_UP}>
                <span className="max-lg:hidden">Sign Up</span>
                <Image
                  src="/icons/sign-up.svg"
                  height={20}
                  width={20}
                  alt="Account image"
                  className="invert-colors lg:hidden"
                />
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default LeftSideBar;
