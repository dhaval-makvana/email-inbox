import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function formatShortDate(date: string) {
  return dayjs(date).format("MMM D"); // e.g., "Feb 15"
}

// Merges Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
