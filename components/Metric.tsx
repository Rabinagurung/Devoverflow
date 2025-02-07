import { getTimeStamp } from "@/lib/utils";
import { time } from "console";
import Image from "next/image";
import Link from "next/link";
import { title } from "process";
import React from "react";
import { date } from "zod";

interface MetricProps {
  imageUrl: string;
  alt: string;
  value: string | number;
  href?: string;
  title: string;
  textStyles: string;
  imageUrlStyles?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imageUrl,
  alt,
  value,
  href,
  title,
  textStyles,
  imageUrlStyles,
  isAuthor,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        width={16}
        height={16}
        alt={alt}
        src={imageUrl}
        className={`rounded-full object-contain ${imageUrlStyles}`}
      />
      <p className={`${textStyles} flex-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-between gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-between gap-1">{metricContent}</div>
  );
};

export default Metric;
