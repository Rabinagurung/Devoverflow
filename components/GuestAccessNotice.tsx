import Link from "next/link";

import ROUTES from "@/constants/routes";

import { Button } from "./ui/button";

interface GuestAccessNoticeProps {
  message: string;
}

const GuestAccessNotice = ({ message }: GuestAccessNoticeProps) => {
  return (
    <div className="light-border background-light800_dark300 flex flex-col items-start gap-4 rounded-2 border p-6">
      <p className="paragraph-regular text-dark400_light700">{message}</p>
      <div className="flex gap-3">
        <Button
          className="primary-gradient paragraph-medium rounded-2 px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.SIGN_IN}>Sign In</Link>
        </Button>
        <Button
          className="light-border-2 body-semibold text-dark400_light900 btn-tertiary rounded-2 border px-4 py-3"
          asChild
        >
          <Link href={ROUTES.SIGN_UP}>Create Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default GuestAccessNotice;
