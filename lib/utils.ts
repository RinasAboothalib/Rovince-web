import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn-standard class merge helper (used by React Bits Pro components) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
