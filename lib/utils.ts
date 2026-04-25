import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely using clsx and tailwind-merge.
 * This prevents style conflicts (e.g., 'px-2 px-4' becomes 'px-4').
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}