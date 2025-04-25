import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";

interface DataRendererProps<T> {
  success: boolean;
  data: T[] | null | undefined;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };

  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };

  render: (data: T[]) => React.ReactNode;
}

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => {
  return (
    <div className="mt-16 flex w-full flex-col justify-center items-center  sm:mt-36 ">
      <>
        <Image
          src={image.light}
          height={200}
          width={270}
          alt={image.alt}
          className="block object-contain dark:hidden"
        />
        <Image
          src={image.dark}
          height={200}
          width={270}
          alt={image.alt}
          className="hidden object-contain dark:block"
        />
      </>
      <h2 className="h2-bold text-dark200_light900 mt-8 ">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {message}
      </p>
      {button && (
        <Link href={button.href}>
          <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500">
            {button.text}
          </Button>
        </Link>
      )}
    </div>
  );
};

const DataRenderer = <T,>({
  success,
  data,
  error,
  empty = DEFAULT_EMPTY,
  render,
}: DataRendererProps<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-error.png",
          dark: "/images/dark-error.png",
          alt: "Error state illustration",
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  return <div>{render(data)}</div>;
};

export default DataRenderer;
