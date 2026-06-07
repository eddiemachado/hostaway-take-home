import { cx } from "@/utils/cx";

export interface DividerProps {
    orientation?: "horizontal" | "vertical";
    className?: string;
}

/** Thin separator using the secondary border token. */
export const Divider = ({ orientation = "horizontal", className }: DividerProps) => (
    <div
        role="separator"
        aria-orientation={orientation}
        className={cx(orientation === "horizontal" ? "h-px w-full" : "h-full w-px", "bg-border-secondary", className)}
    />
);
