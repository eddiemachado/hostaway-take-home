import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * Later classes win over earlier ones (e.g. `cx("p-2", "p-4")` → `"p-4"`),
 * which lets consumers override component defaults predictably.
 */
export function cx(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
