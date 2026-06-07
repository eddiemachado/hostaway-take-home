import type { FC, ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cx } from "@/utils/cx";
import { Spinner } from "@/atoms/Spinner";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

type IconComponent = FC<{ className?: string }>;

export interface ButtonProps extends Omit<AriaButtonProps, "children" | "className"> {
    /** Visual style. @default "primary" */
    variant?: ButtonVariant;
    /** @default "md" */
    size?: ButtonSize;
    /** Icon component rendered before the label. */
    iconLeading?: IconComponent;
    /** Icon component rendered after the label. */
    iconTrailing?: IconComponent;
    /** Show a spinner and block interaction. */
    isLoading?: boolean;
    className?: string;
    children?: ReactNode;
}

const base =
    "relative inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold whitespace-nowrap outline-none transition duration-100 ease-linear cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
    primary: "bg-brand-solid text-white shadow-xs hover:bg-brand-solid_hover",
    secondary: "bg-primary text-secondary border border-primary shadow-xs hover:bg-primary_hover",
    tertiary: "text-tertiary hover:bg-primary_hover hover:text-tertiary_hover",
    destructive: "bg-error-solid text-white shadow-xs hover:bg-error-solid_hover",
};

const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-3.5 text-sm",
    lg: "h-11 px-4 text-md",
};

export const Button = ({
    variant = "primary",
    size = "md",
    iconLeading: IconLeading,
    iconTrailing: IconTrailing,
    isLoading = false,
    isDisabled,
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <AriaButton
            {...props}
            isDisabled={isDisabled || isLoading}
            className={cx(base, variants[variant], sizes[size], className)}
        >
            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Spinner className="size-5" />
                </span>
            )}
            <span className={cx("contents", isLoading && "invisible")}>
                {IconLeading && <IconLeading className="size-5 shrink-0" />}
                {children}
                {IconTrailing && <IconTrailing className="size-5 shrink-0" />}
            </span>
        </AriaButton>
    );
};
