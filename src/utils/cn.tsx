import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind classes conditionally
 * Example:
 *   cn("p-2", condition && "bg-red-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
