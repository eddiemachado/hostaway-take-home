import type { FC } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cx } from "@/utils/cx";

export type IconButtonVariant = "secondary" | "tertiary";
export type IconButtonSize = "sm" | "md";

export interface IconButtonProps extends Omit<AriaButtonProps, "children" | "className" | "aria-label"> {
    /** Required — icon-only buttons must have an accessible name. */
    "aria-label": string;
    icon: FC<{ className?: string }>;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    className?: string;
}

const base =
    "inline-flex items-center justify-center rounded-lg outline-none transition duration-100 ease-linear cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<IconButtonVariant, string> = {
    secondary: "bg-primary text-fg-quaternary border border-primary shadow-xs hover:bg-primary_hover hover:text-fg-quaternary_hover",
    tertiary: "text-fg-quaternary hover:bg-primary_hover hover:text-fg-quaternary_hover",
};

const sizes: Record<IconButtonSize, string> = {
    sm: "size-9",
    md: "size-10",
};

/** Square, icon-only button. `aria-label` is required for accessibility. */
export const IconButton = ({ icon: Icon, variant = "secondary", size = "md", className, ...props }: IconButtonProps) => (
    <AriaButton {...props} className={cx(base, variants[variant], sizes[size], className)}>
        <Icon className="size-5" />
    </AriaButton>
);
