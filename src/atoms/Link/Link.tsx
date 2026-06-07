import type { AnchorHTMLAttributes } from "react";
import { cx } from "@/utils/cx";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    className?: string;
}

/** Inline text link using brand text tokens. */
export const Link = ({ className, children, ...props }: LinkProps) => (
    <a
        {...props}
        className={cx(
            "rounded-xs font-semibold text-brand-secondary outline-none transition hover:text-brand-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            className,
        )}
    >
        {children}
    </a>
);
