import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export type BadgeColor = "gray" | "brand" | "success" | "warning" | "error" | "blue" | "indigo" | "purple" | "pink" | "orange";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
    color?: BadgeColor;
    size?: BadgeSize;
    /** Show a leading status dot. */
    dot?: boolean;
    className?: string;
    children: ReactNode;
}

const colors: Record<BadgeColor, { bg: string; text: string; ring: string; dot: string }> = {
    gray: { bg: "bg-utility-neutral-50", text: "text-utility-neutral-700", ring: "ring-utility-neutral-200", dot: "bg-utility-neutral-500" },
    brand: { bg: "bg-utility-brand-50", text: "text-utility-brand-700", ring: "ring-utility-brand-200", dot: "bg-utility-brand-500" },
    success: { bg: "bg-utility-green-50", text: "text-utility-green-700", ring: "ring-utility-green-200", dot: "bg-utility-green-500" },
    warning: { bg: "bg-utility-yellow-50", text: "text-utility-yellow-700", ring: "ring-utility-yellow-200", dot: "bg-utility-yellow-500" },
    error: { bg: "bg-utility-red-50", text: "text-utility-red-700", ring: "ring-utility-red-200", dot: "bg-utility-red-500" },
    blue: { bg: "bg-utility-blue-50", text: "text-utility-blue-700", ring: "ring-utility-blue-200", dot: "bg-utility-blue-500" },
    indigo: { bg: "bg-utility-indigo-50", text: "text-utility-indigo-700", ring: "ring-utility-indigo-200", dot: "bg-utility-indigo-500" },
    purple: { bg: "bg-utility-purple-50", text: "text-utility-purple-700", ring: "ring-utility-purple-200", dot: "bg-utility-purple-500" },
    pink: { bg: "bg-utility-pink-50", text: "text-utility-pink-700", ring: "ring-utility-pink-200", dot: "bg-utility-pink-500" },
    orange: { bg: "bg-utility-orange-50", text: "text-utility-orange-700", ring: "ring-utility-orange-200", dot: "bg-utility-orange-500" },
};

const sizes: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
};

/** Compact status / category label. Use `dot` for live-status semantics. */
export const Badge = ({ color = "gray", size = "sm", dot = false, className, children }: BadgeProps) => {
    const c = colors[color];
    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
                c.bg,
                c.text,
                c.ring,
                sizes[size],
                className,
            )}
        >
            {dot && <span className={cx("size-1.5 rounded-full", c.dot)} aria-hidden="true" />}
            {children}
        </span>
    );
};
