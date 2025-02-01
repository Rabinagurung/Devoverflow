import React from "react";
import NavLinks from "./navbar/NavLinks";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";

const LeftSideBar = async () => {
  const session = await auth();

  return (
    <section
      className="custom-scrollbar flex flex-col sticky left-0 top-0 justify-between h-screen gap-6 pt-36 p-6 
    overflow-y-auto background-light900_dark200 border-r light-border lg:w-[266px] 
    shadow-light-200 dark:shadow-none dark:backdrop-blur-[150px] max-sm:hidden "
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
            <Button className="w-full min-h-[42px] px-4 py-3 border light-border-2 body-semibold rounded-lg shadow-none text-dark400_light900 btn-tertiary">
              <Image
                src="/icons/sign-up.svg"
                height={20}
                width={20}
                alt="Account image"
                className="max-md:hidden invert-colors"
              />
              <span className="max-lg:hidden">Log Out</span>
            </Button>
          </form>
        ) : (
          <>
            <Button
              className="w-full px-4 py-3 rounded-lg shadow-none body-semibold min-h-[42px] btn-secondary"
              asChild
            >
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  height={20}
                  width={20}
                  alt="Account image"
                  className="lg:hidden invert-colors"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Login
                </span>
              </Link>
            </Button>

            <Button
              className="w-full min-h-[42px] px-4 py-3 border light-border-2 body-semibold 
            rounded-lg shadow-none text-dark400_light900 btn-tertiary"
              asChild
            >
              <Link href={ROUTES.SIGN_UP}>
                <span className="max-lg:hidden">Sign Up</span>
                <Image
                  src="/icons/sign-up.svg"
                  height={20}
                  width={20}
                  alt="Account image"
                  className="lg:hidden invert-colors"
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
