import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { BADGE_CRITERIA } from "@/constants";
import { techMap } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This file containes helper to manage different class names based on condition without using template strings ``.
// The regex /[\s.]/g matches any whitespace character (\s) or a literal dot (.)
export function getDevIconClassName(techName: string) {
  const normalizedTechName = techName.replace(/[\s.]/g, "").toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain colored";
}

export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Mapping technology names to descriptions
  const techDescriptionMap: { [key: string]: string } = {
    javascript:
      "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
    typescript:
      "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
    react:
      "React is a popular library for building fast, component-based user interfaces and web applications.",
    nextjs:
      "Next.js is a React framework for building fast, SEO-friendly, and production-grade web applications.",
    nodejs:
      "Node.js is a runtime for building fast and scalable server-side applications using JavaScript.",
    python:
      "Python is a beginner-friendly language known for its versatility and simplicity in various fields.",
    java: "Java is a versatile, cross-platform language widely used in enterprise and Android development.",
    "c++":
      "C++ is a high-performance language ideal for system programming, games, and large-scale applications.",
    git: "Git is a version control system that helps developers track changes and collaborate on code efficiently.",
    docker:
      "Docker simplifies app deployment by containerizing environments, ensuring consistency across platforms.",
    mongodb:
      "MongoDB is a flexible NoSQL database ideal for handling unstructured data and scalable applications.",
    mysql:
      "MySQL is a popular open-source relational database management system known for its stability and performance.",
    postgresql:
      "PostgreSQL is a powerful open-source SQL database known for its scalability and robustness.",
    aws: "Amazon Web Services (AWS) is a cloud computing platform that offers a wide range of services for building, deploying, and managing web and mobile applications.",
  };

  return (
    techDescriptionMap[normalizedTech] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
}

export function getTimeStamp(createdAt: Date) {
  const date = new Date(createdAt);
  const now = new Date();

  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
}

export function getFormattedNumber(upvotes: number) {
  if (upvotes >= 1000000) {
    return `${(upvotes / 1000000).toFixed(1)}M`;
  } else if (upvotes >= 1000) {
    return `${(upvotes / 1000).toFixed(1)}k`;
  } else {
    return upvotes.toString();
  }
}

export function assignBadges(params: {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}) {
  const { criteria } = params;

  const badgeCounts: Badges = {
    BRONZE: 0,
    SILVER: 0,
    GOLD: 0,
  };

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level) => {
      if (count >= badgeLevels[level as keyof typeof badgeLevels]) {
        badgeCounts[level as keyof Badges] += 1;
      }
    });
  });

  return badgeCounts;
}

export function processJobTitle(title: string | undefined | null): string {
  if (title === undefined || title === null) return "No Job Title";

  const words = title.split(" ");

  const validWords = words.filter(
    (word) =>
      word !== undefined &&
      word !== null &&
      word.toLowerCase() !== "undefined" &&
      word.toLowerCase() !== "null",
  );

  if (validWords.length === 0) return "No Job Title";

  return validWords.join(" ");
}

// assignBadges() expects one argument: an object with a single property called criteria array

export function fixMDXContent(content: string): string {
  return (
    content // Fix angle bracket URLs that MDX tries to parse as JSX components
      // Converts: <https://example.com> → [https://example.com](https://example.com)
      // This prevents "Unexpected character `/` before local name" errors
      .replace(/<(https?:\/\/[^>]+)>/g, "[$1]($1)") // Clean up double-escaped forward slashes that can occur during content processing
      // Converts: \/path\/to\/file → /path/to/file
      // This ensures file paths and URLs display correctly

      .replace(/\\\//g, "/")
  );
}
