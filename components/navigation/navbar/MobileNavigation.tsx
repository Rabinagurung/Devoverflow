import { Button } from "@/components/ui/button";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavLinks from "./NavLinks";

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={"/icons/hamburger.svg"}
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-none background-light900_dark200"
      >
        <SheetTitle className="hidden">Navigation</SheetTitle>

        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/images/site-logo.svg"
            alt="logo"
            width={23}
            height={23}
          />
          <p className="font-space-grotesk paragraph-medium text-dark100_light900">
            Dev
            <span className="text-primary-500">Overflow</span>
          </p>
        </Link>

        <div className="flex flex-col no-scrollbar h-[calc(100vh-80px)] justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex flex-col h-full gap-6 pt-16">
              <NavLinks isMobileNav />
            </section>
          </SheetClose>

          <div className="flex flex-col gap-3">
            <SheetClose asChild>
              <Link href={ROUTES.SIGN_IN}>
                <Button className="w-full px-4 py-3 rounded-lg shadow-none body-semibold min-h-[42px] btn-secondary">
                  <span className="primary-text-gradient">Login</span>
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href={ROUTES.SIGN_UP}>
                <Button className="w-full min-h-[42px] px-4 py-3 border light-border-2 body-semibold rounded-lg shadow-none text-dark400_light900 btn-tertiary">
                  SignUp
                </Button>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
