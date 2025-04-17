import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const publicURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatMonth = (dateString: Date) => {
  return dateString.toLocaleDateString('en-US', {
    month: 'short'
  })
}
