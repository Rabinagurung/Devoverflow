import { techMap } from "@/constants/techMap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This file containes helper to manage different class names based on condition without using template strings ``.

export function getDevIconClassName(techName: string) {
  const normalizedTechName = techName.replace(/[\s.]/g, "").toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain colored";
}
