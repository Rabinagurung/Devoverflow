import Image from "next/image";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

interface MetricProps {
  imageUrl: string;
  alt: string;
  value: string | number;
  href?: string;
  title: string;
  textStyles: string;
  imageUrlStyles?: string;
  titleStyles?: string;
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
  titleStyles,
  isAuthor,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        width={16}
        height={16}
        alt={alt}
        src={imageUrl}
        className={`rounded-full object-contain  ${imageUrlStyles}`}
      />
      <p className={`${textStyles} flex-center gap-1`}>
        {value}

        {title ? (
          <span className={(cn(`small-regular line-clamp-1`), titleStyles)}>
            {title}
          </span>
        ) : null}
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
